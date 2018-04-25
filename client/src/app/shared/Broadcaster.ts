import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";

export class Broadcaster {
  private _event: Subject<BroadcastEvent>;

  constructor() {
    this._event = new Subject<BroadcastEvent>();
  }

  broadcast$(key: any, data?: any) {
    this._event.next({key, data});
  }

  on$<T>(key: any): Observable<T> {
    return this._event.asObservable()
      .filter(event => event.key === key)
      .map(event => <T>event.data);
  }
}

export interface BroadcastEvent {
  key: any;
  data?: any;
}
