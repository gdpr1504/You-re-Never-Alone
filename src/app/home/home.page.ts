import { Component,OnInit,Output,EventEmitter } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { UserService } from '../user.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router'
import {AngularFireDatabase} from '@angular/fire/database'
import { getLocaleDateFormat } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @Output() parentFunction:EventEmitter<any>= new EventEmitter()
  lat;
  lng;
  constructor(public afdb:AngularFireDatabase,private geo:Geolocation,public user:UserService,public navCtrl: NavController,private route: ActivatedRoute,public router:Router) {
  }

  ngOnInit(){
     
   
    }
    Location(){
      this.geo.getCurrentPosition({
        timeout:10000,
        enableHighAccuracy:true
      }).then((res)=>{
      this.lat=res.coords.latitude.toString();
      this.lng=res.coords.longitude.toString();
    }).catch((error)=>{
      console.log(error);
    });
    }
}
