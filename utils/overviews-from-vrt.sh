#!/bin/bash

# bash bash.sh

# scales=(32000000 16000000 8000000 4000000 2000000 1000000 500000 250000 100000 50000)
scales=(50000 100000 250000 500000 1000000 2000000 4000000 8000000 16000000 32000000)
# scales=(250000 500000 1000000 2000000 4000000 8000000 16000000 32000000)



max_scale=$( printf '%s\n' "${scales[@]}" | awk '$1 < m || NR == 1 { m = $1 } END { print m }' )

echo $max_scale

ovr_ext=".ovr"
ovr_name="${max_scale}.tif"

mkdir -p "holding"
mkdir -p "lists"


for scale in ${scales[@]}
do    
    if [[ $scale -ne $max_scale ]]
    then
        echo "Im not min: ${scale}"
        ovr_name="${ovr_name}${ovr_ext}"
        find . -name "${scale}_gtiff_images.tif" > lists/${scale}.txt
        gdalbuildvrt ${scale}.vrt -input_file_list lists/${scale}.txt
        gdal_translate -of "GTiff" -co PROFILE=BASELINE ${scale}.vrt  holding/${ovr_name} -co BIGTIFF=YES
        echo $ovr_name
    else
        echo "Im min: ${scale}"
        find . -name "${scale}_gtiff_images.tif" > lists/${scale}.txt
        gdalbuildvrt ${scale}.vrt -input_file_list lists/${scale}.txt
        gdal_translate -of "GTiff" -co COMPRESS=JPEG -co TILED=YES ${scale}.vrt  holding/${max_scale}.tif -co BIGTIFF=YES
    fi

done

# gdal_translate ./qgis-cog-tiler/data-outputs/full-nz/holding/50000.tif ./qgis-cog-tiler/web-docs/cog-raster-tile/cog/50000-cog.tif -of COG -co COMPRESS=JPEG -co NUM_THREADS=ALL_CPUS -co QUALITY=100
