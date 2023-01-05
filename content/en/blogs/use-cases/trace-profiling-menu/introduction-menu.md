---
title: "生产环境10分钟黄金时间快速排障手册"
description: "生产环境10分钟黄金时间快速排障手册"
lead: ""
date: 2022-11-10T10:16:39+08:00
lastmod: 2022-11-10T10:16:39+08:00
draft: false
images: []
type: docs
menu:
  docs:
    parent: "use-cases"
    identifier: "observe-java-lock-d0ab4f618705ed7b1279e1639840fa1b"
weight: 001
toc: true
---

### 1. 当前可观测性技术采用之后，运维&开发普遍面临的问题
- 指标太多：不知什么时候看何种指标
- 依赖经验和百度：根据经验采用排除法去排查各种可能的异常指标。控制台、日志、trace追踪、数据库管理平台......各种工具来回切换，需要运维和开发协作，将数据和信息有效组织起来，解决问题时间周期不可控
- 依赖复现、日志埋点：生产环境是黑盒子，我们往往靠推理，根据现象反推系统行为，但是对于很多非必现问题无从下手
- 排障门槛：专业apm等工具存在一定的学习门槛，排查方向的准确性和经验能力成正比，而生产故障需要快速响应

### 2. 程序摄像头Trace Profiling：以标准化流程，分钟级定位全资源种类故障的根因

#### 2.1 程序摄像头Trace Profiling的标准化步骤排障

1. 找：通过Trace系统，结合时间点，找出相关可能存在问题的关键Trace
2. 查：通过关键Trace，查询其对应的Span信息
3. 分析：分析Span信息中的何种指标与预期不符

#### 2.2 程序摄像头Trace Profiling的排障效率：1-5-10分钟级定位
使用标准化步骤，实现1分钟发现问题，5分钟定位问题，10分钟解决问题。

#### 2.3 程序摄像头Trace Profiling的排障目标：定位全资源种类故障根因
生产环境常见场景问题排障实例

##### 2.3.1 CPU耗时异常
- [CPU不定时飙高怎么排查？](/blogs/use-cases/trace-profiling-menu/cpu-irregular-spike/)

##### 2.3.2 网络问题
- [应用与网络问题如何快速定位？](/blogs/use-cases/trace-profiling-menu/app-dns-slow/)

##### 2.3.3 文件IO问题
- [如何高效排查生产环境文件IO问题？](/blogs/use-cases/trace-profiling-menu/file-io-buffer/)

##### 2.3.4 多线程问题
- [如何快速排查生产环境多线程问题？](/blogs/use-cases/trace-profiling-menu/thread-pool-log/)

##### 2.3.5 业务问题
- [业务问题案例：通过报文判断生产环境Spring事务是否生效](/blogs/use-cases/trace-profiling-menu/mysql-commit/)


