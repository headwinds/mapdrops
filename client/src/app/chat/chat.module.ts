import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '../shared/material/material.module';
import { ChatComponent } from './chat.component';
import { SocketService } from './shared/services/socket.service';
import { environment } from '../../environments/environment';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angular5-social-login';

// Configs
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig([
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('824907610982622')
    },
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        '347820260770-3h2jms65i96gur0s5nevtgl4h9gch1of.apps.googleusercontent.com'
      )
    }
  ]);
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpModule
  ],
  declarations: [ChatComponent, DialogUserComponent],
  providers: [
    SocketService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  entryComponents: [DialogUserComponent]
})
export class ChatModule {}
