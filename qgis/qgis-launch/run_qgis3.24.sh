#!/bin/bash

xhost +

docker run --rm -it \
    -v ${HOME}:/home/${USER} \
    -v /usr/share/fonts/:/usr/share/fonts/ \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -e DISPLAY=unix$DISPLAY \
    --network=host \
    -d \
    --privileged \
    qgis/qgis:latest \
    qgis
