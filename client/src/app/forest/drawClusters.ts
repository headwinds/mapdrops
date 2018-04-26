import * as d3 from 'd3';
import * as _ from 'lodash';

export const drawArticleCluster = (d: any, articles: any[]) => {
  // what articles are part of this cluster?
  //const dTitle = d.title;
  const clusterArticles = _.filter(articles, { category: d.data.name });

  //if ()
  console.log('drawArticleCluster d: ', d);
  console.log('drawArticleCluster clusterArticles: ', clusterArticles);

  let width = window.innerWidth,
    height = window.innerHeight,
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 12;

  const n = articles.length, // total number of nodes
    m = 2; // number of distinct clusters

  const color = d3.scaleSequential(d3.interpolateRainbow).domain(d3.range(m));

  // The largest node for each cluster.
  const clusters = new Array(m);

  const getNodes = () => {
    const dist = 100;

    return d3.range(n).map(function() {
      let i = Math.floor(Math.random() * m),
        r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
        d = {
          cluster: i,
          radius: r,
          x: Math.cos(i / m * 2 * Math.PI) * dist + Math.random(),
          y: Math.sin(i / m * 2 * Math.PI) * dist + Math.random()
        };
      if (!clusters[i] || r > clusters[i].radius) clusters[i] = d;
      return d;
    });
  };

  let nodes = getNodes();

  /*
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
    */
  const svg = d3.select('svg');

  // Move d to be adjacent to the cluster node.
  // from: https://bl.ocks.org/mbostock/7881887
  const cluster = () => {
    var nodes,
      strength = 0.1;

    function force(alpha) {
      // scale + curve alpha value
      alpha *= strength * alpha;

      nodes.forEach(function(d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;

        let x = d.x - cluster.x,
          y = d.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + cluster.radius;

        if (l != r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      });
    }

    force.initialize = function(_) {
      nodes = _;
    };

    force.strength = _ => {
      strength = _ == null ? strength : _;
      return force;
    };

    return force;
  };

  function drawNodes(targetCenter) {
    const node = svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .style('fill', function(d) {
        return color(d.cluster / 10);
      });

    const layoutTick = e => {
      node
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        })
        .attr('r', function(d) {
          return d.radius;
        });
    };

    const force = d3
      .forceSimulation()
      // keep entire simulation balanced around screen center
      .force('center', d3.forceCenter(targetCenter.x, targetCenter.y))

      // cluster by section
      .force('cluster', cluster().strength(0.2))

      // apply collision with padding
      .force('collide', d3.forceCollide(d => d.radius + padding).strength(0.7))

      .on('tick', layoutTick)
      .nodes(nodes);
  }

  const targets = [{ x: 120, y: 200 }, { x: 350, y: 300 }, { x: 600, y: 100 }];

  const drawTargets = () => {
    svg
      .selectAll('rect')
      .data(targets)
      .enter()
      .append('rect')
      .attr('width', 5)
      .attr('height', 5)
      .attr('x', function(d) {
        return d.x;
      })
      .attr('y', function(d) {
        return d.y;
      })
      .style('fill', 'red');
  };

  const draw = d => {
    //drawTargets();
    //let count = 0;

    const target = d;
    console.log('target: ', d);
    //removeAll();
    //nodes = getNodes();
    drawNodes(d);
    /*
    const moveTarget = () => {
      removeAll();
      nodes = getNodes();
      drawNodes(targets[count]);
      count++;
      if (count > 2) count = 0;
      //
    };
    setInterval(moveTarget, 1500);
    */
  };

  draw(d);
};
export const removeArticleCluster = (d: any) => {
  const removeAll = () => {
    // need to select the cluster!
    const node = svg.selectAll('circle').remove();
  };

  removeAll();
};
