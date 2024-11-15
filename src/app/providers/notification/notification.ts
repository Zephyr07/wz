import {EventEmitter, Injectable} from '@angular/core';
import {ONE_SIGNAL_CONF} from "../../services/contants";
import {ToastController} from "@ionic/angular";
import OneSignalX from 'onesignal-cordova-plugin';
import {NavigationExtras, Router} from "@angular/router";

@Injectable()
export class NotificationProvider {

  navigationEvent = new EventEmitter();

  constructor(public toastCtrl: ToastController,private router:Router) {

  }

  init() {
    OneSignalX.initialize(ONE_SIGNAL_CONF.app_id);
    OneSignalX.Notifications.addEventListener('click', async (e) => {
      let clickData = await e.notification;
      console.log("Notification Clicked : " + clickData);
      this.handle(clickData)
    })

  }

  handle(data){
    if(data.target=='problem'){
      const navigationExtra : NavigationExtras = {state: {id:data.id}};
      this.router.navigateByUrl('problem/problem-detail',navigationExtra);
    } else if(data.target=='tombola'){
      const navigationExtra : NavigationExtras = {state: {name:data.name, id:data.id}};
      this.router.navigateByUrl('tombola/tombola-detail',navigationExtra);
    } else if(data.target=='referral'){
      //const navigationExtra : NavigationExtras = {state: {name:data.name, id:data.id}};
      this.router.navigateByUrl('referral');
    } else if(data.target=='game'){
      //const navigationExtra : NavigationExtras = {state: {name:data.name, id:data.id}};
      this.router.navigateByUrl('tabs/game');
    } else if(data.target=='store'){
      //const navigationExtra : NavigationExtras = {state: {name:data.name, id:data.id}};
      this.router.navigateByUrl('tabs/store');
    } else if(data.target=='otakuget'){
      //const navigationExtra : NavigationExtras = {state: {name:data.name, id:data.id}};
      this.router.navigateByUrl('product');
    }
  }

  getDeviceToken() {

    return new Promise((resolve, reject) => {
      resolve(0);
    });
  }

}
