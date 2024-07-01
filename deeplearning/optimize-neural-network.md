---
outline: deep
---

# 优化神经网络<Badge type="warning" text="Draft" />

## 存在的问题与解决方案

```mermaid
flowchart LR
  subgraph Problem
    direction TB
    gd_diappearance_explosion(梯度消失与爆炸)
    overfitting(过拟合)
    underfitting(欠拟合)
    slow_learning(学习慢)
    network_degradation(网络退化)
  end
  
  subgraph Solution
    direction TB
    relu(使用Relu激活函数)
    regularization(正则化 Regularization)
    normalization(归一化 Normalization)
    more_data(加大数据集)
    momentum(动量梯度下降 Momentum)
    dropout(Dropout)
    resnet(ResNet 残差网络)
    subgraph initrialization
      he_init(He初始化)
      xavier(Xavier初始化)
    end
    subgraph dynamic_learning_rate
      adam(Adam)
      RMS(RMSprop)
      decay(学习率衰减)
    end
    minibatch(mini批量梯度下降)
  end
  gd_diappearance_explosion --> relu
  gd_diappearance_explosion --> normalization
  overfitting --> regularization
  overfitting --> dropout
  slow_learning --> momentum
  slow_learning --> initrialization
  slow_learning --> minibatch
   slow_learning --> dynamic_learning_rate
  underfitting-->more_data
  network_degradation --> resnet

```


### 梯度消失与梯度爆炸
由于计算梯度使用链式法则是连乘的形式，当如果梯度累积太深，当网络深度较深的时候，梯度将以指数的形式传播，最终会导致梯度非常小，网络难以学习或者非常大导致溢出学习失败。
### 过拟合
泛化能力差，在训练集上表现良好，但是泛化能力差，在测试集上表现不好。
### 欠拟合
在训练集和测试集上表现都不好

TODO
.... ... 