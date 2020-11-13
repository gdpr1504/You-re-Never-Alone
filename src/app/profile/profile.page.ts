import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database'
import {Validators,FormGroup,FormBuilder} from '@angular/forms'
import { UserService } from '../user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  items;
  name;
  desc;
  imageUrl;
  
  constructor(public afdb:AngularFireDatabase,private fb:FormBuilder,public user:UserService) {
    this.getDataFromFirebase();
   }

  ngOnInit() {
  }
  getDataFromFirebase(){
    this.afdb.list('users/').valueChanges().subscribe(
      data=>{
        console.log(data)
        console.log("profile"+this.user.getData())
        this.items=data
        for(var i=0;i<data.length;i++)
        if(data[i]['name']=='nikhil'){
          this.name="hi"+data[i]['latitude']
          this.afdb.list('posts/').valueChanges().subscribe(
            data2=>{
              console.log(data2)
              this.imageUrl=data2[0]['image']
              this.desc=data2[0]['desc']
            }
          )
        }


      }
    )

  }


}
