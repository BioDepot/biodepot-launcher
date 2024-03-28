#!/bin/bash

if [ -d ~/.local/bin ]; then
    echo "Local bin folder already exists."
else
    mkdir ~/.local/bin
    echo "Created local bin folder."
fi

if [ -f ~/.local/bin/docker-machine ]; then
    echo "docker-machine already exists."
else
    wget -q -O ~/.local/bin/docker-machine https://gitlab-docker-machine-downloads.s3.amazonaws.com/main/docker-machine-Linux-x86_64
    chmod +x ~/.local/bin/docker-machine
    echo "docker-machine installed."
fi

if [ `which docker-machine` = "" ]; then
    echo "Please restart your machine to register docker-machine installation."
else
    echo "docker-machine is accessible from the command line."
fi

