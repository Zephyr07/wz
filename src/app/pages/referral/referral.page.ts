import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonModal, ModalController, NavController} from "@ionic/angular";
import {NUMBER_RANGE} from "../../services/contants";
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";
import {UtilProvider} from "../../providers/util/util";
import {TranslateService} from "@ngx-translate/core";
import {Share} from "@capacitor/share";


@Component({
  selector: 'app-referral',
  templateUrl: './referral.page.html',
  styleUrls: ['./referral.page.scss'],
})
export class ReferralPage implements OnInit {

  referrals=0;

  user:any={};
  can_subscribe=false;
  phone:number;
  MIN = NUMBER_RANGE.min;
  MAX = NUMBER_RANGE.max;

  isLoading=true;

  settings:any={
    android:{
      subscription:false
    },
    ios:{
      subscription:false
    }
  };

  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
    public modalController: ModalController,
    public alertController: AlertController,
    private navCtrl:NavController,
    private translate: TranslateService
  ) {

  }

  ngOnInit() {
  }



  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_wz'));
      this.getReferralCount(this.user.sponsor_code);
    }
    if(localStorage.getItem('wz_settings')!='undefined'){
      this.settings = JSON.parse(localStorage.getItem('wz_settings'));
    } else {

    }
  }

  getReferralCount(sponsor_code){
    const opt = {
      _agg:'count',
      referral:sponsor_code,
      should_paginate:false,
      status:'enable'
    }

    this.api.getList('users',opt).then((d:any)=>{
      this.isLoading=false;
      this.referrals = d;
    })
  }

  async shareSponsorCode(){
    await Share.share({
      title: 'Partager',
      text: 'Utilise mon code promo et gagne 30 minutes de jeu gratuit à WarZone',
      url: 'https://wzs.warzone237.com/inscription/#/register/'+this.user.sponsor_code
    });
  }

  backToPreviousPage(){
    document.getElementById('backButton').click();
  }



  doRefresh(event) {
    this.ionViewWillEnter();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

}
