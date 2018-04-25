import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';
import Tree from './tree';
import * as _ from 'lodash';
//import { AuthService } from '../chat/shared/services/auth.service';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface Article {
  name: string;
  complexity: number;
  link: string;
  rating: number;
  visits: number;
  tags: string;
  timesUsed: string;
}

export interface Message {
  show: boolean;
  message: string;
  top: number;
  left: number;
}

@Component({
  selector: 'tcc-forest',
  templateUrl: './forest.component.html',
  styleUrls: ['./forest.component.css']
})
export class ForestComponent implements OnInit {
  instructions: string = 'day 5: added forest of links to firestore';
  private articleDoc: AngularFirestoreDocument<Article>;
  private articlesCollection: AngularFirestoreCollection<Article>;
  articles: Observable<Article[]>;
  article: Observable<Article>;
  radius: number;
  forestStyle: any;
  tree: Tree;
  warning: Message = {
    show: false,
    message: '',
    top: 0,
    left: 0
  };

  constructor(private afs: AngularFirestore) {
    this.articleDoc = afs.doc<Article>('articles/1');
    this.article = this.articleDoc.valueChanges();
    this.articlesCollection = afs.collection<Article>('articles');
    this.articles = this.articlesCollection.valueChanges();
    this.radius = 20;
    this.forestStyle = { 'pointer-events': 'all' };

    this.onNodeClick = this.onNodeClick.bind(this);
  }

  ngOnInit() {
    console.log('ForestComponent ngOnInit');
  }

  ngAfterContentInit() {
    console.log('ForestComponent ngAfterContentInit');

    this.tree = new Tree(this.onNodeClick);
  }

  private onNodeClick(d: any): void {
    console.log('ForestComponent onNodeClick d: ', d);
    console.log('ForestComponent onNodeClick this: ', this);
    console.log('ForestComponent onNodeClick this.tree: ', this.tree);

    if (d.data.name === 'Articles') {
      this.warning.show = true;
      this.warning.message =
        'This is the start of your adventure. Venture north to explore other nodes';
    }

    // does it already have a cluster?
    if (d.cluster && d.cluster.length > 0) {
      this.tree.removeCluster(d);
    } else {
      // first cluster
      const articles = this.tree.getArticles();
      this.tree.drawCluster(d, articles);
    }
  }

  public getProfile(): void {
    // talk to server
    //this.authService.signinWithGoogle();
    /*
    this.dialogRef.close({
      username: this.params.username,
      dialogType: this.params.dialogType,
      previousUsername: this.previousUsername
    });*/
  }

  private draw(data): void {}

  handleWarningClose(event: any) {
    this.warning.show = false;
  }

  clickedSvg(event: any) {
    console.log('svg click');

    d3
      .select(event.target)
      .append('circle')
      .attr('cx', event.x)
      .attr('cy', event.y)
      .attr('r', this.radius)
      .attr('fill', 'pink');
  }

  update(article: Article) {
    this.articleDoc.update(article);
  }
  addItem(article: Article) {
    this.articlesCollection.add(article);
  }
}