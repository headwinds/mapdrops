import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
import { SharedModule } from './shared/shared.module';
import { GpxComponent } from './gpx/gpx.component';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angular5-social-login';
import { TwitterLoginProvider } from './chat/twitter-login-provider';
//import { MapBoxComponent } from './map-box/map-box.component';
import { MapService } from './map.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { ForestComponent } from './forest/forest.component';
import { MessageService } from './chat/shared/services/message-service';
import { SigninComponent } from './signin/signin.component';
import { AuthService } from './services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { WorldComponent } from './world/world.component';
import { WorldService } from './world/world.service';
import { PilotComponent } from './pilot/pilot.component';

export const firebaseConfig = environment.firebaseConfig;

// Configs
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig([
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(environment.facebook.clientID)
    },
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.google.clientID)
    },
    {
      id: TwitterLoginProvider.PROVIDER_ID,
      provider: new TwitterLoginProvider(environment.twitter.clientID)
    }
  ]);
  return config;
}

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'auth/google', component: AppComponent },
  { path: 'hello', component: AppComponent },
  { path: 'world', component: WorldComponent },
  { path: 'forest', component: WorldComponent }
  //{ path: 'map', component: MapBoxComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GpxComponent,
    ForestComponent,
    SigninComponent,
    WorldComponent,
    PilotComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { enableTracing: true }),
    AppRoutingModule,
    ChatModule,
    SharedModule,
    SocialLoginModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    MapService,
    AngularFirestore,
    AngularFireAuth,
    AuthService,
    MessageService,
    WorldService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
