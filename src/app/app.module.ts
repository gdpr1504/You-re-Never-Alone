import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import firebaseConfig from './firebase'
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth'
import {HttpClientModule} from '@angular/common/http'
import { UserService } from './user.service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import {AngularFireFunctionsModule  } from '@angular/fire/functions'
import {AngularFireDatabaseModule} from '@angular/fire/database'
import { ReactiveFormsModule } from '@angular/forms';
import { HomePageModule } from './home/home.module';
import {Camera} from '@ionic-native/camera/ngx'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HomePageModule,
  AngularFireModule.initializeApp(firebaseConfig),
AngularFireAuthModule,HttpClientModule,AngularFirestoreModule,ReactiveFormsModule,AngularFireDatabaseModule,AngularFireFunctionsModule],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ,UserService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule {}                                       
