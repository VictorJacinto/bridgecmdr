FROM node:12-buster
LABEL maintainer="Matthew Holder"

# Create a non-root user:group
ARG USERNAME
RUN /usr/sbin/adduser --disabled-password --gecos '' ${USERNAME} \
    && /usr/sbin/adduser ${USERNAME} sudo \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Install the necessary packages to build any node module bindings
RUN apt update \
    && DEBIAN_FRONTEND=noninteractive \
        apt install --no-install-recommends -y apt-utils \
    && DEBIAN_FRONTEND=noninteractive \
        apt upgrade -y \
    && DEBIAN_FRONTEND=noninteractive \
        apt install --no-install-recommends -y build-essential squashfs-tools \
    && apt autoremove --purge -y \
    && apt autoclean \
    && rm -fr /var/lib/apt/lists/{apt,dpkg,cache,log} /tmp/* /var/tmp/*

# Run this contain as a non-root user
USER ${USERNAME}

# Volumes
VOLUME /scripts
VOLUME /workdir

# Packaging run
ENTRYPOINT ["/bin/bash", "/scripts/build.sh"]
