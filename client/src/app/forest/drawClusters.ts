import * as d3 from 'd3';
import * as _ from 'lodash';

export const drawArticleCluster = (d: any, articles: any[]) => {
  // what articles are part of this cluster?
  //const dTitle = d.title;
  const clusterArticles = _.filter(articles, { category: d.data.name });

  //if ()
  console.log('drawArticleCluster d: ', d);
  console.log('drawArticleCluster clusterArticles: ', clusterArticles);
};
export const removeArticleCluster = (d: any) => {};
