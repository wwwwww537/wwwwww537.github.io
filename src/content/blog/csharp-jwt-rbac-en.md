---
lang: 'en'
title: 'MES API Security: JWT + Custom Role Interceptors in .NET Core'
status: 'ACTIVE'
category: 'Backend'
desc: 'Prevent unauthorized access! Sharing a custom attribute-based authorization interceptor scheme commonly used in ASP.NET Core Web APIs.'
tech: ['C#', '.NET Core', 'Security']
pubDate: 2026-04-24
---

MES systems have many sensitive endpoints (e.g., voiding work orders, transferring inventory). Simply checking if a user is logged in (`[Authorize]`) is highly insufficient. We must implement Role-Based Access Control down to the "button" level.

To avoid cluttering business logic with `if(user.Role == "Admin")`, we typically use a custom `PermissionAttribute` combined with an `IAuthorizationFilter` to intercept requests.

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
        // Get the attribute on the routed method
        var endpoint = context.HttpContext.GetEndpoint();
        var attribute = endpoint?.Metadata.GetMetadata<RequirePermissionAttribute>();
        
        if (attribute != null)
        {
            // Retrieve decoded JWT UserID from context
            var userId = context.HttpContext.User.FindFirst("UserId")?.Value;
            
            // Check DB or Cache for permissions (Redis recommended)
            bool hasAccess = CheckUserPermissionFromDb(userId, attribute.PermissionCode);
            
            if (!hasAccess)
            {
                // Throw 403 Forbidden
                context.Result = new ForbidResult();
            }
        }
    }
}
```

Usage in the Controller is incredibly elegant:
```csharp
[HttpPost("DeleteOrder")]
[RequirePermission("ORDER_DELETE")] // Just attach this tag
public IActionResult DeleteOrder(string orderId) { ... }
```
This scheme is minimally invasive and, combined with Layui frontend button-hiding logic, creates a perfect RBAC security loop.