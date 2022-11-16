import glob
import os
from osgeo import gdal
import sys


# python3 utils/create-cog.py 32000000,16000000,8000000

# set scale
scales = sys.argv[1].split(",")
int_scales = [int(x) for x in scales]
sorted_scales = sorted(int_scales, reverse=False)
root_scale = min(int_scales)

# Process scales to tifs
ovr_ext = ".ovr"
ovr_name = f"cog-outputs/{int(root_scale)}k.tif"

for scale in sorted_scales:
    vrt_list = []
    if scale != root_scale:
        for f in glob.glob(f'cog-outputs/**/{str(scale)}_gtiff_images.tif', recursive=True):
            vrt_list.append(f)
        
        # Build VRT
        gdal.BuildVRT(
            f"cog-outputs/{str(scale)}k.vrt",
            vrt_list
        )
        
        creation_options = [
            "PROFILE=BASELINE",
            "BIGTIFF=YES"
        ]
    
        # Export VRT as Image
        print(f"Process overview: {scale}")
        ovr_name = f"{ovr_name}{ovr_ext}"
        gdal.Translate(
            ovr_name,        
            f"cog-outputs/{str(scale)}k.vrt",
            format = "GTiff",
            resampleAlg = "bilinear",
            creationOptions = creation_options,
            callback = gdal.TermProgress_nocb 
        )
        
    # Process Root Scale    
    elif scale == root_scale:
        for f in glob.glob(f'cog-outputs/**/{str(scale)}_gtiff_images.tif', recursive=True):
            vrt_list.append(f)
        
        # Build VRT
        gdal.BuildVRT(
            f"cog-outputs/{str(scale)}k.vrt",
            vrt_list
        )
        
        creation_options = [
            "TILED=YES",
            "COMPRESS=JPEG",
            "BIGTIFF=YES"
        ]

        # Export VRT as Image
        gdal.Translate(
            f"cog-outputs/{str(scale)}k.tif",        
            f"cog-outputs/{str(scale)}k.vrt",
            format = "GTiff",
            resampleAlg = "bilinear",
            creationOptions = creation_options,
            callback = gdal.TermProgress_nocb 
        ) 
        
    else:
        print("Scale is not an int")
    
# create cog 
creation_options = [
    "COMPRESS=JPEG",
    "BIGTIFF=YES",
    "NUM_THREADS=ALL_CPUS"
]

# Save stack as COG
print("Creating COG")
gdal.SetConfigOption('RESAMPLING', 'BILINEAR')
gdal.Translate(
    f"cog-outputs/{str(root_scale)}k_cog.tif",        
    f"cog-outputs/{str(root_scale)}k.tif",
    format = "COG",
    creationOptions = creation_options,
    callback = gdal.TermProgress_nocb 
)