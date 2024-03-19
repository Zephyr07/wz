import {EventEmitter, Injectable} from '@angular/core';
import {ONE_SIGNAL_CONF} from "../../services/contants";
import {OneSignal, OSNotificationPayload} from '@awesome-cordova-plugins/onesignal/ngx';
import {ToastController} from "@ionic/angular";
import OneSignalX from 'onesignal-cordova-plugin';
import {NavigationExtras, Router} from "@angular/router";
import {HomePage} from "../../pages/home/home.page";


/*
  Generated class for the NotificationProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  navigationEvent = new EventEmitter();

  constructor(private oneSignal: OneSignal, public toastCtrl: ToastController,private router:Router) {

  }

  init() {
    OneSignalX.setAppId(ONE_SIGNAL_CONF.app_id);
    OneSignalX.setNotificationOpenedHandler((jsonData)=> {
      this.handle(jsonData.notification.additionalData)

    });

    OneSignalX.getDeviceState((d:any)=>{
      console.log("notification", JSON.stringify(d));
      localStorage.setItem("external_id",d.userId);
    });
    this.oneSignal.startInit(ONE_SIGNAL_CONF.app_id, ONE_SIGNAL_CONF.sender_id);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
    this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload, data.action.actionID));
    this.oneSignal.endInit();

  }

  handle(data){
    if(data.target=='tournament'){
      const navigationExtra : NavigationExtras = {state: {name:data.name, id:data.id}};
      this.router.navigateByUrl('tournament/tournament-detail',navigationExtra);
    } else if(data.target=='tombola'){
      const navigationExtra : NavigationExtras = {state: {name:data.name, id:data.id}};
      this.router.navigateByUrl('tombola/tombola-detail',navigationExtra);
    }
  }

  getDeviceToken() {

    return new Promise((resolve, reject) => {
      this.oneSignal.getIds().then(identity => {
        resolve(identity.userId);
      });
    });
  }

  film_reminder(payload: OSNotificationPayload, action?: string) {
    console.log(payload, action);
    if (action === "film") {
      this.navigationEvent.next({
        page: HomePage,
        params:
          {
            id_film: payload.additionalData.film_id,
            // schedule_id: notif.notification.payload.additionalData.schedule_id
          }
      })

    } else if (action === "ticket") {
      // $state.go('app.tickets');
    } else {
      this.navigationEvent.next({
        page: HomePage,
        params:
          {
            id_film: payload.additionalData.film_id,
            // schedule_id: notif.notification.payload.additionalData.schedule_id
          }
      })
    }

  }

  tombola_create(payload: OSNotificationPayload, action?: string) {
    console.log(payload, action);
    this.navigationEvent.next({
      page: HomePage})

  }

   private async onPushReceived(payload: OSNotificationPayload) {
    // console.log('Push recevied:', payload);
    let msg: string = "Nouvelle notification: " + payload.title + " " + payload.body;
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  private onPushOpened(payload: OSNotificationPayload, action?: string) {
    console.log('Push opened: ', payload);

    if (payload.additionalData.channel === 'film_reminder') {
      this.film_reminder(payload, action)
    } else if (payload.additionalData.channel === 'tombola_create') {
      this.tombola_create(payload, action)
    }
  }
}
