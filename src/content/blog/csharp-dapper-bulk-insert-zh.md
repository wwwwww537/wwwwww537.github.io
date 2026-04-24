---
lang: 'zh'
title: 'C# 高频 IoT 数据写入：抛弃 EF，拥抱 Dapper 批量插入'
status: 'ACTIVE'
category: '后端开发'
desc: '在 MES 接收机床 IoT 报文时，频繁的单条 Insert 会拖垮数据库。看看如何用 Dapper 和 SqlBulkCopy 优化性能。'
tech: ['C#', 'Dapper', 'SQL Server']
pubDate: 2026-04-24
---

在采集机床 PLC 数据时，通常是 1 秒钟上报一次。一台设备一天就是 8 万条数据。如果是 100 台设备，继续用 Entity Framework 的 `SaveChanges()` 去单条写入，SQL Server 直接宕机。

应对这种高频低价值的 Log 类数据，必须用批量写入：

```csharp
using System.Data.SqlClient;

public void BulkInsertIotData(List<IotRecord> records)
{
    using (var connection = new SqlConnection(_connectionString))
    {
        connection.Open();
        
        // 构建 DataTable 作为中间介质
        DataTable dt = new DataTable();
        dt.Columns.Add("DeviceId", typeof(string));
        dt.Columns.Add("Temperature", typeof(decimal));
        dt.Columns.Add("Timestamp", typeof(DateTime));
        
        foreach(var item in records) {
            dt.Rows.Add(item.DeviceId, item.Temperature, item.Timestamp);
        }

        // 使用 SqlBulkCopy 实现极致的写入速度
        using (SqlBulkCopy bulkCopy = new SqlBulkCopy(connection))
        {
            bulkCopy.DestinationTableName = "t_Iot_ParamValueRecord";
            bulkCopy.ColumnMappings.Add("DeviceId", "DeviceId");
            bulkCopy.ColumnMappings.Add("Temperature", "Temperature");
            bulkCopy.ColumnMappings.Add("Timestamp", "Timestamp");
            
            bulkCopy.WriteToServer(dt);
        }
    }
}
```

配合后端的内存队列（如 `BlockingCollection`），满 1000 条触发一次 `WriteToServer`。原来需要 10 秒写入的数据，瞬间降到 50 毫秒。