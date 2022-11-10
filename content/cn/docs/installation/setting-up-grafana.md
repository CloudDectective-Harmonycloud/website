---
title: "安装配置Grafana"
description: ""
lead: ""
date: 2022-11-09T17:14:38+08:00
lastmod: 2022-11-09T17:14:38+08:00
draft: false
images: []
menu:
  docs:
    parent: "installation"
    identifier: "setting-up-grafana-1853c6db1beeb614241c13156b3d81bd"
weight: 020
toc: true
---

Since the grafana plugin has not yet passed the plugin market review, we temporarily provide a pre-installed container image of kindling plugin and dashboard.

**1. Install Grafana in the namespace of kindling**
```bash
kubectl create -f https://k8s-bpf-probes-public.oss-cn-hangzhou.aliyuncs.com/kindling-grafana.yaml -n kindling
```

**2. Find the address of the Grafana and visit the page**
```bash
kubectl get svc -n kindling | grep grafana
```

**3. Add a data source of Prometheus**

Configure the installed Prometheus address in the cluster. The data source name must be Prometheus.

![](./media/202203/1647402235288-695bb9d8-74be-4f47-ae37-f12812709442_1647484360.png)

See more detail for [how to add a data source](https://grafana.com/docs/grafana/latest/datasources/add-a-data-source/).


**4. Verify**

Click `Search dashboard`, you should be able to see the dashboards.

![](./media/202203/2022-03-29_143240_911076.png)


![](./media/202203/1647402494310-fa6c1a9a-0ac7-4f3c-94a7-5d35f43bbfc8_1647484377.png)


For more information, please visit the [grafana installation documentation](https://grafana.com/docs/grafana/latest/installation/kubernetes/).
