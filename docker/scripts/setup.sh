#!/bin/bash

# Initialization
set -e
export DEBIAN_FRONTEND=noninteractive

# Setup APT
apt-get update
apt-get install --no-install-recommends -y apt-utils
apt-get upgrade -y

# Create a non-root user:group
adduser --disabled-password --gecos '' ${USERNAME}
adduser ${USERNAME} sudo &&\
echo "${USERNAME} ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Installing the necessary packages to install node and build the application
apt-get install --no-install-recommends -y build-essential fakeroot

# Clean-up
apt-get autoremove --purge -y
apt-get autoclean
rm -fr /var/lib/apt/lists/{apt,dpkg,cache,log} /tmp/* /var/tmp/*
