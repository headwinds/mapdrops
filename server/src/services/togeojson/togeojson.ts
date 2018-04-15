'use strict';

import { ToKML } from './to-kml';
import { ToGPX } from './to-gpx';

export class toGeoJSON {
  private removeSpace: Regex;
  private trimSpace: Regex;
  private splitSpace: Regex;
  public kml: ToKML;
  public gpx: ToGPX;
  private serializer: XMLSerializer;

  constructor() {
    this.removeSpace = /\s*/g;
    this.trimSpace = /^\s*|\s*$/g;
    this.splitSpace = /\s+/;

    this.kml = new ToKML(doc, this.fc);
    this.gpx = new ToGPX(doc);

    if (typeof XMLSerializer !== 'undefined') {
      /* istanbul ignore next */
      serializer = new XMLSerializer();
    } else {
      var isNodeEnv = typeof process === 'object' && !process.browser;
      var isTitaniumEnv = typeof Titanium === 'object';
      if (typeof exports === 'object' && (isNodeEnv || isTitaniumEnv)) {
        serializer = new (require('xmldom')).XMLSerializer();
      } else {
        throw new Error('Unable to initialize serializer');
      }
    }
  }

  // generate a short, numeric hash of a string
  private okhash(x) {
    if (!x || !x.length) return 0;
    for (var i = 0, h = 0; i < x.length; i++) {
      h = ((h << 5) - h + x.charCodeAt(i)) | 0;
    }
    return h;
  }
  // all Y children of X
  private get(x, y) {
    return x.getElementsByTagName(y);
  }
  private attr(x, y) {
    return x.getAttribute(y);
  }
  private attrf(x, y) {
    return parseFloat(attr(x, y));
  }
  // one Y child of X, if any, otherwise null
  private get1(x, y) {
    var n = get(x, y);
    return n.length ? n[0] : null;
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/Node.normalize
  private norm(el) {
    if (el.normalize) {
      el.normalize();
    }
    return el;
  }
  // cast array x into numbers
  private numarray(x) {
    for (var j = 0, o = []; j < x.length; j++) {
      o[j] = parseFloat(x[j]);
    }
    return o;
  }
  // get the content of a text node, if any
  private nodeVal(x) {
    if (x) {
      norm(x);
    }
    return (x && x.textContent) || '';
  }
  // get the contents of multiple text nodes, if present
  private getMulti(x, ys) {
    var o = {},
      n,
      k;
    for (k = 0; k < ys.length; k++) {
      n = get1(x, ys[k]);
      if (n) o[ys[k]] = nodeVal(n);
    }
    return o;
  }
  // add properties of Y to X, overwriting if present in both
  private extend(x, y) {
    for (var k in y) x[k] = y[k];
  }
  // get one coordinate from a coordinate array, if any
  private coord1(v) {
    return numarray(v.replace(removeSpace, '').split(','));
  }
  // get all coordinates from a coordinate array as [[],[]]
  private coord(v) {
    var coords = v.replace(trimSpace, '').split(splitSpace),
      o = [];
    for (var i = 0; i < coords.length; i++) {
      o.push(coord1(coords[i]));
    }
    return o;
  }

  private coordPair(x) {
    var ll = [attrf(x, 'lon'), attrf(x, 'lat')],
      ele = get1(x, 'ele'),
      // handle namespaced attribute in browser
      heartRate = get1(x, 'gpxtpx:hr') || get1(x, 'hr'),
      time = get1(x, 'time'),
      e;
    if (ele) {
      e = parseFloat(nodeVal(ele));
      if (!isNaN(e)) {
        ll.push(e);
      }
    }
    return {
      coordinates: ll,
      time: time ? nodeVal(time) : null,
      heartRate: heartRate ? parseFloat(nodeVal(heartRate)) : null
    };
  }

  // create a new feature collection parent object
  public fc() {
    return {
      type: 'FeatureCollection',
      features: []
    };
  }

  private xml2str(str) {
    // IE9 will create a new XMLSerializer but it'll crash immediately.
    // This line is ignored because we don't run coverage tests in IE9
    /* istanbul ignore next */
    if (str.xml !== undefined) return str.xml;
    return serializer.serializeToString(str);
  }
}
