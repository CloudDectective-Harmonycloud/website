---
title: "How to enable Trace Profiling"
description: ""
lead: ""
date: 2022-11-08T19:50:18+08:00
lastmod: 2022-11-08T19:50:18+08:00
draft: false
images: []
menu:
  docs:
    parent: "usage"
weight: 010
toc: true
---

## Prerequisites
- This feature only works on the Linux kernel 4.17 or newer.
- We recommend that users install the SkyWalking agent of Java before enabling trace profiling for full features supported.

## Instructions
> If you have not installed the Kindling agent, please do it first before you follow the instructions. See the [Installation](/docs/installation/kindling-agent/requirements) for how to install.

After you have installed the agent successfully, the function is disabled by default, and you need to manually enable it following the instructions:

1. Determine the IP of the host node where you want to enable the function to profile the processes.
2. The agent on each node will start a front-end web, which listens the port 9504 by default. Visit http://IP:9504 to open the page.
3. Click "Start Trace Detection" in the upper right corner. The startup process may last for 5 to 10 seconds. After the opening is successful, the button in the upper right corner will be turned on.

> **Notice**
>
> After enabling this function, all Java applications on the host node will be automatically installed with a kindling-java agent. The agent is used to make SkyWalking work together with Kindling and attach the async-profiler to your applications. See more details about the kindling-java agent [here](https://github.com/CloudDectective-Harmonycloud/kindling-java).

> ⚠️**WARNING**
> 
> AsyncProfiler will *Crash* with [two different paths](https://github.com/jvm-profiling-tools/async-profiler/issues/395#issuecomment-793626855). If your application has started with asyncProfiler(eg. Datadog), then DO NOT enable trace profiling.

4. Once the function is enabled, the profile data will be saved to files. You can refresh the page to view the latest data.
5. Click the upper filter box to filter the profile results to be viewed.

## Use cases
See the use cases on [Use Cases](/docs/usage). We appreciate any new cases from you. Please feel free to open an issue if you want to contribute your cases to the community. 