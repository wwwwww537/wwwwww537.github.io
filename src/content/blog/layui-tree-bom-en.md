---
lang: 'en'
title: 'Hacking Layui Tree: Asynchronous Loading for Million-Node BOMs'
status: 'ACTIVE'
category: 'Web Dev'
desc: 'Bills of Materials (BOM) go deep. Learn to use Layui Tree with a C# backend to implement lazy loading and prevent browser crashes.'
tech: ['Layui', 'JavaScript', 'Performance']
pubDate: 2026-04-24
---

Anyone who's built ERP/MES systems knows that complex equipment BOMs can have dozens of levels and millions of nodes. If you fetch everything at once and feed it to `layui.tree`, the browser will crash.

**The solution: Asynchronous Lazy Loading.**
Native Layui Tree supports click/expand events. We can hijack this to fetch child nodes dynamically from the backend.

Frontend Core:
```javascript
layui.use(['tree'], function(){
  var tree = layui.tree;

  tree.render({
    elem: '#bomTree',
    data: [{ title: 'Final Product A', id: '1', spread: false, children: [] }], 
    click: function(obj){
      var node = obj.data;
      // Fetch if no children loaded yet
      if(!node.children || node.children.length === 0){
        $.get('/api/BOM/GetChildren?parentId=' + node.id, function(res){
           // Append nodes dynamically
           appendNodeToLayuiTree(node.id, res.data);
        });
      }
    }
  });
});
```

**C# Backend:** Never write a recursive SQL query to fetch everything! Only query the first layer where `ParentId == id`. Paired with Layui, this makes browsing massive BOMs effortless.