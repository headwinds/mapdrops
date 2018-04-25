import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
//import { Broadcaster } from '../../shared/Broadcaster';
import { MessageService } from '../shared/services/message-service';
import axios from 'axios';

import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular5-social-login';

@Component({
  selector: 'tcc-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent implements OnInit {
  usernameFormControl = new FormControl('', [Validators.required]);
  previousUsername: string;
  name: string;
  showGoogleBtn: boolean;

  constructor(
    private socialAuthService: AuthService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<DialogUserComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any
  ) {
    this.previousUsername = params.username ? params.username : undefined;
    this.showGoogleBtn = true;
    this.name = '';

    //this.broadcaster = broadcaster;
    // skip signin
    this.onSave();
    window.location.href = '/forest';
  }

  ngOnInit() {}

  public siginWithGoogle(): void {
    // https://firebase.google.com/docs/auth/web/google-signin
    axios.get('http://localhost:4200/auth/google').then(
      response => {
        console.log('google response: ', response);
      },
      error => {}
    );
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
      console.log(socialPlatform + ' sign in data : ', userData);
      // Now sign-in with userData
      this.name = userData.name;
      this.params.username = userData.name;

      this.showGoogleBtn = false;

      //this.broadcaster.broadcast$('userSignin', userData); //Broadcast
      this.messageService.sendMessage('userSignin', userData);

      setTimeout(() => {
        this.onSave();
      }, 2000);
    });
  }

  public wat(): void {
    console.log('wat response: ');
  }

  public onSave(): void {
    this.dialogRef.close({
      username: this.params.username,
      dialogType: this.params.dialogType,
      previousUsername: this.previousUsername
    });
  }
}
