---
title: "How Kindling Agent Is Going to Evolve"
description: ""
lead: ""
date: 2022-11-09T17:04:17+08:00
lastmod: 2022-11-09T17:04:17+08:00
draft: false
images: []
menu:
  docs:
    parent: "overview-and-concepts"
    identifier: "how-kindling-agent-is-going-to-evolve-5d0c3424b5d45784289102aad11140d8"
weight: 035
toc: true
---
## The Role of the Kindling Agent
Currently, there is a lot of tools which can track kernel events partially.

- [tracee](https://github.com/aquasecurity/tracee/tree/main/tracee-ebpf) is part of tracee security project which can capture the kernel events open-sourced by Aqua.
- [BCC](https://github.com/iovisor/bcc) is a tool-set for BPF-based Linux IO analysis, networking, monitoring.
- [Elkeid](https://github.com/bytedance/Elkeid) is developed with Linux model stack as a kernel events capture tool open-sourced by bytedance.
- [sysdig](https://github.com/draios/sysdig) is part of Falco security project developed with eBPF and kernel module as a kernel track library open-sourced by Sysdig.

Kindling is trying to build a monitoring tool, and it just need the kernel events instead of inventing the wheel to capture kernel events.  It will be best to find one meet our reqirement instead of building the kernel events system from scratch. 

- The event need to be enriched with PID, TID, FD information, because with these information, the kernel events can be be correlated for one user request. BCC only capture the exact kernel event which has not populated with PID, TRD, FD information. There will be a lot of work to populate the BCC events with PID, TID, FD.

- The event need to be captured in all Linux environment, not only the Linux kernel version greater than 4.14. Because in China, above 70% the kubernetes has been deployed with centos 7 series distribution, and those distributions can't run fully functioned eBPF virtual machine. tracee doesn't meet this requirement, tracee events do have PID, TID, FD information, but it works only in Linux kernel version 4.14+.
- The technology stack should evolved with the eBPF technology stack, otherwise it will be replaced in short future. Elkeid is developed with Linux model technology stack, when the kernel version has been migrated from lower version to 4.14+, Linux model should not be the first choice.

Sysdig is a great framework which can work in eBPF mode or kernel module mode, and it do populate the kernel events with PID, TID, FD information.  But we cann't just juse it as the library, we will explain it in next chapter.
## How the Kindling agent is using sysdig
Although sysdig is a great framework, but it do have following limitation to be a perfect kernel event system:

- The interface description is not very clear. From our understanding, we need our developers graduated from computer science with operating system knowledge, can know how to leverage the interface without too much traning. Otherwise the learning-cure will block the progress. We want our developers focus on how to correlate the information to build the monitor tool instead of spending their time on learning how to get events from kernel. After we released the codes, who want to build trace tool or security tool can build their tool upon kindling agent. [Tracee](https://github.com/aquasecurity/tracee/tree/main/tracee-ebpf) has listing the interface as we want, we just want kindling agent to be the way tracee function. And if in future, all the kubernetes has been migrated to high linux kernel version, kindling agent probe may be replaced with tracee-ebpf module.

- The interface coupling is not very well, all the code need to integrated at very low level api. The developer will be lose their focus when they do the integration work. We want the api usage will be clear and separately.
- sysdig only support the syscall kernel events, and it doesn't support Kprobe and Uprobe events. For instance, we need uprobe to track the grpc call, so we add the kprobe and uprobe to sysdig framework.

Kindling agent has been forked from sysdig and translated to be an kernel event system with the following modification:

- Nobody need to be trained the usage of events interface to use the kernel events, the developed with operating system knowledge should just need read the reference documents, to find which events should be used in their senario.

- Kprobe and Uprobe events has been enriched.
- All the event will be documented, and hope these event information can be a standard for any system level tool to leverage.

## Kindling Agent Roadmap
As developing Kindling, we want a kernel event system can be easily adopted and our developer can focus on the monitor logic to go to market as early as possbile. But at this moment, there are no such kernel event system meeting the case. After releasing Kindling agent, we hope the Kindling agent can be used as the kernel event system in your project if you have the same demand.

The eBPF and Linux module complex detail will block many devoplers from building their own processing logic. We hope the community can work together to enrich more event type and fix the bugs.

From Kindling project perspective, the Kindling agent will be evolved in the following directions:
- The event list document will be maintained, so nobody need to learn the eBPF and Linux module details before developing the system level tool.

- The event list will be enriched with more uprobe and kprobe events. And we hope more and more developer join us to enrich the event list.
- The agent probe architecture will be refactoring to shorten the event develop life-cycle. we still thinking if bcc, tracee or any other tools can be integrated into kindling agent probe to shorten the event develop life-cycle. The solution has not been finalized yet. Suggestion are welcomed to how we shorten the event developing life cycle.
- And we still find the kernel event system, which meet all the reqirements, we can just replace kindling probe with that kernel event system. The kindling monitor tool should still work as expected.
