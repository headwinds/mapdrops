import * as d3 from 'd3';
import * as _ from 'lodash';

// sample flat data
/*
const flatDataList = [
  { name: 'Top Level', parent: null, hasChildren: true },
  { name: 'Level 2: A', parent: 'Top Level', hasChildren: true },
  { name: 'Level 2: B', parent: 'Top Level', hasChildren: false },
  { name: 'Level 3: A', parent: 'Level 2: A', hasChildren: false },
  { name: 'Level 3: B', parent: 'Level 2: A', hasChildren: false },
  { name: 'Level 3: C', parent: 'Level 2: A', hasChildren: true },
  { name: 'Level 4: A', parent: 'Level 3: C', hasChildren: true },
  { name: 'Level 4: B', parent: 'Level 3: C', hasChildren: true },
  { name: 'Level 4: C', parent: 'Level 3: C', hasChildren: true }
];

const flatData = [];
flatDataList.map(data => {
  if (data.hasChildren) flatData.push(data);
});
*/

////////////////////////////////////////////////////// STYLE

const circleStyle = {
  fill: '#fff'
  //stroke: 'steelblue'
  //'stroke-width': '1.5px'
};

const linkStyle = {
  fill: 'none',
  stroke: '#FFF',
  'stroke-opacity': '0.4',
  'stroke-width': '10px'
};
// #a2e221, 158685
const textStyle = {
  fill: '#158685',
  'font-size': 16
};

//////////////////////////////////////////////////////

const getNodes = (flatData, width, height, margin) => {
  let i = 0;

  // convert the flat data into a hierarchy
  const treeData = d3
    .stratify()
    .id(function(d) {
      return d.name;
    })
    .parentId(function(d) {
      return d.parent;
    })(flatData);

  // assign the name to each node
  treeData.each(function(d) {
    d.name = d.id;
  });

  const tree = d3.tree().size([height, width]);

  const diagonal = d => {
    if (d.children && d.children.length > 0)
      return (
        'M' +
        d.y +
        ',' +
        d.x +
        'C' +
        (d.y + d.parent.y) / 2 +
        ',' +
        d.x +
        ' ' +
        (d.y + d.parent.y) / 2 +
        ',' +
        d.parent.x +
        ' ' +
        d.parent.y +
        ',' +
        d.parent.x
      );
  };

  // declares a tree layout and assigns the size
  const treemap = d3.tree().size([width, height]);

  //  assigns the data to a hierarchy using parent-child relationships
  let nodes = d3.hierarchy(treeData);

  // maps the node data to the tree layout
  return treemap(nodes);
};

/*
.node {
  cursor: pointer;
}

.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 1.5px;
}

.node text {
  font: 10px sans-serif;
}

.link {
  fill: none;
  stroke: #555;
  stroke-opacity: 0.4;
  stroke-width: 1.5px;
}*/

const styleElement = (el, style) => {
  _.forIn(style, (val, key) => {
    console.log('key: ', key);
    el.style(key, val);
  });
};

const getOnlyChildren = descendants => {
  const onlyChildren = [];
  descendants.map(descendant => {
    if (descendant.children) onlyChildren.push(descendant);
  });
  return onlyChildren;
};

const drawLink = d => {
  if (d.children && d.children.length > 0)
    return (
      'M' +
      d.x +
      ',' +
      d.y +
      'C' +
      d.x +
      ',' +
      (d.y + d.parent.y) / 2 +
      ' ' +
      d.parent.x +
      ',' +
      (d.y + d.parent.y) / 2 +
      ' ' +
      d.parent.x +
      ',' +
      d.parent.y
    );
};

//const getLinkStyle

export function drawVerticalTree(flatData, handleNodeClick) {
  const margin = { top: 40, right: 120, bottom: 20, left: 120 };

  const width = window.innerWidth - margin.right - margin.left;
  const height = window.innerHeight - margin.top - margin.bottom;

  //let nodes = getNodes(flatData, width, height, margin);

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  /*
  const svg = d3
      .select('#universe')
      .append('svg')
      .attr('id', 'space')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom),
    g = svg
      .append('g')
      .attr('id', 'world')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  */

  const g = d3.select('#world');

  console.log('world ', g);

  let nodes = getNodes(flatData, width, height, margin);

  // adds the links between the nodes
  const link = g
    .selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', drawLink);

  //link.style('stroke-width', '10px');

  styleElement(link, linkStyle);

  // adds each node as a group
  const node = g
    .selectAll('.node')
    .data(getOnlyChildren(nodes.descendants()))
    .enter()
    .append('g')
    .attr('class', function(d) {
      return 'node' + (d.children ? ' node--internal' : ' node--leaf');
    })
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    })
    .on('click', handleNodeClick);

  // adds the circle to the node
  const cirlce = node.append('circle').attr('r', 10);
  styleElement(cirlce, circleStyle);

  // adds the text to the node
  const text = node
    .append('text')
    .attr('dy', '.35em')
    .attr('y', function(d) {
      return d.children ? -20 : 20;
    })
    .style('text-anchor', 'middle')
    .text(function(d) {
      return d.data.name;
    });

  styleElement(text, textStyle);
}

export function drawHorizontalTree(flatData, handleNodeClick) {
  // convert the flat data into a hierarchy
  var treeData = d3
    .stratify()
    .id(function(d) {
      return d.name;
    })
    .parentId(function(d) {
      return d.parent;
    })(flatData);

  // assign the name to each node
  treeData.each(function(d) {
    d.name = d.id;
  });

  // set the dimensions and margins of the diagram
  var margin = { top: 20, right: 90, bottom: 30, left: 90 },
    width = 660 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // declares a tree layout and assigns the size
  var treemap = d3.tree().size([height, width]);

  //  assigns the data to a hierarchy using parent-child relationships
  var nodes = d3.hierarchy(treeData, function(d) {
    return d.children;
  });

  // maps the node data to the tree layout
  nodes = treemap(nodes);

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3
      .select('body')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom),
    g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const drawLink = d => {
    if (d.children && d.children.length > 0)
      return (
        'M' +
        d.y +
        ',' +
        d.x +
        'C' +
        (d.y + d.parent.y) / 2 +
        ',' +
        d.x +
        ' ' +
        (d.y + d.parent.y) / 2 +
        ',' +
        d.parent.x +
        ' ' +
        d.parent.y +
        ',' +
        d.parent.x
      );
  };

  // adds the links between the nodes
  var link = g
    .selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', drawLink);

  const getOnlyChildren = descendants => {
    console.log(descendants);
    const onlyChildren = [];
    descendants.map(descendant => {
      if (descendant.children) onlyChildren.push(descendant);
    });
    return onlyChildren;
  };

  // adds each node as a group
  var node = g
    .selectAll('.node')
    .data(getOnlyChildren(nodes.descendants()))
    .enter()
    .append('g')
    .attr('class', function(d) {
      return 'node' + (d.children ? ' node--internal' : ' node--leaf');
    })
    .attr('transform', function(d) {
      return 'translate(' + d.y + ',' + d.x + ')';
    })
    .on('click', handleNodeClick);

  // adds the circle to the node
  node.append('circle').attr('r', 10);

  // adds the text to the node
  node
    .append('text')
    .attr('dy', '.35em')
    .attr('x', function(d) {
      return d.children ? -13 : 13;
    })
    .style('text-anchor', function(d) {
      return d.children ? 'end' : 'start';
    })
    .text(function(d) {
      return d.data.name;
    });
}
