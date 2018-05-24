import { Component, OnInit } from '@angular/core';
import { drawWorld } from './drawWorld';
import { drawPilot, drawPilots } from '../pilot/drawPilot';
import { AngularFireAuth } from 'angularfire2/auth';
import * as d3 from 'd3';

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements OnInit {
  public world: any;
  public pilot: any;
  public pilots: any;
  public pilotName: string;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.subscribe();
  }

  ngOnInit() {
    this.world = drawWorld();
  }

  private createWorld() {
    this.pilots = drawPilots(this.world);
  }

  private subscribe(): void {
    this.firebaseAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log('Pilot - user is logged in: ', res.uid);
        //this.userId = res.uid;
        this.pilotName = res.uid;
        this.createWorld();
      } else {
        console.log('Pilot - user not logged in');
      }
    });
  }
}
