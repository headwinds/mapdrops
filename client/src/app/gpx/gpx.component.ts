import { Component, OnInit } from '@angular/core';
//import { AuthService } from '../chat/shared/services/auth.service';

@Component({
  selector: 'tcc-gpx',
  templateUrl: './gpx.component.html',
  styleUrls: ['./gpx.component.css']
})
export class GpxComponent implements OnInit {
  public instructions: string = 'day 4: added social logins, mapbox and firestore';
  constructor() {}

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
