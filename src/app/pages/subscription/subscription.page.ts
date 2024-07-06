import {Component, OnInit, ViewChild} from '@angular/core';
import {NUMBER_RANGE} from "../../services/contants";
import {AlertController, IonModal, ModalController} from "@ionic/angular";
import * as moment from "moment";
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";
import {UtilProvider} from "../../providers/util/util";
import * as _ from "lodash";
import {AdmobProvider} from "../../providers/admob/AdmobProvider";

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  MIN = NUMBER_RANGE.min;
  MAX = NUMBER_RANGE.max;
  @ViewChild('modalDetailS') modal: IonModal;

  discount_promo=0;
  discount=0;
  is_subscription = false;
  id=0;
  unit=0;
  promo_code="";
  title="aze";
  choix='bronze';
  categories:any=[];
  games:any=[];
  old_games:any=[];
  private user:any={};
  //pack:any={};
  game:any={};
  duration=0;
  start_at:any;
  phone:any;
  player_number=0;
  category_id="";
  price=2000;
  code="";
  packs:any[] =[];
  settings:any={
    price:{
      ps:{},
      vr:{}
    }
  };

  private user_pack:any={};

  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
    public modalController: ModalController,
    public alertController: AlertController,
    private admbob:AdmobProvider
  ) {

  }

  ngOnInit() {
    this.getPacks();
    this.getSettings();
  }

  getSettings(){
    this.api.getList('settings').then(d=>{
      this.settings=JSON.parse(d[0].config)[0];
      localStorage.setItem('wz_settings',JSON.stringify(this.settings));
    });
  }

  ionViewWillEnter() {
    let settings = JSON.parse(localStorage.getItem('wz_settings'));
    if(settings.pub=='enable'){
      this.admbob.showBanner('bottom',70);
    }


    if(this.api.checkUser()){
      let user = JSON.parse(localStorage.getItem('user_wz'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        this.user = a.data.user;
        this.unit=this.user.unit;
        this.user_pack = this.user.subscription.pack;
        this.is_subscription = this.api.checkSubscription(this.user.subscription).is_actived;
        localStorage.setItem('user_wz',JSON.stringify(this.user));
      });
    } else {
      // no user
    }

  }

  ionViewWillLeave(){
    let settings = JSON.parse(localStorage.getItem('wz_settings'));
    if(settings.pub=='enable'){
      this.admbob.hideBanner();
    }
  }

  getPacks(){
    const opt = {
      should_paginate:false,
      _sort:'id',
      _sortDir:'asc'
    };

    this.api.getList('packs',opt).then((d:any)=>{
      this.packs = d;
    },q=>{
      this.util.handleError(q);
    })
  }

  checkPack(pack){
    if(this.settings.subscription=='false'){
      this.util.doToast("Rendez-vous dans la salle de jeu pour acheter votre abonnement",4000);
    } else {
      if(this.is_subscription){
        if(pack.price<=this.user_pack.price){
          // l'utilisateur doit attendre la fin de son abonnement pour pouvoir souscire à un autre pack
          this.util.doToast("Vous ne pouvez pas acheter ce pack tant que votre abonnement n'est pas terminé",5000,'light')
        } else {
          this.buyPack(pack);
        }
      } else {
        this.buyPack(pack);
      }
    }

  }

  async buyPack(pack:any){

    let titre = "Devenir membre";
    let text = "Vous allez devenir membre "+pack.name+". Coût : "+pack.price+" U";
    let result = "Bienvenue cher membre. Vous bénéficiez des reductions sur nos prix et plus encore";

    if(this.user.unit>=pack.price){
      // demande du numéro
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: titre,
        subHeader:text,
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              //console.log('Confirm Cancel');
            }
          }, {
            text: 'Confirmer',
            handler: (data:any) => {
              let target = "subscriptions";
              const opt = {
                pack_id:pack.id,
                user_id:this.user.id,
                type:'pack'
              };
              this.util.showLoading('initiation_payment');
              this.api.post(target,opt).then(d=>{
                this.user.unit-=pack.price;
                localStorage.setItem('user_wr',JSON.stringify(this.user));
                this.is_subscription=true;
                this.util.hideLoading();
                this.util.doToast(result,3000)
              }, q=>{
                this.util.hideLoading();
                this.util.handleError(q);
              });
            }
          }
        ]
      });

      await alert.present();
    } else {
      // recharge du compte
      this.recharge(pack);
      //this.util.doToast('Solde insuffisant. Veuillez recharger votre compte',3000);
    }
  }

  async recharge(pack) {
    let titre = "Devenir membre";
    let text = "Vous allez devenir membre de la salle. Entrez le numéro pour le paiement mobile";
    const alert = await this.alertController.create({
      header: titre,
      subHeader:text,
      buttons: [
        {
          text: "Annuler",
          role: 'cancel',
        },
        {
          text: "Confirmer",
          role:'confirm',
          handler:(data)=>{
            let type = "account-pack";
            if(pack.id==4){
              type = "account-subscription";
            }
            if(!isNaN(data.phone) && data.phone <= NUMBER_RANGE.max && data.phone >= NUMBER_RANGE.min){
              this.util.showLoading("treatment");
              const opt = {
                type,
                'pack_id':pack.id,
                user_id:this.user.id
              };
              this.api.post('init_buy_account',opt).then(async (d:any) => {
                // initialisation du payment my-coolPay
                this.api.post('payment/' + d.id + '/' + data.phone,{}).then(e=>{
                  this.util.hideLoading();
                  this.util.doToast('payment_pending',3000);
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
          placeholder: "Téléphone",
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

  doRefresh(event) {
    this.ionViewWillEnter();
    this.getPacks();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
