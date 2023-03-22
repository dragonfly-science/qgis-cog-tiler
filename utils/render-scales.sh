#!/bin/bash

# bash utils/render-scales.sh

scales=(32000000 16000000 8000000 4000000 2000000 1000000 500000 250000)
PROCESSORS=4
QGIS_PROJ="qgis/full-nz.qgz"

for scl in ${scales[@]}
do
    python3 utils/image-export.py $QGIS_PROJ $scl $PROCESSORS
done