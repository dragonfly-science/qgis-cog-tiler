from qgis.core import *
from qgis.gui import *
from qgis.PyQt.QtCore import *
from qgis.PyQt.QtGui import *

import os
import math
from osgeo import gdal
import shutil
import subprocess

# bash run_qgis3.24_tiler.sh
# python3 utils/image_export.py

project_path = "qgis/qgis-projects/overview-tests.qgz"

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

meter_to_inch = 39.3701
dpi = 90.71428571428571
scales = [500000, 250000, 100000, 50000, 25000]

for_cog_list = []
for scl in scales:
    print(scl)
    width = math.ceil(
        abs(
            (((proj_extent.xMinimum() - proj_extent.xMaximum()) * meter_to_inch) / scl)
            * dpi
        )
    )
    height = math.ceil(
        abs(
            (((proj_extent.yMinimum() - proj_extent.yMaximum()) * meter_to_inch) / scl)
            * dpi
        )
    )
    file_name = str(scl) + "_test_images.tif"
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

    gtif_file_name = str(scl) + "_gtiff_images.tif"
    gtif_path = os.path.join("data-outputs", "processed-raw", gtif_file_name)

    if scl == 500000:
        ext = ".ovr.ovr.ovr.ovr"
    elif scl == 250000:
        ext = ".ovr.ovr.ovr"
    elif scl == 100000:
        ext = ".ovr.ovr"
    elif scl == 50000:
        ext = ".ovr"
    elif scl == 25000:
        ext = ""

    xmin = proj_extent.xMinimum()
    ymin = proj_extent.yMinimum()
    xmax = proj_extent.xMaximum()
    ymax = proj_extent.yMaximum()

    gdal.Translate(gtif_path, image_path, outputBounds=[xmin, ymax, xmax, ymin])
    os.remove(image_path)

    for_cog_list.append(gtif_path)

    get_last = scales[-1]
    print(get_last)
    cog_name = os.path.join(
        "data-outputs", "processed-overviews", (str(get_last) + ".tif" + ext)
    )
    shutil.copy(gtif_path, cog_name)

# source_cog = for_cog_list[-1]
# main_cog =  os.path.join("pyqis_test", "cog", "MAIN_COG.tif")
# gdal_cog_command = f"gdal_translate {source_cog} {main_cog} -of COG"
# subprocess.call(gdal_cog_command, shell=True)
# print("So far, so good")
