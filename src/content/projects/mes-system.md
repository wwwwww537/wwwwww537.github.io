---
lang: 'zh'
title: 'MES 制造执行系统'
status: 'ACTIVE'
category: 'Industrial Middleware'
desc: '高并发工业设备报文解析引擎，支持多协议数据洗涤。'
tech: ['.NET Core', 'MQTT.net', 'SQL Server']
---

## > SYSTEM_OBJECTIVE
本项目为解决车间高频报文解析而生，不在此展示源码，重点在于 **状态机的流转控制**。

## > ARCHITECTURE_TOPOLOGY
```text
[ Device Node ] --(MQTT)--> [ Validation Queue ]
                                |
                                v
                      +-------------------+
                      |   Rule Engine     |
                      +-------------------+
                                |
                                v
[ SQL Views ] <--(Sync)-- [ State Machine ]
```

## > CORE_METRICS
* **吞吐量**: 1200 TPS
* **可用性**: 99.99%
* **延迟**: < 50ms