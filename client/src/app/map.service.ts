import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';

@Injectable()
export class MapService {
  constructor(private db: AngularFirestore) {
    //mapboxgl.accessToken = environment.mapbox.accessToken;
  }
  /*
  getMarkers(): FirebaseListObservable<any> {
    return this.db.list('/markers');
  }

  createMarker(data: GeoJson) {
    return this.db.list('/markers').push(data);
  }

  removeMarker($key: string) {
    return this.db.object('/markers/' + $key).remove();
  }
  */
}
