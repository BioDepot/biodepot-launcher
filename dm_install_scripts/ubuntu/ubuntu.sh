#!/bin/bash

# Set the installation directory
INSTALL_DIR="$HOME/.local/bin"

# Check if the installation directory exists
if [ -d "$INSTALL_DIR" ]; then
  echo "Installation directory already exists."
else
  mkdir -p "$INSTALL_DIR"
  # Check if the installation directory was created
  if [ -d "$INSTALL_DIR" ]; then
    echo "Created installation directory."
  else
    echo "Couldn't create directory at $INSTALL_DIR"
    exit 1
  fi
fi

# Check if docker-machine binary is present
if [ -f "$INSTALL_DIR/docker-machine" ]; then
  echo "docker-machine already exists."
else
  curl -sL https://gitlab-docker-machine-downloads.s3.amazonaws.com/main/docker-machine-Linux-x86_64 -o "$INSTALL_DIR/docker-machine"
  # Check if docker-machine binary was downloaded
  if [ -f "$INSTALL_DIR/docker-machine" ]; then
    chmod +x "$INSTALL_DIR/docker-machine"
    echo "docker-machine installed."
  else
    echo "docker-machine wasn't downloaded and/or installed."
    exit 1
  fi
fi

# Check if docker-machine is accessible from the CLI
if [ "$(which docker-machine)" == "" ]; then
  echo "Please add $INSTALL_DIR to your PATH or restart your shell to register docker-machine installation. You do not need to run this script again."
else
  echo "docker-machine is accessible from the command line. You do not need to run this script again."
fi

# Check if ~/docker directory exists
if [ -d "$HOME/docker" ]; then
  echo "~/docker directory already exists."
else
  mkdir -p "$HOME/docker"
  # Check if ~/docker directory was created
  if [ -d "$HOME/docker" ]; then
    echo "Created ~/docker directory."
  else
    echo "Couldn't create directory at $HOME/docker"
    exit 1
  fi
fi

# Check if ~/docker/.machine directory exists
if [ -d "$HOME/docker/.machine" ]; then
  echo "~/docker/.machine directory already exists."
else
  mkdir -p "$HOME/docker/.machine"
  # Check if ~/docker/.machine directory was created
  if [ -d "$HOME/docker/.machine" ]; then
    echo "Created ~/docker/.machine directory."
  else
    echo "Couldn't create directory at $HOME/docker/.machine"
    exit 1
  fi
fi
