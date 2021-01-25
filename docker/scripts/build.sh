#!/usr/bin/env bash
cd /workdir

if [ $1 = "shell" ]; then
    /bin/bash
elif [ $1 = "build" ]; then
    # npm ci
    npm run package
fi
