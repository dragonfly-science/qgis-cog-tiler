# QGIS COG Tiler

Process to take QGIS project through to COG creatng a COG raster that acts like a styled raster tile.

The method is still in development. 

## Summary

A scripted method to leverage QGIS and pyQGIS to export styled images at each zoom scale of interest, then convert those images into a single COG format. 

The basic premise is to create a QGIS project with data that employs styling rules for each zoom level. This includes changes in line widths, blending, turning data on and off, etc.  With the QGIS project in place, we then export raw tif images for each zoom scale at varying resolutions.  The images are coverted to GeoTiff and built using an overview structure, with the lowest resolution being the root. The root image, with overviews, is then converted to a COG.  The COG is a single Tif image, with overviews internally tiled like a raster tile. This COG can then be used in a web client like a raster tile.

This method requires a Tile Matrix. For this project, resolutions and scales set per LINZ map tiles standards: https://www.linz.govt.nz/data/linz-data-service/guides-and-documentation/nztm2000-map-tile-service-schema 

## Method
Base process is as follows:

1. Develop QGIS project
2. Build in zoom rules for scales
3. "Export as Image" based on scale
4. Images are built with an overview structure, with the lowest scale being the base of the overviews
5. Combine images into COG.
6. Upload COG to S3 and consume via webviewer

TODO:
1. Build an S3 repo for data needed in QGIS project

### Open QGIS project
TODO:
1. Develop script to pull QGIS Docker
2. Expand project to larger area
3. Fix this to properly run project from Docker

```
bash qgis/qgis-launch/run_qgis3.24.sh qgis/qgis-projects/full-nz.qgz
```

### Launch Tiler
Launch Tiler to run processing script inside

TODO:
1. Tiler is no different then QGIS project, except script launches inside QGIS docker.

```
bash qgis/qgis-tiler/run_qgis3.24_tiler.sh
```

### Export Images

Inside tiler run:

```
python3 utils/image-export-nz-all.py
```

### Create Overviews from VRTs
TODO:
1. COG creation ATM, needs to run outside of Docker container. Build new Docker with COG capabilites, Needed is >= GDAL 3.1

```
bash utils/overviews-from-vrt.sh
```

### Create COG

```
gdal_translate ./qgis-cog-tiler/data-outputs/full-nz/holding/50000.tif ./qgis-cog-tiler/web-docs/cog-raster-tile/cog/50000-cog.tif -of COG -co COMPRESS=JPEG -co NUM_THREADS=ALL_CPUS -co QUALITY=100
```

### On the Web
TODO:
1. Build out web process to view COG online. See: https://github.com/dragonfly-science/paua-tile-service

### Launch Web Editing

Web components built using OpenLayers v6

```
npm start
```

Build project and move build to proper location fro Git to use:

```
bash utils/build-move.sh
```

Still have to manually edit index.html file at:

```
docs/index.html
```

Change to this in file

```
 <script type="module" crossorigin src="./assets/index.47111414.js"></script>
  <link rel="stylesheet" href="./assets/index.0a012ce8.css">
```