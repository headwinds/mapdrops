import * as d3 from 'd3';
import * as _ from 'lodash';

export const drawArticleCluster = (
  d: any,
  articles: any[],
  handleArticleClick: Function
) => {
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

  const visitedColor = '#26757b';
  const newColor = '#74e2dd';

  //const color = d3.scaleSequential(d3.interpolateRainbow).domain(d3.range(m));
  const color = () => {
    return newColor;
  };

  // The largest node for each cluster.
  const clusters = new Array(m);

  const getNodes = () => {
    const dist = 100;

    return d3.range(n).map(mapIndex => {
      //console.log('what: ', mapIndex);
      // should be based on activity but for now let's make them all the same size
      const nodeRadius = maxRadius;

      let i = Math.floor(Math.random() * m),
        r = maxRadius,
        d = {
          cluster: i,
          radius: r,
          x: Math.cos(i / m * 2 * Math.PI) * dist + Math.random(),
          y: Math.sin(i / m * 2 * Math.PI) * dist + Math.random(),
          ...articles[mapIndex],
          articleIndex: mapIndex
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
    let nodesCluster,
      strength = 0.1;

    const force = alpha => {
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
    };

    force['initialize'] = function(_) {
      nodesCluster = _;
    };

    force['strength'] = _ => {
      strength = _ == null ? strength : _;
      return force;
    };

    return force;
  };

  function drawNodes(nodes, targetCenter, handleArticleClick) {
    console.log('drawCluster - drawNodes ', arguments);

    const getNodeColor = d => {
      const nodeColor = 'red';
      return nodeColor;
    };

    const node = svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('g')
      .on('click', handleArticleClick)
      .append('circle')
      .style('fill', getNodeColor);
    /*
      .append('circle')
      .style('fill', function(d) {
        return color(d.cluster / 10);
      });
      */
    /*
    const cirlce = node.append('circle').style('fill', function(d) {
      return color(d.cluster / 10);
    });
    */

    /*
    const node = svg
      .selectAll('.article')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', function(d) {
        return 'node' + (d.visits && d.visits > 0 ? '-touched' : 'not-touched');
      })
      .on('click', handleArticleClick);

    // adds the circle to the node
    const cirlce = node.append('circle').style('fill', function(d) {
      return color(d.cluster / 10);
    });
    */
    //styleElement(cirlce, circleStyle);

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
    //const validStrength = cluster();
    //if (validStrength.hasOwnProperty('strength')) {
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
    //}
  }

  const draw = (nodes, target, handleArticleClick) => {
    console.log('drawClusters draw: ', d);

    drawNodes(nodes, target, handleArticleClick);
  };

  draw(nodes, d, handleArticleClick);
};
export const removeArticleCluster = (d: any) => {
  const removeAll = () => {
    // need to select the cluster!
    const node = d3
      .select('svg')
      .selectAll('.article')
      .remove();
  };

  removeAll();
};
