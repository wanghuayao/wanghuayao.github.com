---
outline: deep
---

# 股票市场行实时情推送系统

## 概览Overview
```mermaid
flowchart RL
    subscribe(SubscribeCache)
    mq(MQ)
    DataReciver(DataReciver)
    bourse(交易所)
    subgraph Clients
        direction TB
        app1(Client 1)
        app2(Client 2)
        app3(Client 3)
        app4(Client 4)
        app5(Client 5)
    end
    subgraph MessagerService
        direction TB
        ms1(Instace 1)
        ms2(Instace 2)
        ms3(Instace 3)
    end
    subgraph DistributionService
        direction TB
        ds1(Instace 1)
        ds2(Instace 2)
    end
    subgraph DataProcessService
        direction TB
        dps1(股票1数据加工)
        dps2(股票2数据加工)
    end

    subscribe -.->|订阅信息| DistributionService
    Clients -.->|订阅| subscribe
    MessagerService -.->|Client与Messager<br>对应关系| subscribe

    ms1 ==> app1
    ms1 ==> app2
    ms2 ==> app3
    ms2 ==> app4
    ms3 ==> app5
    ds1 --> ms1
    ds2 --> ms2
    ds2 --> ms3

    dps1 --> ds1
    dps1 --> ds2
    dps2 --> ds1
    dps2 --> ds2
    mq --> dps1
    mq --> dps2

    DataReciver --> mq
    bourse --> DataReciver
```

* 为了保证数据安全
  * 应该有两个集群来部署上面的服务，保证数据安全。
    > 这样做同时可以分散MessagerServer的压力
## 各个模块说明
* Client: 客户端(通常是PC客户端)
  * 启动与一个Message Service Instance建立长链接
  * 用户选择关注的股票后，发送订阅信息到 SubscribeCache
* DataReciver: 数据接收器
  * 接受到交易所的股票数据
  * 按接受到数据的先后顺序给**数据编号**
  * 按照**股票维度**推送到 MessageQueue
* DataProcessService: 数据加工服务
  * 解析交易所的原始数据
  * 随机发送给一台Distribution Service Instance
  * 行情数据异步落盘
* DistributionService: 分发服务
  * 从SubscribeCache中读取
    * 都有哪些Client订阅了当前股票信息
    * 这些Client都与哪些MessagerService Instance建立的长链接
  * 将数据转发给需要的MessagerService Instance（带上用户ID）
* MessagerService: 消息服务
  * 等待客户端的长链接
  * 收到DistributionService发来的消息后
    根据用户ID找到对应的长链接，推送给客户端
  * 在发送给具体的客户端前会做如下处理
    * **按顺序重新组织数据**:判断与上次发送的数据编号是否连续，如果不连续，暂时缓存起来，等到正确的数据到达后再发送
    * 每次只推送变化的部分

