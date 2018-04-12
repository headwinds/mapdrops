import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tcc-gpx',
  templateUrl: './gpx.component.html',
  styleUrls: ['./gpx.component.css']
})
export class GpxComponent implements OnInit {
  public instructions: string = 'day 3 added a component';
  constructor() {}

  ngOnInit() {}
}
