---
title: "关于程序摄像头Trace Profiling的十大热门问题"
description: "关于程序摄像头Trace Profiling的十大热门问题"
lead: ""
date: 2022-11-10T10:16:39+08:00
lastmod: 2022-11-10T10:16:39+08:00
draft: true
images: []
type: docs
menu:
  docs:
    parent: "use-cases"
    identifier: "qa-about-trace-profiling-d0ab4f618705ed7b1279e1639840fa1b"
weight: 010
toc: true
---

“ Trace-Profiling通过eBPF技术将程序代码执行过程转换成操作系统资源消耗过程，并融合tracing、logging、metrics等多种可观测性技术，形成一个类似光学摄像头的程序摄像头。主要可以帮助开发者了解程序执行过程当中每一毫秒在干什么。”
***

>Q：Trace Profiling可以解决什么场景下的问题？

A：请参考：Kindling程序摄像头——Trace-Profiling功能正式发布


> Q：Trace Profiling捕捉的是一次请求下，所有工作线程的执行实况，这些线程是指请求执行这段时间内，执行了事件的线程吗？

A：捕捉的是所有工作线程的执行情况。从eBPF角度是分不出来哪些线程是与请求有关，所以我们有个关键线程概念，关键线程概念就是执行此次请求的线程，之所以展示所有线程的执行情况目的是为了能够发现关键线程在执行过程中被挂起的原因，很可能是由于其它线程如JVM虚拟机线程执行GC操作导致的。我们当前没有办法完全识别所有的场景，到底哪些线程的执行行为会影响关键线程的执行过程。为了能够真实还原程序的执行情况，所以我们将所有工作线程的执行情况都记录展示出来，之后靠人为对比分析关键线程被挂起时，其它线程在做什么，从而判断是哪些线程导致关键线程被挂起的。

> Q： 这么多工作线程，什么是本次请求的关键线程？判定依据是什么？

A：关键线程是在此进程当中，处理此次请求的线程。判定依据是通过与tracing系统做集成，比如与skywalking集成，可以清晰无误的判定处理此次请求的线程。

> Q：Kindling agent是怎么捕捉到线程的执行事件的？又是怎么划分某个事件具体是在net？lock？futex？cpu on？file？epoll？other？

A：通过对多次switch做判断，从而判断出oncpu的时间。通过对关键系统调用进行区分判断offcpu类型，比如write read归属到IO，再根据fd的属性是网络还是文件从而判断是网络IO还是文件IO。epoll就是网络系统调用。futex是一个比较难以解释的系统调用，因为程序在太多场合使用了futex，目前已经识别主要场景有如下：

- 线程空闲

- 线程执行锁操作

- 线程被挂起

- java程序的sleep操作实现

我们是通过如下规则判断futex到底是何意义的：

- 在关键线程的trace start时间之前的futex是空闲状态

- 从JVM中获取java虚拟机层面锁相关信息，通过此信息解释在关键线程trace start 与 trace end的futex时间

在排除以上两种情况之后，在关键线程trace start与trace end之间的futex，绝大多数情况我们认为就是被其他线程干扰导致的挂起时间。在执行一次trace当中的业务代码当中，我们认为基本不会有开发写sleep操作，如果有写，确实在当前情况下，是比较难以区分sleep的futex与线程干扰的挂起操作。

> Q：一次请求的IO/Trace start、End分别从哪一刻开始算？

A：对于一次请求过程而言，实际执行流程是操作系统先完成数据准备，也就是IO start，等有可用执行线程之后，线程会将IO http数据转成序列化对象，然后调用springcloud的control或者dubbo的服务接口开始一次trace，所以IO start是早于trace start的，但是在显示的时候，两者时间可能非常接近，所以基本重合了，但是如果出现线程不够的情况下，可以明显看出io start早于trace start。当请求trace在业务代码层被处理结束之后，也就是tracing系统将trace发出来的时候trace end会被记录，之后当请求对应的响应通过系统调用写回的时候点，我们记录为io end。

> Q：Kindling agent安装为什么要基于k8s的环境？如果小公司没有装k8s环境，不装docker可以用Trace Profiling吗？

A：理论上非k8s环境是可以使用，但是kindling目标用户是云原生的用户，非k8s的用户不是我们的目标用户。主要有以下几点考虑。

在非云原生的环境中操作系统版本对eBPF的支持可能性较低

在非云原生的环境中，遇到比较复杂的问题可能性较小，简单问题可以使用tracing、logging、metrics工具解决

> Q：使用Trace Profiling前，为什么要安装Skywalking探针？它在里面采集了哪些数据？和Kindling agent是怎么分工合作的？

A：之所以叫Trace profiling就是要分析一次trace中的span实际执行情况，所以一定需要和trace系统对接才能得到trace相关信息。因为我们目前只对接了国内常用的skywalking，所以要求用户先安装skwwalking探针，skywalking探针采集的数据就是按照其原有工作正常工作，我们没有改造skywalking探针。对接原理就是我们需要trace探针或者sdk通知我们当前执行的请求的线程是哪一个线程，以及trace开始时间和结束时间。

> Q： 如何安装Kindling，并开启Trace Profiling功能？

A：请参考安装教程：

[安装kindling](/docs/installation/kindling-agent/install-kindling-in-kubernetes/)

[启用Trace Profiling功能](/docs/usage/enable-trace-profiling/)

项目开源地址：

[官网地址](http://kindling.harmonycloud.cn/)

[GitHub](https://github.com/kindlingproject/kindling)



Q： 如何操作使用Trace Profiling？

A：请参考[操作教程](/docs/usage/trace-profiling-manual/)
     



Q：我还有别的疑问和想法，或者使用上遇到问题，该怎么联系你们？


