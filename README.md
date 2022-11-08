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


### Open QGIS project

QGIS editor and tiler can be run from Docker:

```
docker pull dragonflyscience/qgis-builds:3.22.12.ltr.20221109
```

or users can build the QGIS docker using:

```
make docker
```

Launch QGIS editor:

```
make qgis
```

Launch Tiler

```
make tiler
```

### Export Images

Inside tiler run:

```
make QGISPROJECT=[YOUR QGIS PROJECT PATH HERE].qgz SCALES=YOUR,SCALES.HERE image-exports
```

Example:

```
make QGISPROJECT=qgis/full-nz.qgz.qgz SCALES=32000000,16000000,8000000 image-exports
```

### Create VRTs and COGs

After images are created:

```
make QGISPROJECTNAME=[YOUR QGIS PROJECT NAME HERE] SCALES="YOUR SCALES HERE" create-cog
```

Example:

```
make QGISPROJECTNAME=full-nz SCALES="32000000 16000000 8000000" create-cog
```


## On the Web
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