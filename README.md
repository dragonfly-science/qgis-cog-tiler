# qgis-cog-tiler

Process to to take QGIS project throught to COG creatng a COG raster that acts like a styled raster tile.

The method is still in early development. A scripted method to leverage pyQGIS to export styled images at each zoom scale of interest, then convert thos images into a single COG format. 

The basic premise is to create a QGIS project with data that employs styling rules for each zoom level. This includes changs inline widths, blending, turning data on and off, etc.  With the QGIS project in place, we then export raw tif images for each zoom scale at varying resolutions (mirroring a similar process to Tilemill).  The images are coverted to GeoTiff and built using an overview structure, with the lowest resolution being the root. The root image, with overviews, is then converted to a COG.  The COG is a single Tif image, with overviews internally tiled like a raster tile. This COG can then be used in a web client like a raster tile 

## Method
Experimental: This process is developed to work on a specific QGIS project and a single extent

TODO:
1. Build an S3 repo for data needed in QGIS project

### Open QGIS project
TODO:
1. Develop script to pull QGIS Docker
2. Expand project to larger area

```
bash qgis/qgis-launch/run_qgis3.24.sh
```

### Launch Tiler
TODO:
1. Tiler is no different then QGIS project, except script launches inside QGIS docker. Work out whether this is needed

```
bash qgis/qgis-tiler/run_qgis3.24_tiler.sh
```

### Export Images
TODO:
1. Script spcific to single extent. Build out to larger area.

```
python3 utils/image_export.py
```

### Create COG
TODO:
1. COG creation ATM, needs to run outside of Docker container. Build new Docker with COG capabilites, Needed is >= GDAL 3.1

```
bash utils/create_cog.sh
```

### On the Web
TODO:
1. Build out web process to view COG online. See: https://github.com/dragonfly-science/paua-tile-service