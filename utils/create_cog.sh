#!/bin/bash

# bash utils/create_cog.sh

input_file="data-outputs/processed-overviews/25000.tif"
output_file="data-outputs/processed-cog/HM_COG.tif"

gdal_translate $input_file $output_file \
    -of COG \
    -co COMPRESS=LZW \
    --config TARGET_SRS "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs" \
    --config OVERVIEW_COMPRESS LZW \
    --config TILING_SCHEME NZTM2000
