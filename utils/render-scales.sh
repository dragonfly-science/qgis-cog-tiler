#!/bin/bash

# bash utils/render-scales.sh

scales=(50000)
PROCESSORS=4
QGIS_PROJ="qgis/full-nz.qgz"

for scl in ${scales[@]}
do
    python3 utils/image-export.py $QGIS_PROJ $scl $PROCESSORS
done

# python3 utils/create-vrts.py 32000000,16000000,8000000,4000000,2000000,1000000,500000,250000,100000,50000
# python3 utils/raster-tiler.py 8
# python3 utils/clean-dirs.py