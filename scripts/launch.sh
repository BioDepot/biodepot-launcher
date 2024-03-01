#!/bin/bash

#region="us-east-2"
#instance_type="m5d.4xlarge"

# User defined parameters
region="$1"
instance_type="$2"
workflow_name="$3"
workflow_dir="$4"

security_group="docker-machine"

# AMI will likely change
ami_id="ami-0fc71dd2415bf7020"
instance_name="dm-bwb"

# Create instance
docker-machine create --driver amazonec2 \
  --amazonec2-region $region \
  --amazonec2-instance-type $instance_type \
  --amazonec2-security-group $security_group \
  --amazonec2-ami $ami_id $instance_name >> dm-output.log

# Set docker-machine env to remote instance
#eval "$(docker-machine env $instance_name)"

# Wait for remote instance to launch
until docker-machine ls | grep dm-bwb | grep Running >> /dev/null;
do
  sleep 5
done

# Start bwb on remote instance
docker-machine ssh $instance_name /home/ubuntu/mount_disks.sh >> dm-output.log

# Update $workflow_dir to use the workflow directory selected by user
docker-machine scp -r $workflow_dir $instance_name:/mnt/data/ >> dm-output.log

# bwbLauncher will need to pass $instance_name
docker-machine ssh $instance_name "export workflow=$workflow_name; /home/ubuntu/start_bwb.sh" >> dm-output.log

#docker run --rm -d  -p 80:6080 -p 5900:5900 -v  /home/ubuntu:/data -v  /var/run/docker.sock:/var/run/docker.sock  -v /tmp/.X11-unix:/tmp/.X11-unix --privileged --group-add root biodepot/bwb:latest

# Set docker-machine env back to local
#eval "$(docker-machine env -u)"

# Find public dns of remote instance
ip=$(docker-machine ip $instance_name)
#ip=${ip//./-}
#dns="ec2-$ip.$region.compute.amazonaws.com"

nc -z $ip 80 >> dm-output.log
sleep 20

echo "$ip"

# Open browser to remote instance, DO NOT ASSUME GOOGLE CHROME IS INSTALLED (figure out how to open default browser)!
#google-chrome $dns

# To terminate instance without prompt
#docker-machine rm $instance_name -f

# To start stop use dockef-machine start/stop
# To copy files to remote instance uss docker-machine scp
#docker-machine scp -r /home/ubuntu/Downloads $instance_name:/home/ubuntu

# To ssh into remote instance use docker-machine ssh $instance_name
# To run docker commands on remote instance use docker-machine ssh $instance_name docker ps
