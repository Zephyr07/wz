import { Component, OnInit } from '@angular/core';
import {isCordovaAvailable} from "../../services/utils";
import OneSignal from "onesignal-cordova-plugin";
import {NotificationProvider} from "../../providers/notification/notification";
import {ONE_SIGNAL_CONF} from "../../services/contants";

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  constructor(
    private notif: NotificationProvider,) { }

  ngOnInit() {
    if(isCordovaAvailable()){
      this.OneSignalInit();
      this.notif.init();
      this.notif.navigationEvent.subscribe(
        data => {
          console.log(data);
        }
      );
    }
  }

  doRefresh(event) {
    if(isCordovaAvailable()){
      this.OneSignalInit();
      this.notif.init();
      this.notif.navigationEvent.subscribe(
        data => {
          console.log(data);
        }
      );
    }
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

  OneSignalInit(){
    //alert("eaz");
    // Uncomment to set OneSignal device logging to VERBOSE
    OneSignal.setLogLevel(6, 0);
    OneSignal.getDeviceState(d=>{
      console.log("device", JSON.stringify(d));
    })
    // NOTE: Update the setAppId value below with your OneSignal AppId.
    OneSignal.setAppId(ONE_SIGNAL_CONF.app_id);
    OneSignal.setNotificationOpenedHandler((jsonData) =>{
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });


    // iOS - Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
    OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
      console.log("User accepted notifications: " + accepted);
    });
  }

}
