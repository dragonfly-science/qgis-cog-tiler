#!/bin/bash

# bash utils/render-scales.sh

scales=(100000 50000)
PROCESSORS=4
QGIS_PROJ="qgis/full-nz-mono"

for scl in ${scales[@]}
do
    python3 utils/image-export.py $QGIS_PROJ.qgz $scl $PROCESSORS
done

# scales_new=$( echo ${scales[@]} | sed 's/ /,/g' )
# echo ${scales_new}

# python3 utils/create-vrts.py ${scales_new} ${QGIS_PROJ}
# # python3 utils/raster-tiler.py 8 ${QGIS_PROJ}
# # python3 utils/clean-dirs.py