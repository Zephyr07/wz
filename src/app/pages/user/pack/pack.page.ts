import {Component, OnInit} from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {AlertController, NavController} from "@ionic/angular";
import {UtilProvider} from "../../../providers/util/util";
import {NUMBER_RANGE} from "../../../services/contants";
import {TranslateService} from "@ngx-translate/core";
import * as _ from "lodash";
import * as moment from "moment";

@Component({
  selector: 'app-pack',
  templateUrl: './pack.page.html',
  styleUrls: ['./pack.page.scss'],
})
export class PackPage implements OnInit {

  duration=1;

  packs:any=[];
  user:any={};
  is_loading=false;
  is_phone=false;
  phone:number;
  MIN = NUMBER_RANGE.min;
  MAX = NUMBER_RANGE.max;
  pack:any={};
  choice="";
  OUI="";
  NON="";
  TITLE="";
  TEXT="";

  constructor(
    private util:UtilProvider,
    private api:ApiProvider,
    private alertController:AlertController,
    private navCtrl:NavController,
    private translate: TranslateService
  ) {
    this.translate.get('yes').subscribe( (res: string) => {
      this.OUI=res;
    });
    this.translate.get('no').subscribe( (res: string) => {
      this.NON=res;
    });
    this.translate.get('ignore_buy_title').subscribe( (res: string) => {
      this.TITLE=res;
    });
    this.translate.get('ignore_buy_text').subscribe( (res: string) => {
      this.TEXT=res;
    });
  }

  ngOnInit() {
    this.getPacks();
  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_lr'));
      this.phone=this.user.phone;
    }
  }

  setPack(t){
    this.pack = _.find(this.packs,{code:t});
    this.choice=t;
  }

  getPacks(){
    const opt = {
      should_paginate:false,
      _sort:'price',
      _sortDir:'asc'
    };

    this.api.getList('packs',opt).then(p=>{
      this.packs=p;
    },q=>{
      this.util.hideLoading();
      this.util.handleError(q);
    })
  }

  goBuyPack(){
    if(this.user.country.payment_status=='enable'){
      this.util.showLoading('initiation_payment');
      // creation du paiement en type account
      const opt = {
        type:'account',
        pack_id:this.pack.id,
        duration:this.duration
      };
      this.api.post('init_buy_training',opt).then(async (d:any) => {
        // initialisation du payment my-coolPay
        this.api.post('payment/' + d.id + '/' + this.phone,{}).then(e=>{
          this.util.hideLoading();
          this.util.doToast('payment_pending',5000);
          // redirection vers la page de l'user
          setTimeout(()=>{
            this.navCtrl.navigateRoot(['/user']);
          },3000)
        }, q=>{
          this.util.hideLoading();
          this.util.handleError(q);
        })
        //console.log(d);
      },q=>{
        this.util.hideLoading();
        this.util.handleError(q);
      });
      // requete vers my-cool pay
    } else {
      this.util.doToast("Paiement non autorisé pour votre pays",3000,'danger');
    }



  }

  async ignored() {
    const alert = await this.alertController.create({
      subHeader:this.TITLE,
      message:this.TEXT,
      buttons: [
        {
          text: this.NON,
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: this.OUI,
          role: 'confirm',
          handler: () => {
            // redirection vers la page home
            this.navCtrl.navigateRoot(['/tabs/home']);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  saveSubscription(payment_id){
    const opt ={
      pack_id:this.pack.id,
      user_id:this.user.id,
      price_was:this.pack.price,
      payment_id,
      state:"pending_payment",
      start_at: moment()
    };

    this.api.post('subscriptions',opt).then(async d => {
      this.user.subscription = d;
      this.user.subscription.pack=this.pack;
      this.user.is_subscription = true;

      this.api.post('payment/' + payment_id + '/' + this.phone,{}).then(e=>{
        this.util.hideLoading();
        this.util.doToast('subscription_save_pending_payment',5000);
        this.navCtrl.navigateRoot(['/tabs/home']);
      }, q=>{
        console.log(q);
        this.util.hideLoading();
        this.util.handleError(q);
      });
    }, q=>{
      //console.log(q);
      if(q.error.error.status_code==500){
        // duplicate entry
        // recherche du précédent abonnement dze l'utilisateur
        this.api.getList('subscriptions',{user_id:this.user.id}).then((d:any)=>{
          let s = d[0];
          s.start_at=moment();
          s.state="pending_payment";
          s.pack_id=this.pack.id;
          s.payment_id=payment_id;
          s.price_was=this.pack.price;

          this.api.put('subscriptions',s.id,s).then(async d => {
            this.util.hideLoading();
            await this.util.doToast("subscription_update_pending_payment", 5000);
            this.navCtrl.navigateRoot(['/tabs/home']);
          },q=>{
            console.log(q);
            this.util.handleError(q);
          })
        }, q=>{
          this.util.hideLoading();
          this.util.handleError(q);
        })
      } else {
        this.util.hideLoading();
        this.util.handleError(q);
      }
    })
  }

  checkNumber(){
    this.is_phone = this.MIN <= this.phone && this.phone <= this.MAX;
  }

  support(){
    if(this.translate.getDefaultLang()=='fr'){
      window.location.href="https://api.whatsapp.com/send?phone=237696870700&text=Bonjour+je+souhaite+réinitialiser+mon+mot+de+passe+svp.+Longrich";
    } else {
      window.location.href="https://api.whatsapp.com/send?phone=237696870700&text=Hello+I+want+to+reset+my+password+please.+Longrich";
    }
  }


}
