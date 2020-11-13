import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import {AngularFireDatabase} from '@angular/fire/database'
import { UserService } from '../user.service';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http'
import * as Twilio from 'twilio';
import { AlertController } from '@ionic/angular';
import { from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Validators,FormGroup,FormBuilder} from '@angular/forms'
import {google,geocoder} from '@google/maps'
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { DatePipe } from '@angular/common'
import { PhotoService } from '../services/photo.service';
import {Camera,CameraOptions} from '@ionic-native/camera/ngx'
import {LoadingController} from "@ionic/angular"
import { type } from 'os';
declare var google:any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  providers: [DatePipe,Camera]
})
export class MenuPage implements OnInit {
  lat;
  lng;
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
};  
  public text="hi";
  public from="+13853372883";
  public to: "+918919219363";
  address:string="";
  date;
  time;
  img;
  myimage;
  constructor(private loader:LoadingController,private camera:Camera,public photoService: PhotoService,public datepipe: DatePipe,private nativeGeocoder: NativeGeocoder,public afdb:AngularFireDatabase,private geo:Geolocation,public user:UserService,private http: HttpClient,private alert: AlertController) { }

  ngOnInit() {
  }

  captureAndSave(){
    let options:CameraOptions={
      destinationType:this.camera.DestinationType.DATA_URL,encodingType:this.camera.EncodingType.PNG,
      mediaType:this.camera.MediaType.PICTURE,
      quality:100
    }
    this.date=new Date();
    this.time=new Date();
    let latest_time=this.datepipe.transform(this.date,'h:mm:ss a')
    let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.camera.getPicture(options).then((base64String)=>{
      this.afdb.object('images/'+this.user.getUID()).set({
        pic:"data:image/png;base64,"+base64String,
        date:latest_date,
        time:latest_time,
        name:this.user.getData()
      })
      this.Location('none')

    },(err)=>{
      alert(JSON.stringify(err));
    })
    
  }

  Location(type){
  
 
    this.geo.getCurrentPosition({
      timeout:10000,
      enableHighAccuracy:true
    }).then((res)=>{
    this.lat=res.coords.latitude.toString();
    this.lng=res.coords.longitude.toString();
    console.log(this.user.getUID());
    this.afdb.object('users/'+this.user.getUID()).update({
      latitude:this.lat,
      longitude:this.lng
    })


    var phonenumber=[]          
    var distlist=[]
    this.afdb.list('users/').valueChanges().subscribe(
      data=>{
        console.log(data)
        for(var i=0;i<data.length;i++){
          if(data[i]['name']==this.user.getData()){
            var usernumber=data[i]['phonenumber']
            this.img=data[i]['image']
          }
        }

        for(var i=0;i<data.length;i++)
        {

        if(data[i]['name']!=this.user.getData()){
            console.log(data[i]['name']);
            var dist=this.getDistanceFromLatLonInKm(parseFloat(this.lat),parseFloat(this.lng),parseFloat(data[i]['latitude']),parseFloat(data[i]['longitude']));

            phonenumber.push('+91'+data[i]['phonenumber'])
            distlist.push(dist)
            console.log(dist)

            if(dist>-1){

              var lat= parseFloat(this.lat)
              var lng= parseFloat(this.lng)
              var parts;
              var url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+','+lng+"&key=AIzaSyArbAIIe2DNFzV8bWdqno7S-9UcZmMlkos"
              fetch(url)
              .then(response=>response.json())
              .then(data1=>{

                parts=data1.results[0]['formatted_address'];
                this.date=new Date();
                this.time=new Date();
                let latest_time=this.datepipe.transform(this.date,'h:mm:ss a')
                let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');

                this.afdb.object('notifications/'+this.user.getUID()).set({
                  name:this.user.getData(),
                  phonenumber:usernumber,
                  address:parts,
                  latitude:lat,
                  longitude:lng,
                  date:latest_date,
                  time:latest_time,
                  image:this.img,
                  type:type
              })

                this.Location2(phonenumber,parts,distlist,usernumber,type)
              });
             
            }
            }
          }
        
      }
    )
  }).catch((error)=>{
    console.log(error);
  });

  }
  Location2(mobileNo,parts,distlist,usernumber,type){
var msg91 = require("msg91")("329244A8vbQKDC5f11624bP1", "GPSBUS", "4");
for(var i=0;i<mobileNo.length;i++){
  console.log(mobileNo[i])
  var Message='Message from You are never alone Member\n'+'HELP REQUIRED AT LOCATION:\n'+'Details:\nName:'+this.user.getData()+',\nPhone Number:'+usernumber+',\nAddress: '+ parts+',\nDIstance:'+distlist[i]+' km away from you,'+'\nType:'+type;
  msg91.send(mobileNo[i],Message, function (err, response) {


  });
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
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

}
