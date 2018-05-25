// Move d to be adjacent to the cluster node.
// from: https://bl.ocks.org/mbostock/7881887
/*
class Force {

  private _: any;

  cosntructor(alpha:any) {
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

   initialize(_:any){
    nodesCluster = _;
  };

  strength(_:any) : Force {
    this.strength = _ == null ? this.strength : _;
    return this;
  };
}
*/

/*
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
*/
