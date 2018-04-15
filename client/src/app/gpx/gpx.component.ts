import { Component, OnInit } from '@angular/core';
//import { AuthService } from '../chat/shared/services/auth.service';
import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'tcc-gpx',
  templateUrl: './gpx.component.html',
  styleUrls: ['./gpx.component.css']
})
export class GpxComponent implements OnInit {
  instructions: string = 'day 4: added social logins, mapbox and firestore';
  private itemDoc: AngularFirestoreDocument<Item>;
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<any[]>;
  constructor(private afs: AngularFirestore) {
    this.itemDoc = afs.doc<Item>('items/1');
    this.item = this.itemDoc.valueChanges();
    this.itemsCollection = afs.collection<Item>('items');
    this.items = this.itemsCollection.valueChanges();
  }
  update(item: Item) {
    this.itemDoc.update(item);
  }
  addItem(item: Item) {
    this.itemsCollection.add(item);
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
