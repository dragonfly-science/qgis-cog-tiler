#!/bin/bash

# bash qgis/qgis-tiler/run_qgis3.24_tiler.sh

xhost +

docker run --rm -it \
    -v ${HOME}:/home/${USER} \
    -v /usr/share/fonts/:/usr/share/fonts/ \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -e DISPLAY=unix$DISPLAY \
    --network=host \
    --privileged \
    -e HOME=/work \
    -v ${PWD}:/work \
    -w /work \
    qgis/qgis:latest \
    bash
