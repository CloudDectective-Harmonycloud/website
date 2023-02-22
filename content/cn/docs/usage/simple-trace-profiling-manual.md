---
title: "Trace Profiling 简易视图操作手册"
description: "Trace Profiling 简易视图操作手册"
lead: ""
date: 2022-11-17T16:30:02+08:00
lastmod: 2022-11-17T16:30:02+08:00
draft: false
images: []
menu:
  docs:
    parent: "usage"
    identifier: "simple-trace-profiling-manual-a5a572690ee94332534a894817aead1d"
weight: 015
toc: true
---
## 1. Trace 筛选
根据Container name + pid，找到你需要检测的请求url，然后选择某次Profile记录之后，系统主页面会展示该次trace基本信息以及所有工作线程分析。
![](/media/202302/3.png)

## 2.页面布局
![](/media/202302/4.png)

## 3.span分析
如上图，span中橙色的部分代表span的起止时间范围，颜色越深、长度越长对应的耗时越长

## 4. 线程事件分析
点击span，可查看具体的线程事件分析，如下图。

![](/media/202302/5.png)

其中，上图中的橙色虚线框起来的部分，就代表刚才你点击的span执行的所有事件。

## 5. 事件单词说明
* futex：线程夯住，或者说在等待
* on：即cpu-on，即线程在执行CPU计算操作
* epoll：线程在查询系统内核文件描述符的读写状态
* net：线程在做网络调用，比如连接访问数据库、调用下游接口、网络监听请求等等操作。
* netread：指读取网络数据流（对于客户端来说是在读取响应，对于服务端来说是在读取请求）
* netwrite: 指写入网络数据流（对于客户端来说是在写入请求，对于服务端来说是在写入响应）
* lock：线程执行锁操作
* fileopen: 打开文件
* fileread: 读取文件
* filewrite: 写文件

