export class ToKML {
  constructor(doc: string, fc: Function) {
    //this.gj = fc();
    // styleindex keeps track of hashed styles in order to match features
    this.styleIndex = {};
    this.styleByHash = {};
    // stylemapindex keeps track of style maps to expose in properties
    this.styleMapIndex = {};
    // atomic geospatial types supported by KML - MultiGeometry is
    // handled separately
    this.geotypes = ['Polygon', 'LineString', 'Point', 'Track', 'gx:Track'];
    // all root placemarks in the file
    this.placemarks = get(doc, 'Placemark');
    this.styles = get(doc, 'Style');
    this.styleMaps = get(doc, 'StyleMap');

    for (var k = 0; k < styles.length; k++) {
      var hash = okhash(xml2str(styles[k])).toString(16);
      styleIndex['#' + attr(styles[k], 'id')] = hash;
      styleByHash[hash] = styles[k];
    }
    for (var l = 0; l < styleMaps.length; l++) {
      styleIndex['#' + attr(styleMaps[l], 'id')] = okhash(
        xml2str(styleMaps[l])
      ).toString(16);
      var pairs = get(styleMaps[l], 'Pair');
      var pairsMap = {};
      for (var m = 0; m < pairs.length; m++) {
        pairsMap[nodeVal(get1(pairs[m], 'key'))] = nodeVal(
          get1(pairs[m], 'styleUrl')
        );
      }
      styleMapIndex['#' + attr(styleMaps[l], 'id')] = pairsMap;
    }
    for (var j = 0; j < placemarks.length; j++) {
      gj.features = gj.features.concat(getPlacemark(placemarks[j]));
    }
  }

  private kmlColor(v) {
    var color, opacity;
    v = v || '';
    if (v.substr(0, 1) === '#') {
      v = v.substr(1);
    }
    if (v.length === 6 || v.length === 3) {
      color = v;
    }
    if (v.length === 8) {
      opacity = parseInt(v.substr(0, 2), 16) / 255;
      color = '#' + v.substr(6, 2) + v.substr(4, 2) + v.substr(2, 2);
    }
    return [color, isNaN(opacity) ? undefined : opacity];
  }

  private gxCoord(v) {
    return numarray(v.split(' '));
  }

  private gxCoords(root) {
    var elems = get(root, 'coord', 'gx'),
      coords = [],
      times = [];
    if (elems.length === 0) elems = get(root, 'gx:coord');
    for (var i = 0; i < elems.length; i++)
      coords.push(gxCoord(nodeVal(elems[i])));
    var timeElems = get(root, 'when');
    for (var j = 0; j < timeElems.length; j++)
      times.push(nodeVal(timeElems[j]));
    return {
      coords: coords,
      times: times
    };
  }

  private getGeometry(root) {
    var geomNode,
      geomNodes,
      i,
      j,
      k,
      geoms = [],
      coordTimes = [];
    if (get1(root, 'MultiGeometry')) {
      return getGeometry(get1(root, 'MultiGeometry'));
    }
    if (get1(root, 'MultiTrack')) {
      return getGeometry(get1(root, 'MultiTrack'));
    }
    if (get1(root, 'gx:MultiTrack')) {
      return getGeometry(get1(root, 'gx:MultiTrack'));
    }
    for (i = 0; i < geotypes.length; i++) {
      geomNodes = get(root, geotypes[i]);
      if (geomNodes) {
        for (j = 0; j < geomNodes.length; j++) {
          geomNode = geomNodes[j];
          if (geotypes[i] === 'Point') {
            geoms.push({
              type: 'Point',
              coordinates: coord1(nodeVal(get1(geomNode, 'coordinates')))
            });
          } else if (geotypes[i] === 'LineString') {
            geoms.push({
              type: 'LineString',
              coordinates: coord(nodeVal(get1(geomNode, 'coordinates')))
            });
          } else if (geotypes[i] === 'Polygon') {
            var rings = get(geomNode, 'LinearRing'),
              coords = [];
            for (k = 0; k < rings.length; k++) {
              coords.push(coord(nodeVal(get1(rings[k], 'coordinates'))));
            }
            geoms.push({
              type: 'Polygon',
              coordinates: coords
            });
          } else if (geotypes[i] === 'Track' || geotypes[i] === 'gx:Track') {
            var track = gxCoords(geomNode);
            geoms.push({
              type: 'LineString',
              coordinates: track.coords
            });
            if (track.times.length) coordTimes.push(track.times);
          }
        }
      }
    }
    return {
      geoms: geoms,
      coordTimes: coordTimes
    };
  }

  private getPlacemark(root) {
    var geomsAndTimes = getGeometry(root),
      i,
      properties = {},
      name = nodeVal(get1(root, 'name')),
      address = nodeVal(get1(root, 'address')),
      styleUrl = nodeVal(get1(root, 'styleUrl')),
      description = nodeVal(get1(root, 'description')),
      timeSpan = get1(root, 'TimeSpan'),
      timeStamp = get1(root, 'TimeStamp'),
      extendedData = get1(root, 'ExtendedData'),
      lineStyle = get1(root, 'LineStyle'),
      polyStyle = get1(root, 'PolyStyle'),
      visibility = get1(root, 'visibility');

    if (!geomsAndTimes.geoms.length) return [];
    if (name) properties.name = name;
    if (address) properties.address = address;
    if (styleUrl) {
      if (styleUrl[0] !== '#') {
        styleUrl = '#' + styleUrl;
      }

      properties.styleUrl = styleUrl;
      if (styleIndex[styleUrl]) {
        properties.styleHash = styleIndex[styleUrl];
      }
      if (styleMapIndex[styleUrl]) {
        properties.styleMapHash = styleMapIndex[styleUrl];
        properties.styleHash = styleIndex[styleMapIndex[styleUrl].normal];
      }
      // Try to populate the lineStyle or polyStyle since we got the style hash
      var style = styleByHash[properties.styleHash];
      if (style) {
        if (!lineStyle) lineStyle = get1(style, 'LineStyle');
        if (!polyStyle) polyStyle = get1(style, 'PolyStyle');
        var iconStyle = get1(style, 'IconStyle');
        if (iconStyle) {
          var icon = get1(iconStyle, 'Icon');
          if (icon) {
            var href = nodeVal(get1(icon, 'href'));
            if (href) properties.icon = href;
          }
        }
      }
    }
    if (description) properties.description = description;
    if (timeSpan) {
      var begin = nodeVal(get1(timeSpan, 'begin'));
      var end = nodeVal(get1(timeSpan, 'end'));
      properties.timespan = { begin: begin, end: end };
    }
    if (timeStamp) {
      properties.timestamp = nodeVal(get1(timeStamp, 'when'));
    }
    if (lineStyle) {
      var linestyles = kmlColor(nodeVal(get1(lineStyle, 'color'))),
        color = linestyles[0],
        opacity = linestyles[1],
        width = parseFloat(nodeVal(get1(lineStyle, 'width')));
      if (color) properties.stroke = color;
      if (!isNaN(opacity)) properties['stroke-opacity'] = opacity;
      if (!isNaN(width)) properties['stroke-width'] = width;
    }
    if (polyStyle) {
      var polystyles = kmlColor(nodeVal(get1(polyStyle, 'color'))),
        pcolor = polystyles[0],
        popacity = polystyles[1],
        fill = nodeVal(get1(polyStyle, 'fill')),
        outline = nodeVal(get1(polyStyle, 'outline'));
      if (pcolor) properties.fill = pcolor;
      if (!isNaN(popacity)) properties['fill-opacity'] = popacity;
      if (fill)
        properties['fill-opacity'] =
          fill === '1' ? properties['fill-opacity'] || 1 : 0;
      if (outline)
        properties['stroke-opacity'] =
          outline === '1' ? properties['stroke-opacity'] || 1 : 0;
    }
    if (extendedData) {
      var datas = get(extendedData, 'Data'),
        simpleDatas = get(extendedData, 'SimpleData');

      for (i = 0; i < datas.length; i++) {
        properties[datas[i].getAttribute('name')] = nodeVal(
          get1(datas[i], 'value')
        );
      }
      for (i = 0; i < simpleDatas.length; i++) {
        properties[simpleDatas[i].getAttribute('name')] = nodeVal(
          simpleDatas[i]
        );
      }
    }
    if (visibility) {
      properties.visibility = nodeVal(visibility);
    }
    if (geomsAndTimes.coordTimes.length) {
      properties.coordTimes =
        geomsAndTimes.coordTimes.length === 1
          ? geomsAndTimes.coordTimes[0]
          : geomsAndTimes.coordTimes;
    }
    var feature = {
      type: 'Feature',
      geometry:
        geomsAndTimes.geoms.length === 1
          ? geomsAndTimes.geoms[0]
          : {
              type: 'GeometryCollection',
              geometries: geomsAndTimes.geoms
            },
      properties: properties
    };
    if (attr(root, 'id')) feature.id = attr(root, 'id');
    return [feature];
  }
}
