```sh
#!/bin/bash

INSTANCESTATE_ID=i-xxxxxx
REGION=xxxx


function check_if_start_complete() {
    for  i  in  $( seq 1 11)
    do
      if [ "$i" = "11" ]; then
          echo "EC2 is not start complete"
          exit 0
       fi
      
	sleep 8
	ec2_status=$(aws ec2 describe-instance-status --instance-id $INSTANCESTATE_ID  --region $REGION  --output text)
   	# INSTANCESTATUSES        xxxxx      i-xxxxx
	# INSTANCESTATE   16      running
	# INSTANCESTATUS  ok
	# DETAILS reachability    passed
	# SYSTEMSTATUS    ok
	# DETAILS reachability    passed
       if [[ -z $ec2_status ]]; then
          echo "$i  faild get instance state"
          continue
       fi
	instance_state=$(echo $ec2_status | grep "INSTANCESTATE" | awk  '{print $6}')
	instance_status=$(echo $ec2_status | grep "INSTANCESTATUS" | awk  '{print $8}')
	system_status=$(echo $ec2_status |  grep "SYSTEMSTATUS" | awk  '{print $13}')
       echo "$i Instance is $instance_state and $instance_status, System is $system_status"
       if [ "$instance_state $instance_status $system_status" = "running ok ok" ]; then
          break
       fi
    done
}

function show_ec2_instance_status() {
    aws ec2 describe-instances --instance-ids $INSTANCESTATE_ID --query "Reservations[*].Instances[*].State.Name"  --region $REGION  --output text
}

function stop_ec2() {
   aws ec2 stop-instances  --instance-ids $INSTANCESTATE_ID  --region$REGION  2>&1 > /dev/null
}

function start_ec2() {
   aws ec2 start-instances --instance-ids $INSTANCESTATE_ID --region $REGION  2>&1 > /dev/null
}

function retrive_ec2_public_ip() {
   aws ec2 describe-instances --instance-ids $INSTANCESTATE_ID --query "Reservations[*].Instances[*].PublicIpAddress"  --region $REGION  --output text
}

# source ~/cli-ve/bin/activate
# deactivate

aws --version

# show current status
current_instance_status=$(show_ec2_instance_status)

echo "Current INSTANCE status is: $current_instance_status"

if [ "$1" = "stop" ]; then
   if [ "$current_instance_status" = "stopped" ]; then
      echo 'Skip stoping service.'
      exit 0
   fi
   # stop
   echo "STOP $INSTANCESTATE_ID"
   stop_ec2
   echo "After stop state is $(show_ec2_instance_status)"
   exit 0
fi

# start
if [ "$current_instance_status" = "running" ]; then
    echo 'Skip starting service.'
else
    echo "START $INSTANCESTATE_ID"
    start_ec2
    echo "After stating state is $(show_ec2_instance_status)"
fi


check_if_start_complete


IP=$(retrive_ec2_public_ip)
if [[ -z $IP ]]; then
    echo "$i  faild get ip"
    continue
fi

echo "success get ip: $IP"
# stop old channel
for pid in $(ps aux |grep "127.0.0.1:18080:127.0.0.1:8080" | grep -v grep | awk '{print $2}')
do
   echo "kill old process $pid"
   kill $pid
done

# start new channel
echo "connecting...."
ssh -o StrictHostKeyChecking=no -CfNg -L 127.0.0.1:18080:127.0.0.1:8080 user@$IP

echo "Success connect to remote."
exit 0
```