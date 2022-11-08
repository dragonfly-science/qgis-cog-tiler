#!/bin/bash

cd web-docs/cog-raster-tile

npm run build

cp -rv dist/assets /home/ireese/dragonfly/qgis-cog-tiler/docs/

cp -v dist/index.html /home/ireese/dragonfly/qgis-cog-tiler/docs/index.html