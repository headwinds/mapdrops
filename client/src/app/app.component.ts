import { Component, OnInit } from '@angular/core';
//import { Broadcaster } from './shared/Broadcaster';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from './chat/shared/services/message-service';

@Component({
  selector: 'tcc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  appForestStyle: any;
  title: string;
  username: string;
  subscription: Subscription;
  constructor(private messageService: MessageService) {
    this.appForestStyle = { 'pointer-events': 'none' };
    this.title = 'level up';
    this.username = 'not signed in';

    //this.subscribe = this.subscribe.bind(this);

    this.subscribe();
  }

  ngOnInit(): void {}

  private initModel(): void {}

  private subscribe(): void {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      //this.message = message;
      if (message.key === 'userSignin') {
        this.username = message.data.name;
        console.log('app heard data: ', message);
      }
    });
  }
}
