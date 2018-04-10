import { Component } from '@angular/core';
import axios from 'axios';

//const toGeoJSON = require('../assets/togeojson');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mapdrops';
  answer: string = '';
  answerDisplay: string = '';
  showSpinner: boolean = false;

  constructor() {
    this.drawMap();
  }

  showAnswer() {
    this.showSpinner = true;

    setTimeout(() => {
      this.answerDisplay = this.answer;
      this.showSpinner = false;
    }, 2000);
  }

  drawMap() {
    const gpx = './assets/data/springwarmup/Spring_warm_up.gpx';
    const json = './assets/data/springwarmup/spring_warm_up.json';
    axios.get(json).then(res => {
      //const geoJSON = window.toGeoJSON.gpx(xml);
      console.log(res);
    });

    //const tj = require('togeojson');
    /*
        fs = require('fs'),
        // node doesn't have xml parsing or a dom. use xmldom
        DOMParser = require('xmldom').DOMParser;

    var kml = new DOMParser().parseFromString(fs.readFileSync('foo.kml', 'utf8'));

    var converted = tj.kml(kml);

    var convertedWithStyles = tj.kml(kml, { styles: true });
    */

    /*
    map.addSource('some id', {
      type: 'geojson',
      data: 'https://mydomain.mydata.geojson'
    });
    */
  }
}
