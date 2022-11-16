---
title: "Prometheus vs. Kindling vs. APM"
description: ""
lead: ""
date: 2022-11-09T16:59:47+08:00
lastmod: 2022-11-09T16:59:47+08:00
draft: false
images: []
menu:
  docs:
    parent: "overview-and-concepts"
    identifier: "prometheus-kindling-apm-b99f8aef19946d791ebb2130c4f7e72e"
weight: 025
toc: true
---

## Prometheus vs. Kindling
The common question for Kindling is "What is the difference between Prometheus and Kindling". As Prometheus is the de-facto monitor tool for  CloudNative world. Kindling is not trying to replace Prometheus. The goal of Kindling is trying to help developer understanding the app behavior from the kernel to code. 

### What is missing for Prometheus? 
Prometheus is designed for metric collection and storage, and it works very well. But only Prometheus won't work for your apps in k8s, when an product issue arises. 

The first missing part is tracing. Prometheus can do metric collection and storage very well, but only discrete metric data can't be inspired for troubleshooting. The trace is the a good way of displaying data in a integration way, all the related metric data can be grouped and correlated into a single trace for issue digging. That's why so many APM tools use the trace for troubleshooting. 

The second missing part is kernel metric and four "Golden Metrics". Kindling is trying to help developer and operator understand the app behavior from kernel to code. So all the missing metric from the kernel like DNS, throughput, TPS, Latency, disk metric, [one trace file read bandwidth, one trace file write bandwidth](), will be collected by Kindling and export to Prometheus in the Prometheus way. The metric which has been collected by Prometheus already, won't be collected again. Kinding is just do a integration with Prometheus to get the full picture of all the metric from kernel to code. 
## APM vs. Kindling
From our point of view, tracing is a good way of grouping all the metric data. APM or distributed tracing tool Zipkin do the job very well. But these tools work only in the code level, if the issue happens in the code, then the issue can fixed quickly by using these tool. But what if the root cause is not the code, and it is caused by network or disk issue. These tools will show indirect affect from code perspective. For instance, if an disk issue happen, the flushing or write syscall takes much more time than it used to be. The developer gets code perspective report, and the code snippet which cause the flush or write syscall, will confuse the developer. It will take a lot of time for the developer to find the root cause, because the issue is not apparent from the code, the developer has to dig into logs for some hints, but usually the hints will be found a few hours later or a few days later. From kernel perspective, the issue can be identified easily, especially the data has been grouped into a rpc trace.

Kindling is trying to resolve the product issue from kernel to code. Kindling is trying to identify which part is to be blamed for the production issue first. If it is a code issue, the APM dashboard should be used to resolve the issue. If it is an infrastructure issue, then related metric from kernel will be displayed for further digging.

Kindling can't do the distributed tracing without span information. But the trace way is good to identify issue quickly. So Kindling does the partial tracing named as RPC trace. Kindling integrate all the metric information into one [RPC trace](/docs/overview-and-concepts/rpc-trace). Usually **RPC trace** and ServiceMap work together to locate the exact rpc call causing the problem in not very complicated MicroService environment.

## Conclusion
As above statement, Kinding, APM, Prometheus can be working as a whole monitor set to help developer understand the app behavior from kernel to code. The infrastructure layer can't be regard as static and stable anymore in the Cloud environment, because the infrastructure is software defined which is code too and it do evolves as long as the app code. 
