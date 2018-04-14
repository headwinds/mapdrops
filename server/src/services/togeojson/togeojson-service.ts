import tj = require('togeojson');
import fs = require('fs');

declare module 'togeojson-service';

// node doesn't have xml parsing or a dom. use xmldom
const DOMParser = require('xmldom').DOMParser;

export const convertGpxToGeoJSON = gpx => {
  //var gpx = new DOMParser().parseFromString(fs.readFileSync('foo.kml', 'utf8'));
  return tj.gpx(gpx);
};
