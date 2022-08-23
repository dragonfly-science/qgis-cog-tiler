import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/WebGLTile';
import GeoTIFF from 'ol/source/GeoTIFF';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';
import {fromLonLat} from 'ol/proj';

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

// URL to COG tile
const urls = [
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/HM_COG.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/HN_COG.tif'
]

function getSourceURLs(urls) {
  var urlArray = [];
  urls.forEach(address => urlArray.push(
    new GeoTIFF({
        sources: [
          {
            url:address,
            tileSize: 256,
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
  sources: getSourceURLs(urls)
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