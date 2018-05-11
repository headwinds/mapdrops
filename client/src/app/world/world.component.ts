import { Component, OnInit } from '@angular/core';
import { drawWorld } from './drawWorld';

@Component({
  selector: 'tcc-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    drawWorld();
  }
}
