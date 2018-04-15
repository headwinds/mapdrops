export class ToGPX {

  constructor(doc) {
  var i,
    tracks = get(doc, 'trk'),
    routes = get(doc, 'rte'),
    waypoints = get(doc, 'wpt'),
    // a feature collection
    gj = fc(),
    feature;
  for (i = 0; i < tracks.length; i++) {
    feature = getTrack(tracks[i]);
    if (feature) gj.features.push(feature);
  }
  for (i = 0; i < routes.length; i++) {
    feature = getRoute(routes[i]);
    if (feature) gj.features.push(feature);
  }
  for (i = 0; i < waypoints.length; i++) {
    gj.features.push(getPoint(waypoints[i]));
  }
  function initializeArray(arr, size) {
    for (var h = 0; h < size; h++) {
      arr.push(null);
    }
    return arr;
  }
  function getPoints(node, pointname) {
    var pts = get(node, pointname),
      line = [],
      times = [],
      heartRates = [],
      l = pts.length;
    if (l < 2) return {}; // Invalid line in GeoJSON
    for (var i = 0; i < l; i++) {
      var c = coordPair(pts[i]);
      line.push(c.coordinates);
      if (c.time) times.push(c.time);
      if (c.heartRate || heartRates.length) {
        if (!heartRates.length) initializeArray(heartRates, i);
        heartRates.push(c.heartRate || null);
      }
    }
    return {
      line: line,
      times: times,
      heartRates: heartRates
    };
  }
  function getTrack(node) {
    var segments = get(node, 'trkseg'),
      track = [],
      times = [],
      heartRates = [],
      line;
    for (var i = 0; i < segments.length; i++) {
      line = getPoints(segments[i], 'trkpt');
      if (line) {
        if (line.line) track.push(line.line);
        if (line.times && line.times.length) times.push(line.times);
        if (
          heartRates.length ||
          (line.heartRates && line.heartRates.length)
        ) {
          if (!heartRates.length) {
            for (var s = 0; s < i; s++) {
              heartRates.push(initializeArray([], track[s].length));
            }
          }
          if (line.heartRates && line.heartRates.length) {
            heartRates.push(line.heartRates);
          } else {
            heartRates.push(initializeArray([], line.line.length || 0));
          }
        }
      }
    }
    if (track.length === 0) return;
    var properties = getProperties(node);
    extend(properties, getLineStyle(get1(node, 'extensions')));
    if (times.length)
      properties.coordTimes = track.length === 1 ? times[0] : times;
    if (heartRates.length)
      properties.heartRates =
        track.length === 1 ? heartRates[0] : heartRates;
    return {
      type: 'Feature',
      properties: properties,
      geometry: {
        type: track.length === 1 ? 'LineString' : 'MultiLineString',
        coordinates: track.length === 1 ? track[0] : track
      }
    };
  }
  function getRoute(node) {
    var line = getPoints(node, 'rtept');
    if (!line.line) return;
    var prop = getProperties(node);
    extend(prop, getLineStyle(get1(node, 'extensions')));
    var routeObj = {
      type: 'Feature',
      properties: prop,
      geometry: {
        type: 'LineString',
        coordinates: line.line
      }
    };
    return routeObj;
  }
  function getPoint(node) {
    var prop = getProperties(node);
    extend(prop, getMulti(node, ['sym']));
    return {
      type: 'Feature',
      properties: prop,
      geometry: {
        type: 'Point',
        coordinates: coordPair(node).coordinates
      }
    };
  }
  function getLineStyle(extensions) {
    var style = {};
    if (extensions) {
      var lineStyle = get1(extensions, 'line');
      if (lineStyle) {
        var color = nodeVal(get1(lineStyle, 'color')),
          opacity = parseFloat(nodeVal(get1(lineStyle, 'opacity'))),
          width = parseFloat(nodeVal(get1(lineStyle, 'width')));
        if (color) style.stroke = color;
        if (!isNaN(opacity)) style['stroke-opacity'] = opacity;
        // GPX width is in mm, convert to px with 96 px per inch
        if (!isNaN(width)) style['stroke-width'] = width * 96 / 25.4;
      }
    }
    return style;
  }
  function getProperties(node) {
    var prop = getMulti(node, [
        'name',
        'cmt',
        'desc',
        'type',
        'time',
        'keywords'
      ]),
      links = get(node, 'link');
    if (links.length) prop.links = [];
    for (var i = 0, link; i < links.length; i++) {
      link = { href: attr(links[i], 'href') };
      extend(link, getMulti(links[i], ['text', 'type']));
      prop.links.push(link);
    }
    return prop;
  }
  return gj;
}
}
