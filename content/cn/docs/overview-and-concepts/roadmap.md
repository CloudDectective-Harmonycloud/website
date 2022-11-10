---
title: "Roadmap"
description: ""
lead: ""
date: 2022-11-09T17:02:22+08:00
lastmod: 2022-11-09T17:02:22+08:00
draft: false
images: []
menu:
  docs:
    parent: "overview-and-concepts"
    identifier: "roadmap-070bf81946e7210db5ab41095a183c31"
weight: 030
toc: true
---

## Goal
The goal of Kindling is trying to help users understand the app behavior from kernel to user code stack. With the service map, network detail breakdown, and network-related metric, users can triage issues and route them to the corresponding team. With our trace-profiling, users can pinpoint the root cause in seconds. 

We have found that issues triage works well in the Kubernetes environment. If you find any issue that can't be identified which part(network, app code, infrastructure) causes the problem, please let us know. We will spend more time on triage work.

As far as we know, even with tracing, metrics, and logging, users still can't pinpoint the root cause easily, so Kindling will spend more effort to help users find it with trace-profiling. 

The following work item list has been identified, and we will prioritize these work items based on the feedback of the community. If you want some work to be done first or have some suggestions for pinpointing root causes, please join our bi-weekly meeting or the WeChat group, and let us know your thoughts.

## Work Items
### Data Integration
- Skywalking integration to get the trace info. (Done)
- Opentelmentry integration to get the trace info. (TBD)
- Pinpoint integration to get the trace info. (TBD)
- Prometheus integration for detailed IO metrics, network metrics, and CPU metrics. (TBD)
- Java code stack enhancement for network, file, and lock to help users understand how the userspace code causes the trace in waiting status. (TBD)
- Java code flame graph and native code flame graph coexist (Currently only Java code flame graph has been used). (TBD)
- Trace-profiling for Go/C/C++, currently trace-profiling only supports Java. (TBD)

### User-Friendly Enhancement
- Trace-profiling sample strategy without intervention to keep those valuable profiling results. (TBD)

### More Features
- Prometheus alert rule management. (TBD)
- Python Anomaly Detection Toolkit (ADTK) be used for threshold in Prometheus alert rules(TBD)

### Others
-  Standard version of Kindling（TBD）
