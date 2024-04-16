#!/bin/bash

#region="us-east-2"
#instance_type="m5d.4xlarge"

# User defined parameters
region="$1"
instance_type="$2"
workflow_name="$3"
workflow_dir="$4"
os="$5"
home_dir="$6"

security_group="docker-machine"

# AMI will likely change
ami_id="ami-0fc71dd2415bf7020"

parsed_workflow_name=$(echo $workflow_name | tr _ -)

# Uses the last 4 digits of the Linux Epoch in seconds to create a unique id
instance_name="$(date +%s | tr -d '\n' | tail -c 4)-$parsed_workflow_name"
# instance_name="dm-bwb"

# Create instance
/workspace/docker-machine create --driver amazonec2 \
  --amazonec2-region $region \
  --amazonec2-instance-type $instance_type \
  --amazonec2-security-group $security_group \
  --amazonec2-ami $ami_id $instance_name >> /workspace/dm-output.log

# Set docker-machine env to remote instance
#eval "$(docker-machine env $instance_name)"

# Wait for remote instance to launch
until /workspace/docker-machine ls | grep $instance_name | grep Running >> /dev/null;
do
  sleep 5
done

# Start bwb on remote instance
/workspace/docker-machine ssh $instance_name /home/ubuntu/mount_disks.sh >> /workspace/dm-output.log

# Update $workflow_dir to use the workflow directory selected by user
/workspace/docker-machine scp -r /workspace/mnt/$workflow_dir $instance_name:/mnt/data/ >> /workspace/dm-output.log

# bwbLauncher will need to pass $instance_name
/workspace/docker-machine ssh $instance_name "export workflow=$workflow_name; /home/ubuntu/start_bwb.sh" >> /workspace/dm-output.log

#docker run --rm -d  -p 80:6080 -p 5900:5900 -v  /home/ubuntu:/data -v  /var/run/docker.sock:/var/run/docker.sock  -v /tmp/.X11-unix:/tmp/.X11-unix --privileged --group-add root biodepot/bwb:latest

# Set docker-machine env back to local
#eval "$(docker-machine env -u)"

# Find public dns of remote instance
ip=$(/workspace/docker-machine ip $instance_name)
#ip=${ip//./-}
#dns="ec2-$ip.$region.compute.amazonaws.com"

config_location="/root/.docker/machine/machines/$instance_name/config.json"

if [ $os == "Windows" ]; then
    win_home_dir=$(echo $home_dir | sed 's#\\#\/#g')
    sed -i 's#\"\/root\/#\"'"$win_home_dir"'\/#g' $config_location
    chmod -R 777 /root/.docker/machine/*
else
    sed -i 's#\"\/root\/#\"'"$home_dir"'\/#g' $config_location
    chmod -R 777 /root/.docker/machine/*
fi

nc -z $ip 80 >> /workspace/dm-output.log
sleep 30

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
