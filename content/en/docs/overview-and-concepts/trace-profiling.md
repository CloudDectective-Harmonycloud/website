---
title: "Trace Profiling"
description: ""
lead: ""
date: 2022-11-08T18:00:38+08:00
lastmod: 2022-11-08T18:00:38+08:00
draft: false
images: []
menu:
  docs:
    parent: ""
    identifier: "trace-profiling-f93ab0de084913350b53e644f1e625f7"
weight: 015
toc: true
---

## What is Trace Profiling?
We define Trace Profiling as a feature that can tell users what happened for every thread during a distributing trace span.
## What does Trace Profiling do?
- How all threads were executed is recorded and can be replayed.
- The exact thread which executed the trace span is highlighted.
- The logs printed by each thread are collected and correlated to the relative thread with its timestamp.
- The code execution flame graph is correlated to the time series where the CPU is busy.
- The network-related metrics are correlated to the time series where the network syscalls are executing.
- The file-related metrics are correlated to the time series where the file syscalls are executing.

## More
Interested? See the [use cases](/blogs/use-cases/trace-profiling-menu/introduction-menu/) and [have a try](/docs/usage/enable-trace-profiling/)!