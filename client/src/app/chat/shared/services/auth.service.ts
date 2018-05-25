import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../model/message';
import { Event } from '../model/event';
import { environment } from '../../../../environments/environment';
import { Http, Response } from '@angular/http';
import axios from 'axios';

//const SERVER_URL = 'http://localhost:8080';
const SERVER_URL = environment.url;

@Injectable()
export class AuthService {
  constructor(private http: Http) {}

  public signinWithGoogle(): void {
    //this.socket = socketIo(SERVER_URL);
    console.log('signing in...');
    const googleUrl: string = 'http://localhost:8080/auth/google';
    axios.get('http://localhost:8080/auth/google').then(
      response => {
        console.log('AuthService success');
      },
      error => {
        console.log('AuthService fail: ', error);
      }
    );
    /*
    this.http.get('http://localhost:8080/auth/google', function(res) {
      console.log('user: ', res.user);
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        console.log('user: ', chunk.user);
      });
    });
    */
  }
}
