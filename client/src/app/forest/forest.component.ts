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

export interface IArticle {
  userId: string;
  name: string;
  complexity: number;
  link: string;
  rating: number;
  visits: number;
  tags: string;
  haveUsed: boolean;
  timestamp: number;
}

export class Article {
  constructor(
    public userId: string,
    public name: string,
    public complexity: number,
    public link: string,
    public rating: number,
    public visits: number,
    public tags: string,
    public haveUsed: boolean,
    public timestamp: number
  ) {}
}

export class ArticleEvent {
  constructor(
    public userId: string,
    public name: string,
    public timestamp: number
  ) {}
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
  //private articleDoc: AngularFirestoreDocument<Article>;
  private myArticlesCollection: AngularFirestoreCollection<Article>;
  private articleEventsCollection: AngularFirestoreCollection<ArticleEvent>;
  communityArticles: Observable<Article[]>; // everyones
  myArticles: Observable<Article[]>; // mine
  articleEvents: Observable<ArticleEvent[]>;
  //article: Observable<Article>;
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
    //this.articleDoc = afs.doc<Article>('articles/1');
    //this.article = this.articleDoc.valueChanges();

    this.myArticlesCollection = afs.collection<Article>('articles');
    this.articleEventsCollection = afs.collection<ArticleEvent>(
      'article-events'
    );

    this.articles = this.myArticlesCollection.valueChanges();
    this.radius = 20;
    this.forestStyle = { 'pointer-events': 'all' };

    this.articleEvents = this.articleEventsCollection.valueChanges();

    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleArticleClick = this.handleArticleClick.bind(this);
  }

  ngOnInit() {
    console.log('ForestComponent ngOnInit');
  }

  ngAfterContentInit() {
    console.log('ForestComponent ngAfterContentInit');

    this.tree = new Tree(this.handleNodeClick);
  }

  private handleNodeClick(d: any): void {
    console.log('ForestComponent handleNodeClick d: ', d);
    console.log('ForestComponent handleNodeClick this: ', this);
    console.log('ForestComponent handleNodeClick this.tree: ', this.tree);

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
      this.tree.drawCluster(d, articles, this.handleArticleClick);
    }
  }

  private handleArticleClick(d: any): void {
    // update the firestore
    console.log('ForestComponent handleArticleClick: ', d);

    const userId = 'N2YlFyyqf0N2ClOaQ9ATAf4jqgi1';
    const timestamp = Number(new Date());

    const userId = 1234;
    const name = d.name;
    const complexity = 5;
    const link = d.link;
    const rating = 5;
    const visits = 1;
    const tags = 'none';
    const haveUsed = true;

    const article = new Article(
      userId,
      name,
      complexity,
      link,
      rating,
      visits,
      tags,
      haveUsed,
      timestamp
    );

    console.log('hey: ', this.myArticlesCollection);

    const artilcesRef = this.myArticlesCollection.ref;

    artilcesRef
      .doc(d.name)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log('Document data:', doc.data());

          // does this item exist? if does set it...
          artilcesRef
            .doc(d.name)
            .update({ ...article })
            .then(doc => {
              console.log('Document updated');
            });
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
          artilcesRef
            .doc(d.name)
            .set({ ...article }, { merge: true })
            .then(doc => {
              console.log('Document set');
            });
        }
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
      });

    // if it doesn't, add it...

    const articleEvent = new ArticleEvent(userId, d.name, timestamp);

    // Add a new document with a generated id.
    const articlesEventsRef = this.articleEventsCollection.ref;

    articlesEventsRef
      .add({ ...articleEvent })
      .then(function(docRef) {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });
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
}
