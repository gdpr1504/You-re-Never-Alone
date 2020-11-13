import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, database } from 'firebase/app';
import { UserService } from '../user.service';
import {Router} from '@angular/router'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { AlertController } from '@ionic/angular'
import {AngularFireDatabase} from '@angular/fire/database'
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string=""
  password: string=""
  lat="";
  lng="";
  constructor(public navCtrl: NavController,public afdb: AngularFireDatabase,public alert: AlertController,public router:Router,public afAuth: AngularFireAuth,public user:UserService,private geo:Geolocation) { 
  }

  ngOnInit() {
  }
  async login(){
    const {username,password} =this
  try{
       const res = await this.afAuth.signInWithEmailAndPassword(username+'@gdpr.com',password)
       if(res.user){
         this.user.setUser({
           username,
           uid:res.user.uid
         })
         this.geo.getCurrentPosition({
          timeout:10000,
          enableHighAccuracy:true
        }).then((resp)=>{
        const Latitude=resp.coords.latitude.toString();
        const Longitude=resp.coords.longitude.toString();
        this.afdb.object('users/'+res.user.uid).update({
          latitude:Latitude,
          longitude:Longitude
        })
     
      }).catch((error)=>{
        console.log(error);
      });
      this.user.setData(username)
     // let navigationExtras: NavigationExtras = {
     //   queryParams: {
     //       userid: username,
      //  }
   // };
    //this.navCtrl.navigateForward(['home'],navigationExtras);
         this.router.navigate(['/home'])
       }
       
    }  catch(err) {
      console.dir(err)
      if(err.code=="auth/user-not-found"){
        console.log("User not found")
        this.showAlert("Error","User not found")
      }
      if(err.code=="auth/wrong-password"){
        this.showAlert("Error","Password is incorrect.Please try again")
      }
      if(err.code="auth/invalid-email"){
        this.showAlert("Error","Username is badly formatted")
      }
    }
  }
  async showAlert(header:string,message:string){
    const alert=await this.alert.create({
      header,
      message,
      buttons:["Ok"]
    })
    await alert.present()
  }  
}
