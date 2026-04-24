---
lang: 'zh'
title: 'MES 接口安全：.NET Core 中的 JWT + 自定义角色权限拦截器'
status: 'ACTIVE'
category: '后端开发'
desc: '禁止越权访问！分享一套我在 ASP.NET Core Web API 中常用的基于特性的鉴权拦截方案，精准到按钮级别。'
tech: ['C#', '.NET Core', '安全']
pubDate: 2026-04-24
---

MES 系统有很多敏感接口（比如作废工单、调拨库存）。如果只校验用户是否登录（`[Authorize]`）是远远不够的。必须实现到“角色”甚至“按钮”级别的权限控制。

为了不让业务代码里塞满 `if(user.Role == "Admin")`，我们通常自定义一个 `PermissionAttribute` 结合 `IAuthorizationFilter` 来拦截请求。

```csharp
[AttributeUsage(AttributeTargets.Method)]
public class RequirePermissionAttribute : Attribute
{
    public string PermissionCode { get; }
    public RequirePermissionAttribute(string code) => PermissionCode = code;
}

public class PermissionFilter : IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // 获取路由方法上的特性
        var endpoint = context.HttpContext.GetEndpoint();
        var attribute = endpoint?.Metadata.GetMetadata<RequirePermissionAttribute>();
        
        if (attribute != null)
        {
            // 从当前上下文中拿到解码后的 JWT UserID
            var userId = context.HttpContext.User.FindFirst("UserId")?.Value;
            
            // 查询数据库或缓存验证权限 (建议走 Redis 提速)
            bool hasAccess = CheckUserPermissionFromDb(userId, attribute.PermissionCode);
            
            if (!hasAccess)
            {
                // 抛出无权限 403 异常
                context.Result = new ForbidResult();
            }
        }
    }
}
```

在 Controller 里使用时极其优雅：
```csharp
[HttpPost("DeleteOrder")]
[RequirePermission("ORDER_DELETE")] // 只需要打上这个标签
public IActionResult DeleteOrder(string orderId) { ... }
```
这套方案代码侵入性极低，配合 Layui 前端的按钮隐藏逻辑，构成了完美的 RBAC 安全闭环。