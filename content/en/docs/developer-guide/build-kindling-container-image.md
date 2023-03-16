---
title: "How to Build Kindling"
description: ""
lead: ""
date: 2022-11-10T10:42:42+08:00
lastmod: 2022-11-10T10:42:42+08:00
draft: false
images: []
menu:
  docs:
    parent: "developer-guide"
    identifier: "build-kindling-container-image-f34e05433930cca59995f456a1303144"
weight: 015
toc: true
---

## Build kernel modules and eBPF modules
**Note: Necessary only if your kernel version is not supported by Kindling. Otherwise this step is optional.**

Following steps are used to compile local kernel modules and eBPF modules, which you can skip if using precompiled modules by Kindling.


```bash
# Get the latest repository
git clone -b kindling-dev https://github.com/Kindling-project/agent-libs
cd agent-libs

# Kernel headers are used to compile kernel modules and eBPF modules. The version of kernel headers must match the runtime. Warning: The command might not work with some kernel, or install kernel headers in another way. http://rpm.pbone.net is a choice to find RPMs for RHEL-like distributions.
# Debian-like distributions
sudo apt-get -y install linux-headers-$(uname -r)
# RHEL-like distributions
sudo yum -y install kernel-devel-$(uname -r)

# Compile the kernel module and eBPF
docker run -it -v /usr:/host/usr -v /lib/modules:/host/lib/modules -v $PWD:/source kindlingproject/kernel-builder:latest
# Create a tarball which is needed when building the probe container image
tar -cvzf kindling-falcolib-probe.tar.gz kindling-falcolib-probe/
# Copy and wait for building the image.You may need to prefix /kindling path with your own absolute path
cp kindling-falcolib-probe.tar.gz kindling/collector/docker/
```

## Build kindling-agent itself
1. Build the binaries using the building image
```bash
git clone https://github.com/kindlingproject/kindling.git
# Run the compiling container
cd kindling/deploy/scripts/ && sh run_docker.sh
# Use make to build the binaries
make
```

2. Build a runnable image
```bash
cd kindling
docker build -t kindling:latest -f collector/docker/Dockerfile collector/docker/
```