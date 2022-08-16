# qgis-cog-tiler

Process to to take QGIS project throught to COG creatng a COG raster that acts like a styled raster tile.

The method is still in early development. A scripted method to leverage pyQGIS to export styled images at each zoom scale of interest, then convert thos images into a single COG format. 

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
Tiler is no different then QGIS project, except script launches inside QGIS docker. Work out whether this is needed

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