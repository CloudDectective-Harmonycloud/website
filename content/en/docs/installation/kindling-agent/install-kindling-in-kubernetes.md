---
title: "Install Kindling in Kubernetes"
description: ""
lead: ""
date: 2022-11-09T17:13:13+08:00
lastmod: 2022-11-09T17:13:13+08:00
draft: false
images: []
menu:
  docs:
    parent: ""
    identifier: "install-kindling-in-kubernetes-46a4c80710566fe3060ed29a35cb033e"
weight: 025
toc: true
---

## Deploy Kindling Agent
**Note: Minikube is not supproted currently.**
Kindling Agent provides scripts and yaml files to deploy it in Kubernetes:

```bash
# Download yaml package
curl -O https://k8s-bpf-probes-public.oss-cn-hangzhou.aliyuncs.com/kindling-install.tar

# Extract and enter the installation directory
tar -xvf kindling-install.tar && cd kindling-install

# Make sure having the access to api-server, can run on Kubernetes master node.
sh install.sh
```

**Warning**: Kindling agent exposes metrics to Prometheus. Please make sure that Prometheus is installed by its operator. If not, you can manually visit `http://localhost:9500/metrics` for metrics.

## Verify Metrics

We deploy Kindling agent as daemonset to your cluster. So the number of kindling-agent pods correlates with the number of nodes in your cluster.

```bash
[root@master ~]# kubectl get po -n kindling
NAME                      READY   STATUS             RESTARTS   AGE
kindling-agent-5zz7v      2/2     Running            0          13h
kindling-agent-kv9gf      2/2     Running            0          13h
```

1. Make sure the status of the pods is running. If a pod does not run, please use `kubectl logs` to view the error messages and check the [**FAQ**](/docs/installation/faq) first. If you can't fix it by yourself, please feel free to open an issue on Github.
2. Execute `curl http://localhost:9500/metrics` on the node where Kindling Agent pod is located. You should see many metrics.

## FAQ
[click here](/docs/installation/faq "click here")