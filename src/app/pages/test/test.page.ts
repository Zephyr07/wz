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

  }

  doRefresh(event) {


    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }



}
