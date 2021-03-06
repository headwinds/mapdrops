import * as d3 from 'd3';

export function drawWorld(handleSurfaceClick) {
  const margin = { top: 40, right: 120, bottom: 20, left: 120 };

  const width = window.innerWidth - margin.right - margin.left;
  const height = window.innerHeight - margin.top - margin.bottom;

  //let nodes = getNodes(flatData, width, height, margin);

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = d3
    .select('#universe')
    .append('svg')
    .attr('id', 'space')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const world = svg
    .append('g')
    .attr('id', 'world')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const surfaceGroup = world.append('g').attr('id', 'surface');

  const surface = surfaceGroup
    .append('rect')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight);

  surface
    .on('click', function() {
      const coords = d3.mouse(this);
      handleSurfaceClick(coords);
    })
    .style('fill', 'transparent');

  return world;
}
