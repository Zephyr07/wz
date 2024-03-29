import { Component, OnInit } from '@angular/core';
import {DEVISE, NUMBER_RANGE} from "../../../services/contants";
import {Router} from "@angular/router";
import {AuthProvider} from "../../../providers/auth/auth";
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";
import {AlertController, ModalController, NavController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-recharge-account',
  templateUrl: './recharge-account.page.html',
  styleUrls: ['./recharge-account.page.scss'],
})
export class RechargeAccountPage implements OnInit {
  DEVISE = DEVISE;
  user:any={
    customer:{}
  };
  CANCEL="";
  UPDATE="";
  TEXT="";
  PHONE="";
  PASS="";
  NEW_PASS="";
  AMOUNT="";
  referral_count=0;
  old_payments:any=[];
  subscription_status:any={};
  settings:any={
    android:{
      subscription:false
    },
    ios:{
      subscription:false
    }
  };

  constructor(
    private router:Router,
    private navCtrl:NavController,
    private util:UtilProvider,
    private api:ApiProvider,
    private auth:AuthProvider,
    private alertController :AlertController,
    private modalController:ModalController,
    private translate:TranslateService
  ) {
    this.translate.get('cancel').subscribe( (res: string) => {
      this.CANCEL=res;
    });
    this.translate.get('confirm').subscribe( (res: string) => {
      this.UPDATE=res;
    });
    this.translate.get('recharge_account').subscribe( (res: string) => {
      this.TEXT=res;
    });
    this.translate.get('phone').subscribe( (res: string) => {
      this.PHONE=res;
    });
    this.translate.get('amount').subscribe( (res: string) => {
      this.AMOUNT=res;
    });
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    // recupération des settings
    if(localStorage.getItem('wz_settings')!='undefined'){
      this.settings = JSON.parse(localStorage.getItem('wz_settings'))[0];
    } else {

    }
    if (this.api.checkUser()) {
      let user = JSON.parse(localStorage.getItem('user_wz'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        this.user = a.data.user;
        this.getOldPayments();
        localStorage.setItem('user_wz',JSON.stringify(this.user));
        this.subscription_status=this.api.checkSubscription(this.user.subscription);
        this.getPerson(this.user.id);
        this.getReferralCount(this.user.sponsor_code);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  getReferralCount(sponsor_code){
    const opt = {
      _agg:'count',
      referral:sponsor_code,
      should_paginate:false,
      status:'enable'
    };

    this.api.getList('users',opt).then((d:any)=>{
      this.referral_count = d;
    })
  }

  async shareSponsorCode(){
    await Share.share({
      title: 'Partager',
      text: 'Utilise mon code promo et gagne 30 minutes de jeu gratuit à WarZone',
      url: 'https://wzs.warzone237.com/inscription/#/register/'+this.user.sponsor_code
    });
  }

  getPerson(user_id){
    this.api.getList('people',{user_id}).then((d:any)=>{
      this.user.person = d[0];
    }, q=>{
      this.util.handleError(q);
    })
  }

  async recharge() {
    const alert = await this.alertController.create({
      header: this.TEXT,
      buttons: [
        {
          text: this.CANCEL,
          role: 'cancel',
        },
        {
          text: this.UPDATE,
          role:'confirm',
          handler:(data)=>{
            if(!isNaN(data.phone) && data.phone <= NUMBER_RANGE.max && data.phone >= NUMBER_RANGE.min){
              this.util.showLoading("treatment");
              const opt = {
                type:'account',
                amount:data.amount,
                user_id:this.user.id
              };
              this.api.post('init_buy_account',opt).then(async (d:any) => {
                // initialisation du payment my-coolPay
                this.api.post('payment/' + d.id + '/' + data.phone,{}).then(e=>{
                  this.util.hideLoading();
                  this.util.doToast('payment_pending',5000);
                  // redirection vers la page de l'user
                  /*setTimeout(()=>{
                    this.navCtrl.navigateRoot(['/user']);
                  },3000)*/
                }, q=>{
                  this.util.hideLoading();
                  this.util.handleError(q);
                })
                //console.log(d);
              },q=>{
                this.util.hideLoading();
                this.util.handleError(q);
              });
            } else {
              this.util.doToast('Veuillez entrer un numéro de téléphone valide',3000);
            }
          }
        },
      ],
      inputs: [
        {
          placeholder: this.AMOUNT,
          type:'number',
          name:'amount',
          attributes: {
            step:50,
            min: 0
          },
        },
        {
          placeholder: this.PHONE,
          value:this.user.phone,
          type:'number',
          name:'phone',
          attributes: {
            min: NUMBER_RANGE.min,
            max: NUMBER_RANGE.max
          },
        }
      ],
    });

    await alert.present();
  }

  getOldPayments(){
    const opt = {
      user_id:this.user.id,
      should_paginate:false,
      _sort:'created_at',
      _sortDir:'desc'
    };

    this.api.getList("transactions",opt).then((d:any)=>{
      d.forEach(v=>{
        if(v.type=='withdrawal'){
          v.transaction_amount = v.transaction_amount/1.05;
        }
      });
      this.old_payments = d;
    })

  }

  async withdrawal() {
    const alert = await this.alertController.create({
      header: "Montant du retrait",
      subHeader:"Les frais de retrait sont de 5% du montant.",
      buttons: [
        {
          text: this.CANCEL,
          role: 'cancel',
        },
        {
          text: this.UPDATE,
          role:'confirm',
          handler:(data)=>{
            if(!isNaN(data.amount) && data.amount>=500){
              const opt = {
                user_id:this.user.id,
                transaction_amount:data.amount,
                type:'withdrawal',
                status:"pending"
              };
              this.api.post('transactions',opt).then(d=>{
                this.util.doToast("Votre demande de retrait sera traitée sous 48h.",5000);
                this.getOldPayments();
              }, q=>{
                this.util.doToast(q.data,3000);
              })
            } else {
              this.util.doToast('Veuillez entrer un montant supérieur ou égale à 500',3000);
            }

          }
        },
      ],
      inputs: [
        {
          placeholder: this.AMOUNT,
          value:500,
          type:'number',
          name:'amount',
          attributes: {
            step:50,
            min: 0
          },
        }
      ],
    });

    await alert.present();
  }

  doRefresh(event) {
    this.ionViewWillEnter();

    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
