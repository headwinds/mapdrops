import { Component, OnInit } from '@angular/core';
import { drawWorld } from './drawWorld';
import { drawPilots, flyTo } from '../pilot/drawPilot';
import { AngularFireAuth } from 'angularfire2/auth';
import { WorldService } from './world.service';
//import { WorldController } from './controllers/WorldController';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
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
  private worldService: WorldService;

  constructor(private worldService: WorldService) {
    //this.controller = new WorldController(afs);
    //this.subscribe();
    this.worldService = worldService;

    const flights = this.worldService.getCategoryFlights();
    this.worldService.subscribe(this);

    this.handleSurfaceClick = this.handleSurfaceClick.bind(this);
  }

  ngOnInit() {
    this.world = drawWorld(this.handleSurfaceClick);
  }

  createWorld(pilotName: string) {
    this.pilots = drawPilots(this.world, pilotName);
  }

  handleSurfaceClick(coords: any) {
    //console.log('drawWorld - handleSurfaceClick - coords: ', coords);
    const pilotName = this.worldService.getPilotName();
    flyTo(coords, pilotName);
  }
}
