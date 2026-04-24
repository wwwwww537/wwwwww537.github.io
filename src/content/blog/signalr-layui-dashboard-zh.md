---
lang: 'zh'
title: '.NET SignalR + Layui：打造车间实时安灯大屏'
status: 'COMPLETED'
category: 'Web开发'
desc: '拒绝 setTimeout 轮询！教你利用 SignalR 推送，结合 Layui Table 实现局部无刷新数据更新的监控大屏。'
tech: ['C#', 'SignalR', 'Layui']
pubDate: 2026-04-24
---

之前车间大屏的数据刷新都是用 AJAX 定时器轮询，既浪费服务器资源，又有肉眼可见的延迟。重构时我们果断切到了 **SignalR**。

在前端（Layui环境）接入 SignalR 非常简单：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/5.0.11/signalr.min.js"></script>
<script>
    var connection = new signalR.HubConnectionBuilder()
        .withUrl("/equipmentHub")
        .withAutomaticReconnect()
        .build();

    // 监听后端发来的机器报警事件
    connection.on("ReceiveAlarm", function (machineCode, alarmMsg) {
        layer.msg('机器 ' + machineCode + ' 异常: ' + alarmMsg, {icon: 2});
        
        // 找到表格中对应的行并标红 (DOM 级别的魔改)
        $('td[data-field="MachineCode"] div:contains("'+machineCode+'")')
            .closest('tr')
            .css('background-color', '#ffb3b3');
    });

    connection.start();
</script>
```

这段代码的核心在于：收到事件后，利用 jQuery 找到表格特定的 DOM 节点变色，而不是调用 `table.reload()` 去刷爆接口。这种“局部手术”才是工业级实时看板该有的素质。