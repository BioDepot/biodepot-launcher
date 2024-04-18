#!/bin/bash
dir=$1

cmd="tar -C $dir -cf - --posix --pax-option=exthdr.name=%d/PaxHeaders/%f --pax-option=delete=atime,delete=ctime --mode='600' --sort=name --mtime='2015-10-21 00:00Z' --group=0 --owner=0 --numeric-owner . | sha256sum"

#echo $cmd
eval $cmd | awk '{print $1}'
