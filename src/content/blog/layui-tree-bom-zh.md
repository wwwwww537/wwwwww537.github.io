---
lang: 'zh'
title: 'Layui Tree 魔改：百万级 BOM 树形结构的异步懒加载'
status: 'ACTIVE'
category: 'Web开发'
desc: '在制造业中 BOM 层级极深。分享如何利用 Layui 的 Tree 组件配合 C# 后端实现懒加载，避免页面卡死。'
tech: ['Layui', 'JavaScript', '前端优化']
pubDate: 2026-04-24
---

搞过 ERP 或 MES 的都知道，复杂的装备制造 BOM 树往往有十几层，总节点数上百万。如果一次性查出所有数据丢给前端 `layui.tree` 渲染，浏览器直接崩溃。

**解决方案：异步懒加载（Lazy Load）。**
原生 Layui Tree 支持点击展开事件，我们可以利用这个机制，动态向后端请求子节点数据。

前端核心代码：
```javascript
layui.use(['tree'], function(){
  var tree = layui.tree;

  tree.render({
    elem: '#bomTree',
    data: [{ title: '最终产品 A', id: '1', spread: false, children: [] }], 
    click: function(obj){
      var node = obj.data;
      // 如果没有子节点且没有加载过
      if(!node.children || node.children.length === 0){
        // 模拟 Ajax 请求后端
        $.get('/api/BOM/GetChildren?parentId=' + node.id, function(res){
           // 更新数据并重新渲染，或利用 DOM 操作追加
           appendNodeToLayuiTree(node.id, res.data);
        });
      }
    }
  });
});
```

**后端配合**：千万不要在 SQL 里写递归查所有！只查 `ParentId == 传入参数` 的第一层数据返回即可。这种方式加载多庞大的 BOM 都不怕。