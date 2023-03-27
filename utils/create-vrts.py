import glob
import os
from osgeo import gdal
import sys


# python3 utils/create-cog.py 32000000,16000000,8000000 full-nz-mono

# set scale
scales = sys.argv[1].split(",")
int_scales = [int(x) for x in scales]
sorted_scales = sorted(int_scales, reverse=False)
root_scale = min(int_scales)

project = sys.argv[2].split("/")[-1]
print(project)

# Process scales to tifs
ovr_ext = ".ovr"
ovr_name = f"tiles/cog-outputs/{project}/{int(root_scale)}k.tif"

for scale in sorted_scales:
    vrt_list = []
    if scale != root_scale:
        for f in glob.glob(f'tiles/cog-outputs/{project}/**/{str(scale)}_gtiff_images.tif', recursive=True):
            vrt_list.append(f)
        
        # Build VRT
        gdal.BuildVRT(
            f"tiles/cog-outputs/{str(scale)}k.vrt",
            vrt_list
        )
        
        creation_options = [
            "PROFILE=BASELINE",
            "BIGTIFF=YES"
        ]
    
        
    # Process Root Scale    
    elif scale == root_scale:
        for f in glob.glob(f'tiles/cog-outputs/{project}/**/{str(scale)}_gtiff_images.tif', recursive=True):
            vrt_list.append(f)
        
        # Build VRT
        gdal.BuildVRT(
            f"tiles/cog-outputs/{str(scale)}k.vrt",
            vrt_list
        )
        
