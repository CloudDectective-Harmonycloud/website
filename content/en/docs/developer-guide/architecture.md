---
title: "Architecture"
description: ""
lead: ""
date: 2022-11-10T10:40:46+08:00
lastmod: 2022-11-10T10:40:46+08:00
draft: false
images: []
weight: 010
toc: true
---

## The Project Architecture

![](/media/202201//1642657653.178629.png)

## Agent Architecture

Kindling agent from detailed view can be splited into **Kindling Probe** and **Kinding Collector**.

- **Kindling Probe** is composed of kernel-space modules which produce **kernel events** and **user-space** module controller which consumes **kernel events** and transform them into structured format, namely **Kindling Events.**

- **Kindling Collector** process and analyze **Kindling Events** into metrics and traces with the kubernetes metadata, and export them to the Prometheus server.

## Detailed Data Flow

The data flows with the following sequence:

1. **Kernel Events** are collected from kernel space, passed through ringbuffer: eBPF module uses perf-buffer, while kernel module uses ringbuffer self-defined.

2. In user-space, **Kindling Probe** correlates container information, thread information, fd information to **Kernel Events** (if it has, some events may fail to correlate to any thread or fd).
3. **Kindling Events** will be transferred from **Kindling Probe** to **Kindling Collector** by **Event Publisher** through _CGO_.
4. Then **Kindling Collector** will parse **Kindling Events**, judge if it's a request or reponse, analyze its protocol, etc. **Collector** also aggregates requests data for sending and integrating kubernetes metadata, and finally export the yields (metrics and traces) to the Prometheus server.