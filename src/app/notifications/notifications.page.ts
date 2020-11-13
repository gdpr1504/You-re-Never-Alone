import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database'
import {Validators,FormGroup,FormBuilder} from '@angular/forms'
import { UserService } from '../user.service';
import {Router} from '@angular/router'
import { DatePipe } from '@angular/common'
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  providers: [DatePipe]
})
export class NotificationsPage implements OnInit {
  items=[];
  constructor(public navCtrl: NavController,public datepipe: DatePipe,public afdb:AngularFireDatabase,private fb:FormBuilder, public router:Router,public user:UserService) {  this.getnotifications() }
  latitude="";
  longitude="";
  date;
  image;
  ngOnInit() {
  }
  getnotifications(){
    this.date=new Date();
    let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.afdb.list('notifications/').valueChanges().subscribe(
      data=>{

        for(var i=0;i<data.length;i++){
          if(data[i]['name']!=this.user.getData() && data[i]['date']==latest_date){
            this.items.push(data[i])
          }
        }
  })
  this.afdb.list('images/').valueChanges().subscribe(
    data=>{
      for(var i=0;i<data.length;i++){
        for(var j=0;j<this.items.length;j++){
          if(data[i]['name']==this.items[j]['name'] && data[i]['date']==this.items[j]['date']){
              this.image=data[i]['pic']
  
          }
        }
      }
    }
  )
}
navigate(latitude,longitude){
      this.user.setlat(latitude)
      this.user.setlong(longitude)
      window.open('https://www.google.com/maps/dir/?api=1&destination='+latitude+','+longitude)
      //this.router.navigate(['users'])
}
disimage(image){
    console.log(image)
        let navigationExtras: NavigationExtras = {
         queryParams: {
           image: image,
        }
    };
    this.navCtrl.navigateForward(['users'],navigationExtras);
}
}