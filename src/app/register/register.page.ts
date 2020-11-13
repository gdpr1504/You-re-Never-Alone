import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AlertController } from '@ionic/angular'
import { stringify } from 'querystring';
import { AngularFirestore} from '@angular/fire/firestore'
import { UserService } from '../user.service';
import {Router} from '@angular/router'
import { firestore } from 'firebase';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import {AngularFireDatabase} from '@angular/fire/database'
import { HttpClient } from '@angular/common/http'
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  username: string=""
  password: string=""
  cpassword: string=""
  phonenumber: string=""
  imageURL: string
  constructor(public afAuth:AngularFireAuth,
    public user:UserService,
    public alert: AlertController,public afstore: AngularFirestore,
    public router:Router,
    private geo:Geolocation,private afdb: AngularFireDatabase,public http: HttpClient) { }

  ngOnInit() {
  }
  fileChanged(event){
    const files =event.target.files
    const data = new FormData()
    data.append('file',files[0])
    data.append('UPLOADCARE_STORE','1')
    data.append('UPLOADCARE_PUB_KEY','49dda3a43942eea5f56b')

    this.http.post('https://upload.uploadcare.com/base/',data)
    .subscribe(event => {
    console.log(event)
    this.imageURL = event['file']  })
}
  async register(){
    const {username,password,cpassword,phonenumber} = this
    console.log("hi"+username+password+cpassword+phonenumber)
    if(username=="" || password=="" || phonenumber=="")
    {

      this.showAlert("Error!","Please enter all fields")
      
    }
    else{
      if(password!=cpassword){
      this.showAlert("Error!","Passwords don't match")
      return console.error("Password doesnot match")
    }
    else if(phonenumber.length !=10){
      this.showAlert("Error!","Please enter correct phone number")
    }
    else if(password.length<6){
      this.showAlert("Error!","Password is weak")
    }
    else{
   
    try{

    const image=this.imageURL
    const res = await this.afAuth.createUserWithEmailAndPassword(username+"@gdpr.com",password)
    this.geo.getCurrentPosition({
      timeout:10000,
      enableHighAccuracy:true
    }).then((resp)=>{
    const Latitude=resp.coords.latitude.toString();
    const Longitude=resp.coords.longitude.toString();
  
    this.afdb.object('users/'+res.user.uid).set({
      name:username,
      phonenumber:phonenumber,
      latitude:Latitude,
      longitude:Longitude,
      image:image,
      id:username+phonenumber.substring(7,10)
     })
  }).catch((error)=>{
    console.log(error);
  });

    this.afstore.doc(`users/${res.user.uid}`).set({
      username
    })
    this.user.setUser({
        username,
        uid:res.user.uid
      })
    
    
    this.showAlert("Success!","You ae registered!")
    this.router.navigate(['welcome'])
  } catch(error){

    this.showAlert("Error","Please choose another username")}
      
   
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
