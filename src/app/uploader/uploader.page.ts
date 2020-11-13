import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { UserService } from '../user.service';
import {AngularFireDatabase} from '@angular/fire/database'
@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {
  imageURL: string
  desc: string
  constructor(public http: HttpClient,public afstore: AngularFirestore,public user:UserService,public afdb:AngularFireDatabase) { }

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
  createPost(){
    const image=this.imageURL
    const desc=this.desc
    this.afdb.object('posts/'+`${this.user.getUID()}`).set({
      image:image,
      desc:desc,
      })
  }

}
