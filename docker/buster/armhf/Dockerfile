FROM arm32v7/node:12-buster
LABEL maintainer="Matthew Holder"

ARG USERNAME

# Run the setup script.
COPY scripts/setup.sh .
RUN bash setup.sh

# Run this contain as a non-root user
USER ${USERNAME}

# Volumes
VOLUME /scripts
VOLUME /workdir

# Packaging run
ENTRYPOINT ["/bin/bash", "/scripts/build.sh"]
