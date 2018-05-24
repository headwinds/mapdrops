import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.css']
})
export class PilotComponent implements OnInit {
  pilotName: string;
  previousNode: number;
  currentNode: number;
  flightPattern: any;

  constructor(private firebaseAuth: AngularFireAuth) {
    console.log('Pilot constructor');

    this.previousNode = 0;
    this.currentNode = 0;
    this.flightPattern = [this.previousNode, this.currentNode];

    this.subscribe();
  }

  ngOnInit() {}

  private subscribe(): void {
    this.firebaseAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log('Pilot - user is logged in: ', res.uid);
        //this.userId = res.uid;
        this.pilotName = res.uid;
      } else {
        console.log('Pilot - user not logged in');
      }
    });
  }
}
