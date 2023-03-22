#!/bin/bash

# bash utils/render-scales.sh

scales=(50000)
PROCESSORS=4
QGIS_PROJ="qgis/full-nz.qgz"

for scl in ${scales[@]}
do
    python3 utils/image-export.py $QGIS_PROJ $scl $PROCESSORS
done