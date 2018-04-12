const tj = require('togeojson');
const fs = require('fs');

// node doesn't have xml parsing or a dom. use xmldom
const DOMParser = require('xmldom').DOMParser;

export const convertGpxToGeoJSON = gpx => {
  //var gpx = new DOMParser().parseFromString(fs.readFileSync('foo.kml', 'utf8'));
  return tj.gpx(gpx);
};
