import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/WebGLTile';
import GeoTIFF from 'ol/source/GeoTIFF';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';
import {fromLonLat} from 'ol/proj';
// import OSM from 'ol/source/OSM';
// import MapLibreLayer from '@geoblocks/ol-maplibre-layer';

// import Overlay from 'ol/Overlay';

// import OSM from 'ol/source/OSM';

// set NZTM projection extent so OL can determine zoom level 0 extents.
proj4.defs("EPSG:2193","+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4)
// var projection = ol.proj.get("EPSG:2193");
const nztmProjection = getProjection('EPSG:2193');
// projection.setExtent([827933.23, 3729820.29, 3195373.59, 7039943.58]);

// // NZTM tile matrix origin, resolution and matrixId definitions.
// const origin = [-1000000, 10000000];
const resolutions = [
  8960,
  4480,
  2240,
  1120,
  560,
  280,
  140,
  70,
  28,
  14,
  7,
  2.8,
  1.4,
  0.7,
  0.28,
  0.14,
  0.07
];
const matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// URL to COG tile
// const url = 'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/HM_COG.tif'
const url = 'http://localhost:5173/cog/HM_COG.tif'

const cogSource = new GeoTIFF({
  sources: [
    {
      url: url,
      tileSize: 256,
    }
  ],
  convertToRGB: true,
});

// cog file load and colour values
const cog = new TileLayer({
  crossOrigin: 'anonymous',
  source: cogSource
})


// draw map
const map = new Map ({
  layers: [cog],
  target: 'map',
  view: new View({
    projection: nztmProjection,
    center: fromLonLat([176.0,-38.68], nztmProjection),
    zoom: 6,
    maxZoom: 6,
    minZoom: 10,
    resolutions: resolutions,
    matrixIds: matrixIds,
    constrainResolution: true,
    smoothResolutionConstraint: true
  })
});
