---
outline: deep
---

# 通过 aws cli 启动和停止 EC2

在 EC2 上预先安装了一些服务，但是这些服务只是偶尔使用以下，所以写了各脚本，在需要的时候启动一下 EC2,
由于没有固定的公网 IP,每次重新启动 EC2，都会随机分配一个公网 IP,所以 ssh 隧道将远端的服务映射到本地的端口，
这样在本机访问的时就可以稳定使用`localhost:port`来访问了

## 提前准备

- 购买 EC2 并允许公网访问
  > 安全组仅开通 ssh 端口
- 在 EC2 上安装需要的服务，通过**1234**暴露出来
- 创建 IAM 用户，并附加 EC2 的`StartInstances`和`StopInstances`策略
  > 正常情况下应该创建角色，然后将角色赋予用户，这里偷懒了

## 本机安装 aws cli

**注意一定一定要安装最新版本，目前是`2.x`**
官方文档连接：https://docs.aws.amazon.com/zh_cn/cli/latest/userguide/getting-started-install.html

```shell
$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
$ unzip awscliv2.zip
$ sudo ./aws/install

$ aws --version
aws-cli/2.15.30 Python/3.11.6 Linux/5.10.205-195.807.amzn2.x86_64 botocore/2.4.5
```

## 配置 aws cli

- 可以使用 config 命令，一步一步配置
  ```sh
  $ aws config
  ```
- 也可直接将`accessKey`和`Securit`配置到 _$HOME/.awx/credentials_ 文件里
  ```sh
  [default]  # <--- profile, default是默认的，可以写其他的
  aws_access_key_id = xxxx
  aws_secret_access_key = yyyyyyyyyyyyyyyyyyy
  ```

## 编辑脚本

- 准备(定义全局变量)

```sh
INSTANCESTATE_ID=i-xxxxxxxxxxxx
```

- 查看 EC2 实例现在的状态(running / stopping ...)

```sh
function show_ec2_system_status() {
    aws ec2 describe-instance-status --instance-id $INSTANCESTATE_ID  --region us-east-2  --output text | grep SYSTEMSTATUS | awk '{print $2}'
}

function show_ec2_instance_status() {
    aws ec2 describe-instance-status --instance-id $INSTANCESTATE_ID  --region us-east-2  --output text | grep INSTANCESTATE | awk '{print $3}'
}
```

- 启动 EC2 实例

```sh
function start_ec2() {
   aws ec2 start-instances --instance-ids i-0abe9dec58900490a --region us-east-2  2>&1 > /dev/null
}
```

- 停止 EC2 实例

```sh
function stop_ec2() {
   aws ec2 stop-instances  --instance-ids $INSTANCESTATE_ID  --region us-east-2  2>&1 > /dev/null
}
```

- 获取实力对应的公网 IP 地址(xxx.xxx.xxx.xxx)

```sh
function retrive_ec2_public_ip() {
   aws ec2 describe-instances --instance-ids $INSTANCESTATE_ID --query "Reservations[*].Instances[*].PublicIpAddress"  --region us-east-2  --output text
}
```

- 获取当前状态并打印

```sh
# show current status
current_instance_status=$(show_ec2_instance_status)

echo "Current INSTANCE status is: $current_instance_status"
```

- 判断启动参数如果是`stop`,则停止服务并退出

```sh
if [ "$1" = "stop" ]; then
   #  ↑
   #  ╰─────────────────────────  第一个参数 如`./script.sh stop` 那么`$1`就是`stop`
   echo "STOP $INSTANCESTATE_ID"
   stop_ec2    # ←────────────────   调用前面定义的函数，停止服务
   show_ec2_status    # ←──────────   调用前面定义的函数，再次打印实例的状态
   exit 0
fi
```

- 启动服务

```sh
if [ "$current_status" = "running" ]; then   # ←─── 判断实例是不是已经启动了，如果已经启动了就不不动
    echo 'Skip starting service.'
else
    echo "START $INSTANCESTATE_ID"
    start_ec2    # ←───────────────   调用前面定义的函数，启动服务
    show_ec2_instance_status    # ←────   调用前面定义的函数，再次打印实例的状态
fi
```

- 获取 IP 并打通隧道

```sh
for  i  in  $( seq 1 10)   # ←──────────   因为服务不一定会立刻起来，所以循环10去不断检查是否启动成功了
do
    sleep 8

    system_status=$(show_ec2_system_status)
    echo "$i  Current SYSTEM status is : $system_status"
    if [ "$system_status" != "ok" ]; then   # ←────   系统状态检查
      echo '$i System are not prepared continue sleep.'
      continue
    fi

    IP=$(retrive_ec2_public_ip)    # ←──────────   调用前面定义的函数，获取IP赋给IP
    if [[ -z $IP ]]; then
        echo "$i time(s) faild get ip"
       	continue
    fi
    echo "$i time(s) to success get ip: $IP"   # ←──────────   IP获取成功,打印IP
    # kill old channel if it exist
    for pid in $(ps aux |grep "127.0.0.1:4096:127.0.0.1:8080" | grep -v grep | awk '{print $2}')  # ← 取出旧的PID,循环kill掉
    do
        echo "kill old process $pid"
        kill $pid
    done

    # start
    ssh -o StrictHostKeyChecking=no -CfNg -L 127.0.0.1:5678:127.0.0.1:1234 username@$IP
    #             ↑                   ↑    ↑        ↑             ↑           ╰── 跳板机
    #             │                   │    │        │             ╰── 目标服务IP和端口，因为服务就在跳板机上了，所以IP是127.0.0.1
    #             │                   │    │        ╰── 本地的IP和端口，IP可以省略
    #             │                   │    ╰── 本地端口转发
    #             │                   ╰── C：压缩所有数据   f： 后台执行  N: 不执行远程指令，处于等待状态 g: 允许远程逐渐转发端口
    #             ╰── 忽略know host
    # see： https://github.com/qinshulei/ubuntu-cheat/blob/master/ssh
    echo "Success connect to remote."
    exit 0
done

```

- 放到一起
  - [script.sh](./start_stop_ec2_via_aws_cli.sh.md)

## 使用脚本

- 启动服务 `./script.sh`
- 停止服务 `./script.sh stop`

## 参考

- EC2 AWS CLI Command Reference： https://docs.aws.amazon.com/zh_cn/cli/latest/reference/ec2/
- ssh Command Manual： https://man7.org/linux/man-pages/man1/ssh.1.html

<style>
:root {
  --vp-code-line-height: 1.2;
  --vp-font-family-mono: "Source Code Pro", Consolas, "Ubuntu Mono", Menlo, "DejaVu Sans Mono", monospace, monospace;
}
</style>
