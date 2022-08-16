#!/bin/bash

# bash qgis/qgis-launch/run_qgis3.24.sh qgis/qgis-projects/vrt-tests.qgz

project=$1

xhost +

docker run --rm -it \
    -v /usr/share/fonts/:/usr/share/fonts/ \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -e DISPLAY=unix$DISPLAY \
	-e HOME=/work \
	-v ${PWD}:/work \
	-w /work \
    --network=host \
    -d \
    --privileged \
    qgis/qgis:latest \
    qgis --project $project
