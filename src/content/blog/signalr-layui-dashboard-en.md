---
lang: 'en'
title: '.NET SignalR + Layui: Building a Real-Time Dashboard'
status: 'COMPLETED'
category: 'Web Dev'
desc: 'Reject setTimeout polling! Learn to use SignalR push combined with Layui Table partial DOM updates for live monitoring.'
tech: ['C#', 'SignalR', 'Layui']
pubDate: 2026-04-24
---

Previously, workshop dashboard data refreshes relied on AJAX timer polling. This wasted server resources and had visible lag. During refactoring, we decisively switched to **SignalR**.

Integrating SignalR in the frontend (Layui environment) is straightforward:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/5.0.11/signalr.min.js"></script>
<script>
    var connection = new signalR.HubConnectionBuilder()
        .withUrl("/equipmentHub")
        .withAutomaticReconnect()
        .build();

    // Listen for machine alarm events pushed by the backend
    connection.on("ReceiveAlarm", function (machineCode, alarmMsg) {
        layer.msg('Machine ' + machineCode + ' Error: ' + alarmMsg, {icon: 2});
        
        // Find the specific row in the table and turn it red (DOM manipulation)
        $('td[data-field="MachineCode"] div:contains("'+machineCode+'")')
            .closest('tr')
            .css('background-color', '#ffb3b3');
    });

    connection.start();
</script>
```

The core of this code is avoiding `table.reload()`, which spams the API. Instead, we use jQuery to find the specific DOM node and alter its color. This "surgical DOM manipulation" is what industrial real-time dashboards require.