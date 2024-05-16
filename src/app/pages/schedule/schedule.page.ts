import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";
import {UtilProvider} from "../../providers/util/util";
import {AlertController, IonModal, ModalController} from "@ionic/angular";
import * as _ from "lodash";
import * as moment from "moment";
import {NUMBER_RANGE} from "../../services/contants";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
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
  choix='heure';
  categories:any=[];
  games:any=[];
  old_games:any=[];
  private user:any={};
  offer:any={};
  game:any={};
  duration=0;
  start_at:any;
  phone:any;
  player_number=0;
  category_id="";
  price=2000;
  reduc=0;
  offer_jour:any[] =[];
  offer_mois:any[]=[];
  settings:any={
    price:{
      ps:{},
      vr:{}
    }
  };
  min_date = moment().format('YYYY-MM-DDThh:mm:ss');
  max_date= moment().add('day',14).format('YYYY-MM-DDThh:mm:ss');
  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    /**
     * Date will be enabled if it is not
     * Monday
     */
    return utcDay !== 1 ;
  };

  is_tuesday=false;

  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
    public modalController: ModalController,
    public alertController: AlertController
  ) {

  }

  ngOnInit() {
    this.getOffers();
    this.getSettings();
  }

  getSettings(){
    this.api.getList('settings').then(d=>{
      this.settings=JSON.parse(d[0].config)[0];
      localStorage.setItem('wz_settings',JSON.stringify(this.settings));
    });
  }

  ionViewWillEnter() {
    this.api.getList('day',{}).then(d=>{
      this.is_tuesday = d == 2;
    });

    if(this.api.checkUser()){
      let user = JSON.parse(localStorage.getItem('user_wz'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        this.user = a.data.user;
        this.unit=this.user.unit;
        this.is_subscription = this.api.checkSubscription(this.user.subscription).is_actived;
        localStorage.setItem('user_wz',JSON.stringify(this.user));
      });
    } else {
      // no user
    }

  }

  checkPromoCode(){
    const opt = {
      code : this.promo_code,
      'end_at-get':moment().format("YYYY-MM-DD"),
      should_paginate: false
    };

    this.api.getList('promo_codes',opt).then((d:any)=>{
      if(d.length>0){
        this.discount_promo = d[0].discount;
        console.log(d[0]);
        this.setPrice();
      } else {
        this.util.doToast('Code promo non valide',3000,'light');
      }
    })
  }

  setPrice(){
    if(this.discount_promo!=0){
      if(this.category_id=='vr'){
        // vr
        this.price = this.settings.price.vr.h;
      } else {
        // ps
        this.price = this.settings.price.ps.h;
      }
      this.discount = this.price*(1-this.discount_promo);
    } else {
      if(this.category_id=='vr'){
        // vr
        this.price = this.settings.price.vr.h;
        if(this.is_subscription){
          this.discount=this.settings.price.vr.hr;
          this.reduc = this.settings.price.vr.reduction;
        } else {
          this.discount = this.price;
        }
      } else {
        // ps
        this.price = this.settings.price.ps.h;
        if(this.is_subscription){
          this.discount=this.settings.price.ps.hr;
          this.reduc = this.settings.price.ps.reduction;
        } else {
          this.discount = this.price;
        }
      }
    }

  }

  booking(){
    this.util.showLoading('initiation_payment');
    // creation du paiement en type account
    const opt = {
      category_id:this.category_id,
      date:this.start_at,
      duration:this.duration,
      player_number:this.player_number,
      user_id:this.user.id,
      reduc:this.reduc,
      promo_code:this.promo_code
    };
    this.api.post('schedules',opt).then(async (d:any) => {
      this.util.hideLoading();
      this.util.doToast("Reservation enregistrée",3000);
      this.category_id="";
      this.user.unit-=this.duration*this.player_number*this.price;
      this.duration=0;
      this.promo_code="";
      this.player_number=0;
      this.start_at = undefined;
    },q=>{
      this.util.hideLoading();
      this.util.handleError(q);
    });

  }

  getOffers(){
    const opt = {
      status:'enable',
      should_paginate:false
    };

    this.api.getList('offers',opt).then((d:any)=>{
      this.offer_jour = _.filter(d,{type:'jour'});
      this.offer_mois = _.filter(d,{type:'mois'});
    },q=>{
      this.util.handleError(q);
    })
  }

  async offerDay(o){
    let duration = 24;
    if(o.type!='jour'){
      duration=720
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Reservation pour '"+o.name+"'",
      subHeader:"Cette reservation vous coûtera "+o.price+" U. Confirmez-vous ?",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
            this.closeModal();
          }
        }, {
          text: 'Confirmer',
          handler: (data:any) => {
            this.util.showLoading('initiation_payment');
            // creation du paiement en type account
            const opt = {
              date:this.start_at,
              duration,
              player_number:o.player_number,
              user_id:this.user.id,
              price_was:o.price,
              offer_id:o.id,
              reduc:0
            };
            this.api.post('schedules',opt).then(async (d:any) => {
              this.util.hideLoading();
              this.util.doToast("Reservation enregistrée",3000);
              this.category_id="";
              this.user.unit-=o.price;
              this.duration=0;
              this.player_number=0;
              this.start_at = undefined;
            },q=>{
              this.util.hideLoading();
              this.util.handleError(q);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  openOffer(o){
    document.getElementById('open-modal').click();
    this.offer = o;
  }

  closeModal(){
    this.modal.setCurrentBreakpoint(0);
  }

  doRefresh(event) {
    this.ionViewWillEnter();
    this.getOffers();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
