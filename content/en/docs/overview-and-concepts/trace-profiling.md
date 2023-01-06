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

With traces, metrics, and logs, many issues still can’t be understood easily. Trace-profiling is trying to integrate the OnCPU and OffCPU events within the traces and collect the logs output during the trace execution timeframe.

OnCPU events are just like the flame graph, but the code has been collected at the thread level instead of the process level. And the trace was executed by one thread, so users can understand how the trace was executing on the CPU.

OffCPU events are the opposite of OnCPU events. As for the trace analysis, most traces spend a lifetime waiting for the locks, database query, remote process call, file reading, or file writing. All of these events cause the thread in waiting status, and they are considered as OffCPU events.

## What does Trace Profiling do?
- How all threads were executed is recorded and can be replayed.
- The exact thread which executed the trace span is highlighted.
- The logs printed by each thread are collected and correlated to the relative thread with its timestamp.
- The code execution flame graph is correlated to the time series where the CPU is busy.
- The network-related metrics are correlated to the time series where the network syscalls are executing.
- The file-related metrics are correlated to the time series where the file syscalls are executing.

## More
Interested? See the [use cases](/blogs/use-cases/trace-profiling-menu/introduction-menu/) and [have a try](/docs/usage/enable-trace-profiling/)!