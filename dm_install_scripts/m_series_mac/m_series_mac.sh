#!/bin/bash
if [ -d "${HOME}/.docker"]; then
    echo ".docker exists"
else
    echo ".docker folder doesnt exist"
    cd "${HOME}"
    mkdir ".docker"
    echo ".docker folder created"
    
    fi
if [ -d "${HOME}/.docker/machine" ]; then
    echo "Machine folder exists"
    
else
    echo "Machine folder doesnt exist"
    cd ${HOME}/.docker
    mkdir "machine"
    echo "Machine folder created"

    fi

# Check if docker-machine is already installed
if command -v docker-machine &> /dev/null
then
    echo "docker-machine is already installed."
else
    echo "docker-machine is not installed."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null
    then
        echo "Homebrew is not installed. Installing Homebrew..."
        
        # Install Homebrew
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        if [ $? -eq 0 ]; then
            echo "Homebrew has been successfully installed."
        else
            echo "Failed to install Homebrew. Please install it manually and try again."
            exit 1
        fi
    fi
    
    echo "Downloading and installing docker-machine..."
    
    # Install docker-machine using Homebrew
    brew install docker-machine
    
    if [ $? -eq 0 ]; then
        echo "docker-machine has been successfully installed."
    else
        echo "Failed to install docker-machine."
        exit 1
    fi
fi
