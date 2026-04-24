---
lang: 'zh'
title: '排错日记：记一次由于 EF Core 隐式事务导致的 SQL Server 死锁排查'
status: 'ACTIVE'
category: '后端开发'
desc: '生产环境突然崩溃？抽丝剥茧还原在复杂的 WMS 调拨业务中，死锁是如何产生的，以及通过 NOLOCK 隔离级别解决问题。'
tech: ['C#', 'SQL Server', 'EF Core']
pubDate: 2026-04-24
---

昨天下午，工厂车间反馈 PDA 调拨物料时系统一直在转圈，最后报 500 错误。我看了一下后台日志，赫然写着：`Transaction (Process ID 56) was deadlocked...`

**场景复盘：**
调拨业务需要两步：
1. `Update` 源库位的库存数量。
2. `Insert` 一条调拨流水日志记录。

由于使用了 EF Core 的 `SaveChanges()`，它会自动开启一个事务封装这两个操作。但是，恰好在同一时刻，PC 端的看板有一个巨复杂的接口正在执行 `Select * from t_Inventory` 统计数据。

在 SQL Server 默认的 `ReadCommitted` 隔离级别下，报表的 `Select` 加了共享锁（S锁），阻止了 PDA 端的 `Update` 排他锁（X锁）；而 PDA 的事务持有其他表上的锁，导致报表也查不动，最终死锁，事务被抛弃。

**解决方案：**

既然是大屏看报表，其实并不需要绝对严格的实时一致性，允许出现极其短暂的“脏读”。我直接在 Dapper 执行复杂报表查询时，给 SQL 加上了无锁提示：
```sql
SELECT A.Warearea, SUM(A.Qty) 
FROM t_Inventory A WITH(NOLOCK) 
GROUP BY A.Warearea
```
加了 `WITH(NOLOCK)` 后，`Select` 语句不再申请共享锁，彻底绕开了与业务写入事务的冲突。系统瞬间恢复如丝般顺滑。