#!/bin/bash

# bash utils/render-scales.sh "qgis/full-nz-mono"

scales=(4000000)
PROCESSORS=4
QGIS_PROJ=$1

for scl in ${scales[@]}
do
    python3 utils/image-export.py "${QGIS_PROJ}.qgz" $scl $PROCESSORS
done

scales_new=$( echo ${scales[@]} | sed 's/ /,/g' )
echo ${scales_new}

python3 utils/create-vrts.py ${scales_new} ${QGIS_PROJ}
python3 utils/raster-tiler.py 14 ${QGIS_PROJ}
python3 utils/clean-dirs.py ${QGIS_PROJ}