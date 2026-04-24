---
lang: 'en'
title: 'C# High-Frequency IoT Logging: Ditching EF for SqlBulkCopy'
status: 'ACTIVE'
category: 'Backend'
desc: 'When MES receives machine IoT telemetry, frequent single inserts choke the DB. Learn to optimize performance using SqlBulkCopy.'
tech: ['C#', 'Dapper', 'SQL Server']
pubDate: 2026-04-24
---

When collecting machine PLC data, reports come in once per second. One machine generates 80,000 records daily. Multiply that by 100 machines, and using Entity Framework's `SaveChanges()` for single inserts will crash SQL Server.

For this high-frequency, low-value log data, batch inserting is mandatory.

```csharp
using System.Data.SqlClient;

public void BulkInsertIotData(List<IotRecord> records)
{
    using (var connection = new SqlConnection(_connectionString))
    {
        connection.Open();
        
        // Build a DataTable as the medium
        DataTable dt = new DataTable();
        dt.Columns.Add("DeviceId", typeof(string));
        dt.Columns.Add("Temperature", typeof(decimal));
        dt.Columns.Add("Timestamp", typeof(DateTime));
        
        foreach(var item in records) {
            dt.Rows.Add(item.DeviceId, item.Temperature, item.Timestamp);
        }

        // Use SqlBulkCopy for extreme write speeds
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

Coupled with an in-memory queue (like `BlockingCollection`), trigger a `WriteToServer` every 1,000 records. Writes that took 10 seconds will drop to 50 milliseconds.