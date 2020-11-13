import { getCurrencySymbol } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation/ngx'
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
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  map=null;
  items;
  markers=[];
  idu:string;
  infoWindows:any=[];
  lat;
  lng;
  constructor(public afdb:AngularFireDatabase,private geo:Geolocation,private fb:FormBuilder,public user:UserService,private route: ActivatedRoute) { 
    this.getDataFromFirebase();
  }
  getDataFromFirebase(){
  this.geo.getCurrentPosition({
    timeout:10000,
    enableHighAccuracy:true
  }).then((res)=>{
  this.lat=res.coords.latitude.toString();
  this.lng=res.coords.longitude.toString();
  })
    this.afdb.list('users/').valueChanges().subscribe(
      data=>{
        console.log(data)
        console.log(this.markers)
        this.items=data
        console.log(this.lat)
        for(var i=0;i<data.length;i++){
          let dist=this.getDistanceFromLatLonInKm(parseFloat(this.lat),parseFloat(this.lng),parseFloat(data[i]['latitude']),parseFloat(data[i]['longitude']))
            const marker={
              position:{
                lat:parseFloat(data[i]['latitude']),
                lng:parseFloat(data[i]['longitude']),

              },
              title:data[i]['name']+" \n"+dist.toString()+"km Away from you"
            }
           this.addMarker(marker)
           this.markers.push(marker)
            }
          }
          )
  }
  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = {lat: 17.6816803,lng:83.1970406};
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
    this.map.setTilt(45)
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');

    });
  }
  ngOnInit() {
    
    this.loadMap();
  }
  addMarker(marker: Marker) {
    let mapMarker= new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title,

    });
    mapMarker.setMap(this.map)
    this.addInfoWindowToMarker(mapMarker)
  }
  addInfoWindowToMarker(marker){
    let infoWindowContent='<div id="content">'+
                          '<h4 style="color:blue;text-align:center">'+marker.title+'</h4>'+'</div>'
  let infoWindow=new google.maps.InfoWindow({
    content:infoWindowContent
  });
  marker.addListener('click',()=>{
    this.closeAllInfoWindows();
    infoWindow.open(this.map,marker);
  });
  this.infoWindows.push(infoWindow);
}
  closeAllInfoWindows(){
    for(let window of this.infoWindows){
      window.close();
    }
  }
                    

getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
  var dLon = this.deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  console.log(d)
  return d;
}

deg2rad(deg) {
  return deg * (Math.PI/180)
}
}
