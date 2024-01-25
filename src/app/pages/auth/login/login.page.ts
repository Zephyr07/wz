import { Component, OnInit } from '@angular/core';
import {UtilProvider} from "../../../providers/util/util";
import {NavController} from "@ionic/angular";
import {AuthProvider} from "../../../providers/auth/auth";
import {Router} from "@angular/router";
import {ApiProvider} from "../../../providers/api/api";
import {isCordovaAvailable} from "../../../services/utils";
import OneSignal from "onesignal-cordova-plugin";
import {NUMBER_RANGE} from "../../../services/contants";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  is_loading=false;
  email:any=null;
  password="";
  constructor(
    private util:UtilProvider,
    private auth:AuthProvider,
    private api:ApiProvider,
    private router:Router,
    private navCtrl:NavController
  ) { }

  ngOnInit() {
  }

  login() {
    if (!isNaN(this.email) && (this.email<NUMBER_RANGE.min || this.email>NUMBER_RANGE.max)){
      this.util.doToast("phone_empty",5000)
    } else if (this.password == "" || this.password.length<6){
      this.util.doToast("password_empty",5000)
    } else {
      this.util.showLoading('identification');
      this.auth.login({email:this.email,password:this.password}).then((d:any)=>{
        if(isCordovaAvailable()){
          //OneSignal.sendTags({'country_id':d.user.country_id});
        }
        this.is_loading = true;
        this.util.hideLoading();

        //this.navCtrl.navigateRoot(['/home']);
        this.navCtrl.navigateRoot(['/tabs']);
      }, q=>{
        alert(JSON.stringify(q));
        this.util.hideLoading();
        this.util.handleError(q);
      })
    }
    //localStorage.setItem('uid','rahul');

  }

  backToPreviousPage(){
    document.getElementById('backButton').click();
  }

  goToRegister(){
    this.router.navigateByUrl('create-account');
  }

}
