import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/WebGLTile';
import {Group} from 'ol/layer';
import GeoTIFF from 'ol/source/GeoTIFF';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';
import {fromLonLat} from 'ol/proj';
import XYZ from 'ol/source/XYZ.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';


// set NZTM projection extent so OL can determine zoom level 0 extents.
proj4.defs("EPSG:2193","+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4)
const nztmProjection = getProjection('EPSG:2193');

// // NZTM tile matrix origin, resolution and matrixId definitions.
var origin = [-1000000, 10000000];
var resolutions = [ 8960, 4480, 2240, 1120, 560, 280, 140, 70, 28, 14, 7, 2.8, 1.4, 0.7, 0.28, 0.14, 0.07 ];
var matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// URL to COG tile
const url = "http://localhost:8000/raster-tiles/{z}/{x}/{y}.png"

// Load XYZ
const colour = new TileLayer({
  title: 'Colour',
  crossOrigin: 'anonymous',
  maxZoom: 8,
  source: new XYZ({
    url: url,
    wrapX: true,
    projection: nztmProjection,
    tileGrid: new TileGrid({
      origin: origin,
      resolutions: resolutions,
      matrixIds: matrixIds,
      extent: [827933.23, 3729820.29, 3195373.59, 7039943.58],
      tileSize: [256, 256],
    })
  })
})

const extent = [279896.0625000000000000,3227622.5000000000000000,3279896.0625000000000000,7227622.5000000000000000]

// // URL to COG tile
// const urlCOG = "https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/50000-cog.tif"

// // load COG
// const cogSource = new GeoTIFF({
//   sources: [
//     {
//       url:urlCOG,
//     },
//   ],
//   convertToRGB: true,
// })

// const cog = new TileLayer({
//   crossOrigin: 'anonymous',
//   source: cogSource,
//   extent: extent,
//   title: 'single'
// })


// draw map
const map = new Map ({
  layers: [colour],
  target: 'map-js',
  view: new View({
    projection: nztmProjection,
    center: fromLonLat([176.0,-38.68], nztmProjection),
    zoom: 0,
    resolutions: resolutions,
    constrainResolution: true,
    smoothResolutionConstraint: true,
    enableRotation: false,
  })
});