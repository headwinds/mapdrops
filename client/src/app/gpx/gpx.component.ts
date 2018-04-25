import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'tcc-gpx',
  templateUrl: './gpx.component.html',
  styleUrls: ['./gpx.component.css']
})
export class GpxComponent implements OnInit {
  instructions: string = 'day 5: added forest of links to firestore';
  private articleDoc: AngularFirestoreDocument<Article>;
  private articlesCollection: AngularFirestoreCollection<Article>;
  articles: Observable<Article[]>;
  article: Observable<Article>;

  constructor(private afs: AngularFirestore) {
    this.articleDoc = afs.doc<Article>('articles/1');
    this.article = this.articleDoc.valueChanges();
    this.articlesCollection = afs.collection<Article>('articles');
    this.articles = this.articlesCollection.valueChanges();
  }
  update(article: Article) {
    this.articleDoc.update(article);
  }
  addItem(article: Article) {
    this.articlesCollection.add(article);
  }

  ngOnInit() {}
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
}
