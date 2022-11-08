from qgis.core import *
from qgis.gui import *
from qgis.PyQt.QtCore import *
from qgis.PyQt.QtGui import *

import os
import math
from osgeo import gdal
import geopandas as gp
import sys
import os

# make tiler
# python3 utils/image-export.py "qgis/full-nz.qgz" 32000000,16000000,8000000
# OR
# make QGISPROJECT=qgis/full-nz.qgz.qgz SCALES=32000000,16000000,8000000 image-exports

project_path = sys.argv[1]
scales = sys.argv[2].split(",")

print((scales))

grid = "data/vector/100k_grid.gpkg"

dir_name = os.path.basename(project_path).split(".")[0]
out_base = os.path.join("cog-outputs", dir_name)
os.makedirs(out_base, exist_ok=True)


# Resolutions and scales set per LINZ map tiles standards:
# https://www.linz.govt.nz/data/linz-data-service/guides-and-documentation/nztm2000-map-tile-service-schema
meter_to_inch = 39.3701
dpi = 90.71428571428571


# Supply path to qgis install location
# Create a reference to the QgsApplication.  Setting the
# second argument to False disables the GUI.
qgs = QgsApplication([], False)
QgsApplication.setPrefixPath("/usr", True)
qgs.initQgis()

project = QgsProject.instance()

project.read(project_path)

layers = QgsProject.instance().mapLayers().values()

# Project Extent
proj_extent = project.mapLayersByName("nz-extent")[0].extent()

# Scales
# scales = [32000000, 16000000, 8000000, 4000000, 2000000, 1000000, 500000, 250000, 100000, 50000]
root_scale = min(scales)
sorted_list = sorted(scales, reverse=False)
list_length = len(sorted_list)
gpGrid = gp.read_file(grid)

for index, gtile in gpGrid.iterrows():
    
    # Set Paths
    raw_path = os.path.join(out_base, str(index), "raw")
    os.makedirs(raw_path, exist_ok=True)
    
    # Get bounds for processing
    xmin = gtile.geometry.bounds[0]
    ymin = gtile.geometry.bounds[1]
    xmax = gtile.geometry.bounds[2]
    ymax = gtile.geometry.bounds[3]
    
    # Setting overview and base file name
    ovr_ext = ".ovr"
    ovr_name = str(root_scale) + ".tif"
    
    # Loop sorted scales list
    for ovr in sorted_list:
        print(f"Scale: {str(ovr)}")
        if ovr != root_scale:
            ovr_name = ovr_name + ovr_ext

        width = math.ceil(
            abs(
                (((xmin - xmax) * meter_to_inch) / float(ovr))
                * dpi
            )
        )
        height = math.ceil(
            abs(
                (((ymin - ymax) * meter_to_inch) / float(ovr))
                * dpi
            )
        )
        
        file_name = str(ovr) + "_images.png"
        image_path = os.path.join(out_base, file_name)
        
        # Start Map Settings
        settings = QgsMapSettings()
        settings.setOutputSize(QSize(width, height))

        settings.setDestinationCrs(QgsCoordinateReferenceSystem.fromEpsgId(2193))
        
        p = QPainter()
        img = QImage(QSize(width, height), QImage.Format_ARGB32_Premultiplied)
        p.begin(img)        
        p.setRenderHint(QPainter.Antialiasing)

        # Set layers to render. Only renders "checked" layers
        layers = list([lyr for lyr in project.layerTreeRoot().checkedLayers()])
        settings.setLayers(layers)

        # Set Extent
        settings.setExtent(QgsRectangle(xmin, ymin, xmax, ymax))
        
        # setup qgis map renderer
        print("Rendering...")
        render = QgsMapRendererCustomPainterJob(settings, p)
        render.start()
        render.waitForFinished()
        p.end()

        # save the image
        print("Saving Image...")
        img.save(image_path, "png")

        gtif_file_name = str(ovr) + "_gtiff_images.tif"
        gtif_path = os.path.join(raw_path, gtif_file_name)
        
        print("Running Translate...")
        gdal.Translate(gtif_path, image_path, outputBounds=[xmin, ymax, xmax, ymin], bandList=[1,2,3], outputSRS="EPSG:2193")
        os.remove(image_path)

        
    
