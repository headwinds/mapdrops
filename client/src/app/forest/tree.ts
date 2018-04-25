import * as d3 from 'd3';
import * as _ from 'lodash';
import { getFlatArticlesData, getFlatLevelsData } from './levels';
import { drawHorizontalTree, drawVerticalTree } from './drawTrees';
import { drawArticleCluster, removeArticleCluster } from './drawClusters';

export default class Tree {
  data: any;
  root: any;
  onNodeClick: Function;
  articles: any[];

  constructor(onNodeClick: Function) {
    this.load();
    this.onNodeClick = onNodeClick;
  }

  load() {
    d3.csv('/assets/albon.csv').then(links => {
      this.drawLevels(links);
      this.articles = getFlatArticlesData(links);
    });
  }

  getArticles(): any[] {
    return this.articles;
  }

  drawLevels(links) {
    const flatData = getFlatLevelsData();
    drawVerticalTree(flatData, this.onNodeClick);
  }

  drawCluster(d: any, articles: any[]) {
    drawArticleCluster(d, articles);
  }

  removeCluster(d) {
    removeArticleCluster(d);
  }
}
