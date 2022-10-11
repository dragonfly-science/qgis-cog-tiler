#!/bin/bash

# bash utils/create_cog.sh

input_dir="dragonfly/qgis-cog-tiler/data-outputs/full-nz"
output_dir="dragonfly/qgis-cog-tiler/web-docs/cog-raster-tile/cog"

list=$( find ${input_dir} -type d -name "processed" )

array=()
for i in ${list[@]}
do
    input_file=$( find $i -name "*.tif" )
    array+=("${input_file}")
done

echo ${array[@]}

gdalbuildvrt dragonfly/qgis-cog-tiler/data-outputs/full.vrt ${array[@]} 

gdal_translate dragonfly/qgis-cog-tiler/data-outputs/fullnew.vrt dragonfly/qgis-cog-tiler/data-outputs/fullvrtcog.tif \
    -of COG \
    -co BLOCKSIZE=128 \
    -co COMPRESS=JPEG \
    --config TARGET_SRS "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs" \
    --config TILING_SCHEME NZTM2000 \
    --config RESAMPLING BILINEAR 




    # --config TARGET_SRS "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs" \
    # --config TILING_SCHEME NZTM2000 \
    # --config RESAMPLING BILINEAR 

# for dir in $( find ${input_dir} -type d -name "processed" )
# do
#     tile_num=$( echo $dir | cut -d "/" -f 5 )
#     input_file=$( find $dir -name "*.tif" )
#     output_file="${output_dir}/${tile_num}.tif"
#     echo $output_file

#     gdal_translate $input_file $output_file \
#         -of COG \
#         -co BLOCKSIZE=128 \
#         -co COMPRESS=JPEG \
#         --config TARGET_SRS "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs" \
#         --config TILING_SCHEME NZTM2000 \
#         --config RESAMPLING BILINEAR 

# done

