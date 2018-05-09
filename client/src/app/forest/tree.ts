import * as d3 from 'd3';
import * as _ from 'lodash';
import { getFlatArticlesData, getFlatLevelsData } from './levels';
import { drawHorizontalTree, drawVerticalTree } from './drawTrees';
import { drawArticleCluster, removeArticleCluster } from './drawClusters';

export default class Tree {
  data: any;
  root: any;
  handleNodeClick: Function;
  articles: any[];

  constructor(handleNodeClick: Function) {
    this.load();
    this.handleNodeClick = handleNodeClick;
  }

  load() {
    d3.csv('/assets/albon.csv').then(links => {
      this.drawLevels(links);
      this.articles = getFlatArticlesData(links);
    });
  }

  public getArticlesByCategory(category): any[] {
    return _.filter(this.articles, { category });
  }

  public getArticles(): any[] {
    return this.articles;
  }

  public drawLevels(links) {
    const flatData = getFlatLevelsData();
    drawVerticalTree(flatData, this.handleNodeClick);
  }

  public drawCluster(d: any, articles: any[], handleArticleClick: Function) {
    drawArticleCluster(d, articles, handleArticleClick);
  }

  public removeCluster(d) {
    removeArticleCluster(d);
  }
}
