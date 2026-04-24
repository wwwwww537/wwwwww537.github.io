---
lang: 'en'
title: 'Debugging Diary: Uncovering SQL Server Deadlocks caused by EF Core'
status: 'ACTIVE'
category: 'Backend'
desc: 'Production suddenly crashes? Tracing how deadlocks occur in complex WMS transfer operations and solving them via NOLOCK isolation.'
tech: ['C#', 'SQL Server', 'EF Core']
pubDate: 2026-04-24
---

Yesterday afternoon, the factory floor reported that PDA material transfers were freezing, eventually throwing 500 errors. I checked the backend logs and saw: `Transaction (Process ID 56) was deadlocked...`

**Scenario Breakdown:**
The transfer business logic requires two steps:
1. `Update` the source bin's inventory quantity.
2. `Insert` a transaction flow log record.

Because we used EF Core's `SaveChanges()`, it automatically wrapped these in a transaction. However, at the exact same moment, the PC dashboard was executing a massive report query: `Select * from t_Inventory`.

Under SQL Server's default `ReadCommitted` isolation level, the report's `Select` placed a Shared Lock (S), preventing the PDA's `Update` Exclusive Lock (X). Concurrently, the PDA transaction held locks on other tables, blocking the report. This circular dependency caused a deadlock.

**The Solution:**

Since it's just a dashboard report, strict real-time data consistency isn't critical; momentary "dirty reads" are acceptable. I added a no-lock hint to the raw SQL executed via Dapper for the report:
```sql
SELECT A.Warearea, SUM(A.Qty) 
FROM t_Inventory A WITH(NOLOCK) 
GROUP BY A.Warearea
```
By adding `WITH(NOLOCK)`, the `Select` statement no longer requests Shared Locks, completely bypassing conflicts with business write transactions. The system returned to being buttery smooth instantly.