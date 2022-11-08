#!/bin/bash

# bash utils/overviews-from-vrt.sh full-nz "32000000 16000000 8000000"
# OR
# make QGISPROJECTNAME=full-nz SCALES="32000000 16000000 8000000" create-cog

project=$1

scales=($2)

# scales=(32000000 16000000 8000000)

max_scale=$( printf '%s\n' "${scales[@]}" | awk '$1 < m || NR == 1 { m = $1 } END { print m }' )

echo $max_scale

ovr_ext=".ovr"
ovr_name="${max_scale}_${project}.tif"

holding="cog-outputs/${project}/holding"
lists="cog-outputs/${project}/lists"
cog="cog-outputs/${project}/cog"

mkdir -p ${holding}
mkdir -p ${lists}
mkdir -p ${cog}

for scale in ${scales[@]}
do    
    if [[ $scale -ne $max_scale ]]
    then
        echo "Im not min: ${scale}"
        ovr_name="${ovr_name}${ovr_ext}"
        find cog-outputs/${project} -name "${scale}_gtiff_images.tif" > ${lists}/${scale}.txt
        gdalbuildvrt cog-outputs/${project}/${scale}.vrt -input_file_list ${lists}/${scale}.txt
        gdal_translate -of "GTiff" -r bilinear -co PROFILE=BASELINE cog-outputs/${project}/${scale}.vrt  ${holding}/${ovr_name} -co BIGTIFF=YES
        echo $ovr_name
    else
        echo "Im min: ${scale}"
        find cog-outputs/${project} -name "${scale}_gtiff_images.tif" > ${lists}/${scale}.txt
        gdalbuildvrt cog-outputs/${project}/${scale}.vrt -input_file_list ${lists}/${scale}.txt
        gdal_translate -of "GTiff" -r bilinear -co COMPRESS=JPEG -co TILED=YES cog-outputs/${project}/${scale}.vrt  ${holding}/${max_scale}_${project}.tif -co BIGTIFF=YES
    fi

done

echo "Creating COGs"
gdal_translate \
    ${holding}/${max_scale}_${project}.tif \
    ${cog}/${max_scale}_${project}.tif \
    -of COG \
    -co COMPRESS=JPEG \
    -co NUM_THREADS=ALL_CPUS \
    -co QUALITY=100 \
    --config RESAMPLING BILINEAR 
