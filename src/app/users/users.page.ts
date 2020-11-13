import { Geolocation } from '@ionic-native/geolocation/ngx'
import { getCurrencySymbol, getLocaleDateFormat } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ElementRef} from '@angular/core'
import {AngularFireDatabase} from '@angular/fire/database'
import {Validators,FormGroup,FormBuilder} from '@angular/forms'
import { RouteConfigLoadStart } from '@angular/router';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
declare var google:any;
interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage{
  Image;
  constructor(private geo:Geolocation,public afdb:AngularFireDatabase,private fb:FormBuilder,public user:UserService,private route: ActivatedRoute) { 
   this.getdataimage()
  }
  getdataimage(){
  this.route.queryParams.subscribe(params => {
    this.Image = params["image"];
    console.log(this.Image)
  })
}
}
