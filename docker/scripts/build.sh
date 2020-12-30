#!/usr/bin/env bash
cd /workdir

if [ $1 = "shell" ]; then
    /bin/bash
elif [ $1 = "build" ]; then
    npm ci
    npm run package
elif [ $1 = "build:armhf" ]; then
    npm ci
    npm run package:armhf
fi
