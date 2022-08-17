from qgis.core import *
from qgis.gui import *
from qgis.PyQt.QtCore import *
from qgis.PyQt.QtGui import *

import os
import math
from osgeo import gdal
import shutil
import subprocess

# bash  qgis/qgis-tiler/run_qgis3.24_tiler.sh
# python3 utils/image_export.py

project_path = "qgis/qgis-projects/vrt-tests.qgz"

# Supply path to qgis install location
QgsApplication.setPrefixPath("/usr", False)

# Create a reference to the QgsApplication.  Setting the
# second argument to False disables the GUI.
qgs = QgsApplication([], True)

# Load providers
qgs.initQgis()

project = QgsProject.instance()

# Load another project
project.read(project_path)


# Project Extent
proj_extent = project.mapLayersByName("hm-extent")[0].extent()

# Resolutions and scales set per LINZ map tiles standards:
# https://www.linz.govt.nz/data/linz-data-service/guides-and-documentation/nztm2000-map-tile-service-schema
meter_to_inch = 39.3701
dpi = 90.71428571428571
scales = [500000, 250000, 100000, 50000, 25000]
root_scale = min(scales)
sorted_list = sorted(scales, reverse=False)
list_length = len(sorted_list)

for_cog_list = []
ovr_ext = ".ovr"
ovr_name = str(root_scale) + ".tif"
print(ovr_name)
for ovr in sorted_list:
    if ovr != root_scale:
        ovr_name = ovr_name + ovr_ext

    width = math.ceil(
        abs(
            (((proj_extent.xMinimum() - proj_extent.xMaximum()) * meter_to_inch) / ovr)
            * dpi
        )
    )
    height = math.ceil(
        abs(
            (((proj_extent.yMinimum() - proj_extent.yMaximum()) * meter_to_inch) / ovr)
            * dpi
        )
    )
    file_name = str(ovr) + "_test_images.tif"
    image_path = os.path.join("data-outputs", "processed-raw", file_name)

    # Start Map Settings
    settings = QgsMapSettings()
    settings.setOutputSize(QSize(width, height))

    settings.setDestinationCrs(QgsCoordinateReferenceSystem(2193))

    # Set layers to render
    layers = list([lyr for lyr in project.layerTreeRoot().checkedLayers()])
    settings.setLayers(layers)

    # Set Extent
    settings.setExtent(proj_extent)

    # # setup qgis map renderer
    render = QgsMapRendererParallelJob(settings)

    def finished():
        img = render.renderedImage()
        img.save(image_path, "tif")

    render.finished.connect(finished)
    render.start()

    from qgis.PyQt.QtCore import QEventLoop

    loop = QEventLoop()
    render.finished.connect(loop.quit)
    loop.exec_()

    gtif_file_name = str(ovr) + "_gtiff_images.tif"
    gtif_path = os.path.join("data-outputs", "processed-raw", gtif_file_name)

    xmin = proj_extent.xMinimum()
    ymin = proj_extent.yMinimum()
    xmax = proj_extent.xMaximum()
    ymax = proj_extent.yMaximum()

    gdal.Translate(gtif_path, image_path, outputBounds=[xmin, ymax, xmax, ymin], bandList=[1,2,3], outputSRS="EPSG:2193")
    os.remove(image_path)

    for_cog_list.append(gtif_path)

    cog_name = os.path.join("data-outputs", "processed-overviews", (ovr_name))
    shutil.copy(gtif_path, cog_name)

# source_cog = for_cog_list[-1]
# main_cog =  os.path.join("pyqis_test", "cog", "MAIN_COG.tif")
# gdal_cog_command = f"gdal_translate {source_cog} {main_cog} -of COG"
# subprocess.call(gdal_cog_command, shell=True)
# print("So far, so good")
