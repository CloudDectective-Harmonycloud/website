---
title: "* 如何添加新的事件"
description: ""
lead: ""
date: 2022-11-15T14:41:39+01:00
lastmod: 2022-11-15T14:41:39+01:00
draft: false
images: []
type: docs
menu:
  blogs:
    parent: "development"
    identifier: "add-new-hooks-368e7c47d3173fbdb48e694ba59489bb"
weight: 055
toc: true
---
有三种事件可供开发者添加：
- [Tracepoint Event](#add-a-tracepoint-event)
- [Syscall Event](#add-a-syscall-event-based-on-tracepoint)
- [Kprobe/Kretprobe Event](#add-event-based-on-kprobe-and-kretprobe)

# Add a tracepoint event
## Step 1: Define ppm_event_type
### File
driver/ppm_events_public.h
### Description
ppm_event_type是具体的事件类型，通过enum对应，需要注意的是enum值需后面的g_event_info表中的index值对应，需要保持一致。
定义ppm_event_type沿用sysdig的定义一致性，需要定义事件入口和出口事件，如入口事件PPME_SOCK_INET_SOCK_SET_STATE_E = 318, PPME_SOCK_INET_SOCK_SET_STATE_X = 319，实际只是用了入口事件，添加后需要修改对应的PPM_EVENT_MAX值。
e.g.
```protobuf
PPME_SOCK_INET_SOCK_SET_STATE_E = 318,
PPME_SOCK_INET_SOCK_SET_STATE_X = 319,
```
### Result
```c
// ppm_events_public.h
enum ppm_event_type {
        PPME_SOCK_INET_SOCK_SET_STATE_E = 318,
        PPME_SOCK_INET_SOCK_SET_STATE_X = 319,
        PPM_EVENT_MAX = 320
}
```

## Step 2: Define g_event_info
### File
driver/event_table.h
### Description
g_event_info是关于struct ppm_event_info的数组，添加相关事件到ppm_event_type对应的位置。
ppm_event_info格式如下，指定name，category，flags，如果有参数还需要定义参数ppm_param_info（参数名、参数类型、打印格式、info指针（如果是flags变量，指向一个ppm_name_value数组；如果是动态变量，指向一个ppm_param_info数组），还有一个ninfo记录数组长度。
```c
struct ppm_event_info {
	char name[PPM_MAX_NAME_LEN]; /**< Name. */
	enum ppm_event_category category; /**< Event category, e.g. 'file', 'net', etc. */
	enum ppm_event_flags flags; /**< flags for this event. */
	uint32_t nparams; /**< Number of parameter in the params array. */
	struct ppm_param_info params[PPM_MAX_EVENT_PARAMS]; /**< parameters descriptions. */
} _packed;
```
### Result
```protobuf
// event_table.c
const struct ppm_event_info g_event_info[PPM_EVENT_MAX] = {
				...,
        /* PPME_SOCK_INET_SOCK_SET_STATE_E */{"inetsockstate", EC_NET, EF_USES_FD, 2, {{"sport", PT_UINT16, PF_DEC}, {"dport", PT_UINT16, PF_DEC} } },
				/* PPME_SOCK_INET_SOCK_SET_STATE_X */{"NA7", EC_NET, EF_UNUSED, 0}
}
```
## Step 3: Define filler
### File
driver/ppm_fillers.h, driver/filler_table.c
### Description
事件push到ring buffer前需要根据之前定义的事件填充参数，需要使用到filler。在ppm_fillers.h中添加FN(sock_inet_sock_set_state_e)定义，以及filler_table.c中的g_ppm_events注册填充函数，[PPME_SOCK_INET_SOCK_SET_STATE_E] = {FILLER_REF(sock_inet_sock_set_state_e)}。需要注意，g_ppm_events添加的位置需要和PPME_SOCK_INET_SOCK_SET_STATE_E的enum值相同。
### Result
```c
// ppm_fillers.h + 
#define FILLER_LIST_MAPPER(FN)          \
    FN(sys_linkat_x)            \
    FN(sock_inet_sock_set_state_e)       \ 
    FN(terminate_filler)          

// filler_table.c +
const struct ppm_event_entry g_ppm_events[PPM_EVENT_MAX] = {
    ... ,
    [PPME_SOCK_INET_SOCK_SET_STATE_E] = {FILLER_REF(sock_inet_sock_set_state_e)},
    [PPME_SOCK_INET_SOCK_SET_STATE_X] = {FILLER_REF(sys_empty)}
}
```
## Step 4: Write filler
### File
driver/ppm_fillers.h, driver/filler_table.c, driver/bpf/types.h
### Description
定义fillers能够让bpf program在触发tracepoint后找到对应的filler进行调用，实际需要填充什么参数，如何填充需要编写对应的fillers函数。利用宏定义FILLER(sock_inet_sock_set_state_e, false)，其中sock_inet_sock_set_state_e和上一步定义fillers的填充函数名相同，false表示这不是一个系统调用。
这个宏的展开定义了两个函数bpf_xxx是bpf program中的section，存储在tail_map中，被bpf probe调用（下一步），完成evt_hdr填充，调用__bpf_xxx完成参数填充，最后调用push_evt_frame推到ring buffer中。
```c
__attribute__((section(("tracepoint/filler/sys_open_x")), used)) static __attribute__((always_inline)) intbpf_sock_inet_sock_set_state_e(void *ctx)
static __attribute__((always_inline)) int __bpf_sock_inet_sock_set_state_e(struct filler_data *data)
```
bpf_xxx是宏定义中通用的代码，下面的实际上是如何做参数填充，调用如bpf_val_to_ring等辅助函数。为了读取tracepoint返回的参数，需要定义相应的结构体，具体和/sys/kernel/debug/tracing/events/sock/inet_sock_set_state/format中对应。tracepoint返回的参数中可能会有结构体基地址，使用结构体时需要引入相关的内核头文件。
### Result
```protobuf
// types.h + struct
// # cat /sys/kernel/debug/tracing/events/sock/inet_sock_set_state/format
struct sock_args {
    __u64 pad;
    const void *skaddr;
    int oldstate;
    int newstate;
    __u16 sport;
    __u16 dport;
    __u16 family;
    __u8 protocol;
    __u8 saddr[4];
    __u8 daddr[4];
    __u8 saddr_v6[16];
    __u8 daddr_v6[16];
};

// fillers.h +
#include<net/sock.h>
#include<linux/tcp.h>
FILLER(sock_inet_sock_set_state_e, false)
{
    struct sock_args *ctx;
    unsigned long val;
    int res;
    struct sock *sk;
    u16 sport, dport;
            
    ctx = (struct sock_args*) data->ctx;
    sk = (struct sock*) ctx->skaddr;
    // sport
    sport = ctx->sport;
    res = bpf_val_to_ring(data, sport)
    if (res != PPM_SUCCESS)
        return res;
    // dport
    dport = ctx->dport
    res = bpf_val_to_ring(data, dport)
    if (res != PPM_SUCCESS)
        return res;
    return 0;
}
```
## Step 5: Write probe
### File
driver/bpf/probe.c
### Description
```c
#ifdef BPF_SUPPORTS_RAW_TRACEPOINTS
#define BPF_PROBE(prefix, event, type)			\
__bpf_section(TP_NAME #event)				\
int bpf_##event(struct type *ctx)
#else
#define BPF_PROBE(prefix, event, type)			\
__bpf_section(TP_NAME prefix #event)			\
int bpf_##event(struct type *ctx)
#endif
```
__bpf_section用于标示这是一段bpf程序，能够加载，本身还是一个宏定义。举例：BPF_PROBE("sock/", inet_sock_set_state, sock_args)，TP_NAME是"tracepoint/"，prefix是"sock/"，type是sock_args。宏定义展开是__bpf_section("tracepoint/sock/inet_sock_set_state") int bpf_inet_sock_set_state(struct sock_args *ctx)。
sock_args是需要自己定义的（在前一部分），具体使用是在filler中，部分判断逻辑也可以放在probe.c中用于提前返回，如判断protocol是否属于TCP。
在probe中，需要完成bpf setting检查等基本工作，设置call_filler的参数，包括evt_type, flag等，然后调用call_filler。call_filler是一个辅助函数，查找并调用对应evt_type的filler。
### Result
```protobuf
// driver/bpf/probe.c
BPF_PROBE("sock/", inet_sock_set_state, sock_args)
{
    struct sysdig_bpf_settings *settings;
    enum ppm_event_type evt_type;
    settings = get_bpf_settings();
    if (!settings)
        return 0;
    if (!settings->capture_enabled)
        return 0;
  
    evt_type = PPME_SOCK_INET_SOCK_SET_STATE_E;
    
    call_filler(ctx, ctx, evt_type, settings, UF_NEVER_DROP);
}
```

# Add a syscall event (based on tracepoint)
所有系统调用共用两个tracepoint探针：sys_enter和sys_exit，因此每个系统调用包括两个事件：入口事件和出口事件。系统调用的分类处理位于探针函数中，根据获取到的系统调用号调用不同的填充函数，从寄存器中获取对应的数据。不同的系统调用使用相同格式的参数时，可能复用相同的填充函数。
通常情况下，新增系统调用事件流程与新增非系统调用事件流程类似，但不需编写probe。在sysdig的系统调用probe中，可通过系统调用号查表调用对应的filler，所以只需要添加syscall_table中的表项。
## Step 1: Define ppm_event_type
### Result
```c
// ppm_events_public.h
// 定义事件编号
enum ppm_event_type {
	PPME_SYSCALL_PRCTL_E = 320,
	PPME_SYSCALL_PRCTL_X = 321,
	PPM_EVENT_MAX = 322
}
```

## Step 2: Define g_event_info
### Result
```c
// event_table.c
// 对应编号的位置定义事件参数列表
const struct ppm_event_info g_event_info[PPM_EVENT_MAX] = {
				...,
	/* PPME_SYSCALL_PRCTL_E */{"prctl", EC_PROCESS, EF_NONE, 2, {{"option", PT_INT32, PF_DEC}, {"proc_new_name", PT_CHARBUF, PF_NA} } },
	/* PPME_STSCALL_PRCTL_X */{"prctl", EC_PROCESS, EF_NONE, 1, {{"res", PT_ERRNO, PF_DEC} }}
}
```

## Step 3: Add g_syscall_table
### File
`driver/syscall_table.c`
### Description
g_syscall_table是关于系统调用号及对应事件的数组，将系统调用号映射到对应的系统调用入口事件和出口事件。
结构体syscall_evt_pair示意如下：

```c
struct syscall_evt_pair {
	int flags;
	enum ppm_event_type enter_event_type;
	enum ppm_event_type exit_event_type;
} _packed;
```

其中第一个参数为系统调用标志位，可控制是否丢弃事件，是否启用事件等：

```c
enum syscall_flags {
	UF_NONE = 0,
	UF_USED = (1 << 0),
	UF_NEVER_DROP = (1 << 1),
	UF_ALWAYS_DROP = (1 << 2),
	UF_SIMPLEDRIVER_KEEP = (1 << 3),
	UF_ATOMIC = (1 << 4), ///< The handler should not block (interrupt context)
};
```

### Result

```c
// syscall_table.c
// 定义系统调用号对应的事件
const struct syscall_evt_pair g_syscall_table[SYSCALL_TABLE_SIZE] = {
    ...，
	[__NR_prctl - SYSCALL_TABLE_ID0] = 			{UF_USED, PPME_SYSCALL_PRCTL_E, PPME_SYSCALL_PRCTL_X},
}
```

## Step 4: Define fillers
### Result
```c
// ppm_fillers.h + 
// 注意宏定义的\后不要加额外的空格
#define FILLER_LIST_MAPPER(FN)			\
        FN(sys_prctl_e)					\
        FN(sys_prctl_x)					\
        FN(terminate_filler)
          

// filler_table.c + 用于注册filler_table map
const struct ppm_event_entry g_ppm_events[PPM_EVENT_MAX] = {
	... ,
	[PPME_SYSCALL_PRCTL_E] = {FILLER_REF(sys_prctl_e)},
	[PPME_SYSCALL_PRCTL_X] = {FILLER_REF(sys_prctl_x)}
}
```

## Step 5: Write filler
### Result
```c
// types.h +
// fillers.h中需要的结构体，一般系统调用只需读取参数，不需要额外定义结构体

// fillers.h +
FILLER(sys_prctl_e, true)
{
	int option;
	unsigned long arg;
	int res;

	option = bpf_syscall_get_argument(data, 0);
	res = bpf_val_to_ring(data, option);
	if (res != PPM_SUCCESS)
		return res;

	if (option == 15){
		arg = bpf_syscall_get_argument(data, 1);
		res = bpf_val_to_ring(data, arg);
		if (res != PPM_SUCCESS)
			return res;
	}

	return res;
}

FILLER(sys_prctl_x, true)
{
	int res;
	long retval;

	retval = bpf_syscall_get_retval(data->ctx);
	res = bpf_val_to_ring(data, retval);

	return res;
}
```
# Add event based on Kprobe and Kretprobe
通过编写相应的BPF program，在指定的内核函数入口或出口处添加探针。
## Step 1: Define ppm_event_type
### File
`driver/ppm_events_public.h`
### Desciption
ppm_event_type是具体的事件类型，通过enum对应，需要注意的是enum值需后面的g_event_info表中的index值对应，需要保持一致。
定义ppm_event_type沿用sysdig的定义一致性，kprobe对应入口事件，kretprobe对应出口事件，如出口事件`PPME_DO_SWAP_PAGE_X = 321`，添加后需要修改对应的PPM_EVENT_MAX值。
### Result

```c
// ppm_events_public.h
enum ppm_event_type {
    PPME_SOCK_INET_SOCK_SET_STATE_E = 320,
    PPME_DO_SWAP_PAGE_X = 321,
    PPM_EVENT_MAX = 322
}
```

## Step 2: Define g_event_info
### File
`driver/event_table.c`
### Result

```c
// event_table.c + 最后
const struct ppm_event_info g_event_info[PPM_EVENT_MAX] = {
	...,
	/* PPME_DO_SWAP_PAGE_X */{"swap", EC_OTHER, EF_NONE, 1,{{"vm_fault", PT_UINT32, PF_HEX} } }
}
```

## Step 3: Write filler
### File
`driver/bpf/fillers.h`, `driver/bpf/types.h`
### Description
filler由probe调用，负责向事件中填充参数。kprobe与kretprobe对应的filler宏均为`KP_FILLER(填充函数名)`，函数中所需的结构体同样需要引入定义。与tracepoint不同，kprobe与kretprobe中能使用的参数只有寄存器结构体`pt_regs`，入参和返回值需要通过`_READ()`宏从寄存器中读取。
### Result

```c
// fillers.h +
KP_FILLER(do_swap_page_x)
{
	int res;
	struct pt_regs *regs = (struct pt_regs *) data->ctx;
	unsigned int fault;

	fault = _READ(regs->ax);

	res = bpf_val_to_ring(data, fault);

	return res;
}
```

## Step 4: Write probe
### Description

- kprobe通过`BPF_KPROBE(event)`宏进行声明，事件名为需要跟踪的内核函数名
- kretprobe通过`BPF_KRET_PROBE(event)`宏进行声明，事件名同样为需要跟踪的内核函数名

函数中需要显式调用`prepare_filler`函数进行填充前预处理，然后显式调用上一节定义的filler函数`bpf_填充函数名`
### Result

```c
// probe.c + 参数：ctx
BPF_KRET_PROBE(do_swap_page)
{
	struct sysdig_bpf_settings *settings;
	enum ppm_event_type evt_type;
	settings = get_bpf_settings();
	if (!settings)
		return 0;
	if (!settings->capture_enabled)
		return 0;

	evt_type = PPME_DO_SWAP_PAGE_X;

	prepare_filler(ctx, ctx, evt_type, settings, UF_NEVER_DROP);
	bpf_do_swap_page_x(ctx);
	return 0;
}
```

# Tips

- 可使用bpf_printk()将调试日志输出，通过cat /sys/kernel/debug/tracing/trace_pipe查看输出。bpf_printk()是对bpf_trace_printk()的一层封装，启用需要在Makefile中加上-DBPF_DEBUG。
