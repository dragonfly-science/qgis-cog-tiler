import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/WebGLTile';
import GeoTIFF from 'ol/source/GeoTIFF';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';
import {fromLonLat} from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import TileGrid from 'ol/tilegrid/TileGrid';

// set NZTM projection extent so OL can determine zoom level 0 extents.
proj4.defs("EPSG:2193","+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4)
const nztmProjection = getProjection('EPSG:2193');

// // NZTM tile matrix origin, resolution and matrixId definitions.
const origin = [-1000000, 10000000];
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

// var fs = require('fs');
// var files = fs.readdirSync('/assets/photos/');

const extent = [279896.0625000000000000,3227622.5000000000000000,3279896.0625000000000000,7227622.5000000000000000]

// URL to COG tile
const urls = [
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/0.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/1.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/2.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/3.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/4.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/5.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/6.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/7.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/8.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/9.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/10.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/11.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/12.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/13.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/14.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/15.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/16.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/17.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/18.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/19.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/20.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/21.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/22.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/23.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/24.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/25.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/26.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/27.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/28.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/29.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/30.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/31.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/32.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/33.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/34.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/35.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/36.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/37.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/38.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/39.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/40.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/41.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/42.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/43.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/44.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/45.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/46.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/47.tif',
]

function getSourceURLs(urls) {
  var urlArray = [];
  urls.forEach(address => urlArray.push(
    new GeoTIFF({
        sources: [
          {
            url:address,
          },
        ],
        convertToRGB: true,
        interpolate: false,
      }), 
    ))
    return urlArray
}

const cog = new TileLayer({
  crossOrigin: 'anonymous',
  sources: getSourceURLs(urls),
})

//  const urlTemplate =
// "https://tiles.maps.linz.io/nz_topo_basemap/NZTM/{z}/{x}/{y}.png";

// // Set raster layer
// const layer = new TileLayer({
//   crossOrigin: 'anonymous',
//   source: new XYZ({
//     url: urlTemplate,
//     projection: nztmProjection,
//     attributions: ['<a href="http://data.linz.govt.nz">Data from LINZ. CC BY 4.0</a>'],
//     tileGrid: new TileGrid({
//       origin: origin,
//       resolutions: resolutions,
//       matrixIds: matrixIds,
//       extent: [827933.23, 3729820.29, 3195373.59, 7039943.58]
//     })
//   })
// });

// draw map
const map = new Map ({
  layers: [cog],
  target: 'map',
  pixelRatio: 1,
  view: new View({
    projection: nztmProjection,
    center: fromLonLat([176.0,-38.68], nztmProjection),
    zoom: 6,
    maxZoom: 14,
    minZoom: 0,
    resolutions: resolutions,
    matrixIds: matrixIds,
    constrainResolution: true,
    smoothResolutionConstraint: false,
    multiWorld: false,
  })
});