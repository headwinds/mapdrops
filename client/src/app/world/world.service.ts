import { Injectable } from '@angular/core';
import { AppModule } from '../app.module';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from '../chat/shared/services/message-service';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { WorldComponent } from './world.component';

/*
interface ICategoryFlightModel {
  category: string;
  timestamp: number;
  userId: string;
}*/

class CategoryFlightModel {
  category: string;
  timestamp: number;
  userId: string;

  constructor(category: string, timestamp: number, userId: string) {
    this.category = category;
    this.timestamp = timestamp;
    this.userId = userId;
  }
}

@Injectable()
export class WorldService {
  private categoryFlightsCollection: AngularFirestoreCollection<
    CategoryFlightModel
  >;
  public categoryFlights: Observable<CategoryFlightModel[]>;
  private userId: string;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.categoryFlightsCollection = afs.collection<CategoryFlightModel>(
      'categoryFlights'
    );
    this.categoryFlights = this.categoryFlightsCollection.valueChanges();
  }

  getCategoryFlights() {
    return [{ hello: 'world' }];
  }

  getPilotName(): string {
    return this.userId;
  }

  private handleCategoryVisit(d: any): void {
    // update the firestore
    console.log('WorldService handleCategoryVisit: ', d);

    const userId = this.userId;
    const timestamp = Number(new Date());
    const categoryId = d.category;

    const categoryFlight = new CategoryFlightModel(category, timestamp, userId);

    const categoryFlightsRef = this.categoryFlightsCollection.ref;

    categoryFlightsRef
      .doc(d.category)
      .get()
      .then(category => {
        if (category.exists) {
          console.log('Document data:', category.data());

          // does this item exist? if does set it...
          categoryFlightsRef
            .doc(d.category)
            .update({ ...categoryFlight })
            .then(category => {
              console.log('categoryFlight updated');
            });
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
          categoryFlightsRef
            .doc(d.category)
            .set({ ...categoryFlight }, { merge: true })
            .then(category => {
              console.log('Document set');
            });
        }
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
      });

    /*
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
      */
  }

  subscribe(world: WorldComponent): void {
    this.firebaseAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log('Pilot - user is logged in: ', res.uid);
        this.userId = res.uid;
        world.createWorld(this.userId);
      } else {
        console.log('Pilot - user not logged in');
      }
    });
  }
}
