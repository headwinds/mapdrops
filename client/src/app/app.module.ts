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
import { MapBoxComponent } from './map-box/map-box.component';
import { MapService } from './map.service';
import { AngularFirestore } from 'angularfire2/firestore';

import { environment } from '../environments/environment';
export const firebaseConfig = environment.firebaseConfig;

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

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
    }
  ]);
  return config;
}

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'auth/google', component: AppComponent },
  { path: 'hello', component: AppComponent }
];

@NgModule({
  declarations: [AppComponent, GpxComponent, MapBoxComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    ChatModule,
    SharedModule,
    SocialLoginModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    MapService,
    AngularFirestore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
