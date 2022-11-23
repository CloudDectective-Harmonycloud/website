---
title: "Frequently Asked Questions"
description: ""
lead: ""
date: 2022-11-09T17:21:26+08:00
lastmod: 2022-11-09T17:21:26+08:00
draft: false
images: []
menu:
  docs:
    parent: ""
    identifier: "faq-ac572dd3e16ff947537de522dc356f12"
weight: 030
toc: false
---

- [Error: Precompiled module at /opt/.kindling/ is not found](#error-precompiled-module-at-optkindling-is-not-found)
- [Error: Prometheus cannot match error](#error-prometheus-cannot-match-error)
- [kindling probe init err: xxxxxx: Permission denied](#kindling-probe-init-err-xxxxxx-permission-denied)

### Error: Precompiled module at /opt/.kindling/ is not found
#### Problem description and logs
If the kindling pod is not running normally, you can use the following command to check the logs.
```bash
kubectl logs --tail=100 -f kindling-agent-xxxx -c kindling-agent -n kindling
```

```c
* Mounting debugfs
* Failure to find a BPF probe, try to load kernel probe
* Unloading kindling-falcolib-probe, if present
* Trying to find precompiled kindling-falcolib-probe for 4.19.1-1.el7.elrepo.x86_64
* Error: Precompiled module at /opt/.kindling/ is not found, and the agent will not work as expected
Start kindling probe...
KINDLING_PROBE_VERSION: v0.1-2021-1221
Unable to load the driver
kindling probe init err: error opening device /host/dev/kindling-falcolib0. Make sure you have root credentials and that the kindling-falcolib
```

#### Solution

1. You must install the kernel headers manually first.

**For Debian-style distributions,** run the command:

```bash
apt-get -y install linux-headers-$(uname -r)
```

**For RHEL-style distributions,** run the command:
```bash
yum -y install kernel-devel-$(uname -r)
```
Of course, you can also [download RPM files](/docs/installation/download-linux-kernel-headers) manually to install the header files.

2. Rebuild the Kindling Agent image.

```bash
bash -c "$(curl -fsSL https://k8s-bpf-probes-public.oss-cn-hangzhou.aliyuncs.com/recompile-module.sh)"
```

The product of this step is an image. Please ensure that the image can be accessed by the k8s cluster node. Maybe you can upload the image to a private harbor, or compress it and distribute it to each node of the k8s cluster. (You should set the `imagePullPolicy` of kindling-agent to `ifNotPresent` when compress and distribute image.)

3. Finally, modify the image name of Kindling Agent.

```bash
kubectl set image ds/kindling-agent kindling-agent=kindlingproject/kindling-agent:bymyself -n kindling
```

### Error: Prometheus cannot match error

#### Problem description and logs
After executing the script install.sh. The following error occurred:
```
error: unable to recognize "kindling-prometheus-servicemonitor.yml": 
no matches for kind "ServiceMonitor" in version"monitoring.coreos.com/v1"
```

#### Solution

If you have not installed Prometheus, please visit [Prometheus-Operator](https://github.com/prometheus-operator/prometheus-operator)to install it.

If you have installed Prometheus without operator, please ignore this error and manually configure the exposed metrics endpoint of Kindling Agent in Prometheus. The URL is `http://localhost:9500/metrics`.


### kindling probe init err: xxxxxx: Permission denied

#### Problem description and logs

```c
kindling probe init err: can't create map: Permission denied
```
or
```c
insmod error:cloud not insert xxx.ko:Permission denied
```

#### Solution
- Confirm that the kindling agent has enabled the privileged mode.
- Confirm that SELinux is turned off on the node where the kindling agent is located. See details at [Disabling SELinux](https://www.ibm.com/docs/ja/ahts/4.0?topic=t-disabling-selinux).
- Confirm that CRI is running with root privileges.
