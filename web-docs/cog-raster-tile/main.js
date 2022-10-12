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
];
const matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

const extent = [279896.0625000000000000,3227622.5000000000000000,3279896.0625000000000000,7227622.5000000000000000]

// URL to COG tile
const urls = [
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/0.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/1.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/2.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/3.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/4.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/5.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/6.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/7.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/8.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/9.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/10.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/11.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/12.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/13.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/14.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/15.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/16.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/17.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/18.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/19.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/20.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/21.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/22.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/23.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/24.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/25.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/26.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/27.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/28.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/29.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/30.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/31.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/32.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/33.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/34.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/35.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/36.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/37.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/38.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/39.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/40.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/41.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/42.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/43.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/44.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/45.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/46.tif',
  'https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/47.tif',
]



// function getSourceURLs(urls) {
//   var urlArray = [];
//   urls.forEach(address => urlArray.push(
//     new GeoTIFF({
//         sources: [
//           {
//             url:address,
//           },
//         ],
//         convertToRGB: true,
//         interpolate: false,
//       }), 
//     ))
//     return urlArray
// }


// const cog = new TileLayer({
//   crossOrigin: 'anonymous',
//   sources: getSourceURLs(urls),
// })

const url = "https://d3cywq4ybqu7io.cloudfront.net/cogs/as-raster-tile/50000-cog.tif"
// const url = "http://localhost:5173/cog/50000-cog.tif"

const cogSource = new GeoTIFF({
  sources: [
    {
      url:url,
    },
  ],
  convertToRGB: true,
})

console.log(cogSource)

const cog = new TileLayer({
  crossOrigin: 'anonymous',
  source: cogSource,
  extent: extent,
})

// draw map
const map = new Map ({
  layers: [cog],
  target: 'map',
  pixelRatio: 1,
  view: new View({
    projection: nztmProjection,
    center: fromLonLat([176.0,-38.68], nztmProjection),
    zoom: 6,
    resolutions: resolutions,
    constrainResolution: true,
    smoothResolutionConstraint: true,
  })
});


// map.on('loadstart', function () {
//   map.getTargetElement().classList.add('spinner');
// });
// map.on('loadend', function () {
//   map.getTargetElement().classList.remove('spinner');
// });