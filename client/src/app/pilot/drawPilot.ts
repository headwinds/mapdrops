import * as d3 from 'd3';

export function drawPilots(world, pilotName) {
  const data = [{ pilotName }];
  console.log('drawPilot ', world);

  const pilots = world.append('g').attr('id', 'pilots');

  const pilotContainer = pilots
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('id', pilotName)
    .attr('transform', 'translate(200,200)');

  pilotContainer
    .append('circle')
    .style('fill', 'white')
    .attr('cx', 10)
    .attr('cy', -20)
    .attr('r', 20);

  pilotContainer
    .append('rect')
    .style('fill', 'white')
    .attr('width', 20)
    .attr('height', 20);

  pilotContainer
    .append('rect')
    .style('fill', 'white')
    .attr('x', 7)
    .attr('y', 20)
    .attr('width', 5)
    .attr('height', 5);

  return pilotContainer;
}
