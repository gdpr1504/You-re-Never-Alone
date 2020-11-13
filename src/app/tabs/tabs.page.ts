import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { ElementRef} from '@angular/core'
import {Router} from '@angular/router'
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { UserService } from '../user.service';

declare var google:any;
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  id:string;
  constructor(public router:Router,private route: ActivatedRoute,public navCtrl: NavController,public user:UserService){}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params["userid"];
 });

}
}
