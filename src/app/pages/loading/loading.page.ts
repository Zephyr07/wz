import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {MenuController, NavController, Platform} from "@ionic/angular";
import {environment} from "../../../environments/environment";
import {UtilProvider} from "../../providers/util/util";
import {AuthProvider} from "../../providers/auth/auth";
import * as moment from "moment";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {
  isMaintenance=false;
  isUpgrade=false;
  link="";
  version:number;

  constructor(
    private api:ApiProvider,
    private auth:AuthProvider,
    private util:UtilProvider,
    private navCtrl:NavController,
    private platform:Platform,
    private menuController:MenuController,
    private translate:TranslateService
  ) {
    this.menuController.enable(false);
  }

  ngOnInit() {

    this.api.getSettings().then((d:any)=>{
      if(this.platform.is('ios')){
        // redirection vers app store
        this.version=d.ios.version;
      } else {
        // redirection vers play store
        this.version=d.android.version;
      }
      //console.log(this.version,environment.code);
      if(d.maintenance==true){
        this.isMaintenance=true;
      } else if(environment.code < this.version){
        // mise à jour disponible
        if(this.platform.is('ios')){
          this.link=d.ios.link;
        } else {
          this.link=d.android.link;
        }
        this.isUpgrade=true;
      } else {
        // on part chez home
        this.navCtrl.navigateRoot(['/home']);
      }

    }, q=>{
      //this.util.handleError(q);
    })

    if(this.api.checkCredential()){
      // connexion
      const cre = this.util.decryptAESData(JSON.parse(localStorage.getItem('auth_lv')));
      this.auth.login(cre).then((e:any)=>{
        const l = JSON.parse(e.user.settings)[0].language;
        this.translate.use(l);
        this.translate.setDefaultLang(l);
        moment.locale(l);
      },q=>{
        //this.util.hideLoading();
        this.auth.logout();
      })

    } else {
      localStorage.setItem('is_user','false');
    }
  }

  update(){
    window.location.href=this.link;
  }

}
