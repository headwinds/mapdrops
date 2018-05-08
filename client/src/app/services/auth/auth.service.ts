import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../chat/shared/services/message-service';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  userId: string;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private messageService: MessageService
  ) {
    this.user = firebaseAuth.authState;

    this.subscribe();
  }

  signup(email: string, password: string) {
    this.firebaseAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('auth.service - signup Success!', value);
      })
      .catch(err => {
        console.log('auth.service - signup Fail:', err.message);
      });
  }

  login(email: string, password: string) {
    this.firebaseAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('auth.service - signInWithEmailAndPassword', value);
        this.messageService.sendMessage('userSignin', value);
      })
      .catch(err => {
        console.log(
          'auth.service - signInWithEmailAndPassword - error: ',
          err.message
        );
      });
  }

  logout() {
    this.firebaseAuth.auth.signOut();
  }

  private subscribe(): void {
    this.firebaseAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log('auth.service - user is logged in: ', res.uid);
        this.userId = res.uid;
      } else {
        console.log('auth.service - user not logged in');
      }
    });
  }
}
