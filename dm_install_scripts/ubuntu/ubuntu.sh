#!/bin/bash

# Check if local bin folder exists
if [ -d ~/.local/bin ]; then
    echo "Local bin folder already exists."
else
    mkdir ~/.local/bin

    # Check if local bin folder was created
    if [ -d ~/.local/bin ]; then
        echo "Created local bin folder."
    else
        echo "Couldn't create folder at ~/.local/bin"
        exit 1
fi

# Check if docker-machine binary is present
if [ -f ~/.local/bin/docker-machine ]; then
    echo "docker-machine already exists."
else
    wget -q -O ~/.local/bin/docker-machine https://gitlab-docker-machine-downloads.s3.amazonaws.com/main/docker-machine-Linux-x86_64

    # Check if docker-machine binary was downloaded
    if [ -f ~/.local/bin/docker-machine ]; then
        chmod +x ~/.local/bin/docker-machine
        echo "docker-machine installed."
    else
        echo "docker-machine wasn't downloaded and/or installed."
        exit 1
fi

# Check if docker-machine is accessible from the CLI
if [ `which docker-machine` == "" ]; then
    echo "Please restart your machine to register docker-machine installation.  You do not need to run this script again."
else
    echo "docker-machine is accessible from the command line.  You do not need to run this script again."
fi

