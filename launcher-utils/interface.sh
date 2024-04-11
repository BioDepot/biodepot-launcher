#!/bin/bash

script=$1
param1=$2
param2=$3
param3=$4
param4=$5
param5=$6
param6=$7
param7=$8
param8=$9

if [ $script == "hash" ]; then
    /workspace/hash.sh $param1
elif [ $script == "launch" ]; then
    /workspace/launch.sh $param1 $param2 $param3 $param4 $param5 $param6
fi
