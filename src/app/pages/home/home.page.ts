import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import {IonModal} from "@ionic/angular";
import {environment} from "../../../environments/environment";
import {Swiper} from "swiper";
import {TranslateService} from "@ngx-translate/core";
import * as moment from "moment";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('modalSearch') modal: IonModal;
  @ViewChild('swiperComponent') swiperComponent: Swiper;

  search:any="";
  is_loading = true;
  last_places:any=[];
  tournaments:any=[];
  games:any=[];

  places:any=[];
  old_places:any=[];
  isLoadingPlace=false;
  user:any=null;

  per_page = 20;
  page = 1;
  last_page = 10000000;
  max_length = 0;
  old_max_length = 0;

  dev_count = 0;

  slideOpts = {
    autoplay:{delay:7000},
    speed: 1000,
    loop:true,
  };
  settings:any={};
  version = environment.version;

  UPGRADE_PACK_TITLE="";
  UPGRADE_PACK_TEXT="";
  SUBSCRIPTION_EXPIRED_TITLE="";
  SUBSCRIPTION_EXPIRED_CONTENT="";
  NO_SUBSCRIPTION_TITLE="";
  NO_SUBSCRIPTION_CONTENT="";
  SUBSCRIPTION="";

  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
    private translate:TranslateService
  ) {
    this.translate.get('upgrade_pack_title').subscribe( (res: string) => {
      this.UPGRADE_PACK_TITLE=res;
    });
    this.translate.get('upgrade_pack_text').subscribe( (res: string) => {
      this.UPGRADE_PACK_TEXT=res;
    });
    this.translate.get('no_subscription_title').subscribe( (res: string) => {
      this.NO_SUBSCRIPTION_TITLE=res;
    });
    this.translate.get('no_subscription_content').subscribe( (res: string) => {
      this.NO_SUBSCRIPTION_CONTENT=res;
    });
    this.translate.get('subscription_expired_title').subscribe( (res: string) => {
      this.SUBSCRIPTION_EXPIRED_TITLE=res;
    });
    this.translate.get('subscription_expired_content').subscribe( (res: string) => {
      this.SUBSCRIPTION_EXPIRED_CONTENT=res;
    });
    this.translate.get('subscribe').subscribe( (res: string) => {
      this.SUBSCRIPTION=res;
    });
  }

  ngOnInit() {
    this.settings=JSON.parse(localStorage.getItem("wz_settings"))[0];
    this.getTournaments();
  }


  ionViewWillEnter() {
    if (this.api.checkUser()) {
      this.user = JSON.parse(localStorage.getItem('user_wz'));

      this.getUser();
    }
    //this.getTournaments();
    this.settings=JSON.parse(localStorage.getItem("wz_settings"))[0];
  }


  goToTest(){
    //this.router.navigateByUrl('test');
    this.dev_count+=1;
    if(this.dev_count==10){
      this.util.about_dev();
      this.dev_count=0;
    }
  }

  goTo(url){
    if(url=='simulateur' || url=="training"){
      if(this.api.checkUser()){
        const user = JSON.parse(localStorage.getItem('user_wz'));
        const sub = this.api.checkSubscription(user.subscription);
        if(sub.is_actived){
          if(user.subscription.pack.code=='free'){
            this.util.showModal(this.NO_SUBSCRIPTION_TITLE,this.NO_SUBSCRIPTION_CONTENT,this.SUBSCRIPTION,'user/pack');
          } else if(user.subscription.pack.code=='essentiel'){
            if(url=='simulateur'){
              this.router.navigateByUrl(url);
            } else {
              // upgrade du pack
              this.util.showModal(this.UPGRADE_PACK_TITLE,this.UPGRADE_PACK_TEXT,this.SUBSCRIPTION,'user/pack');
            }
          } else if(user.subscription.pack.code=='vip'){
            this.router.navigateByUrl(url);
          }

        } else if (sub.is_subscription && !sub.is_actived){
          this.util.showModal(this.SUBSCRIPTION_EXPIRED_TITLE,this.SUBSCRIPTION_EXPIRED_CONTENT,this.SUBSCRIPTION,'user/pack');
        } else {
          this.util.showModal(this.NO_SUBSCRIPTION_TITLE,this.NO_SUBSCRIPTION_CONTENT,this.SUBSCRIPTION,'user/pack');
        }
      } else {
        this.util.loginModal();
      }
    } else if(url=='user' || url=='tournament'){
      if(this.api.checkUser()){
        this.router.navigateByUrl(url);
      } else {
        if(url=='tournament'){
          this.util.doToast("Vous devez vous connecter pour continuer",3000,'light');
        }
        //this.util.showModal("Vous n'êtes pas connecté",'Connectez-vous pour continuer','Me connecter','login');
        this.router.navigateByUrl("login");
      }
    } else if(url=='contact'){
      document.getElementById('contact').click();
    } else {
      this.router.navigateByUrl('tabs/'+url);
    }
  }

  getTournaments(){
    //this.util.showLoading("loading");
    const opt = {
      should_paginate:false,
      'start_at-get':moment().format("YYYY-MM-DD hh:mm:ss")

    };

    this.api.getList('tournaments',opt).then(d=>{
      this.tournaments =d;
      //this.util.hideLoading();
    },q=>{
      //this.util.hideLoading();
      this.util.handleError(q);
    })
  }

  getGames(){
    //this.util.showLoading("loading");
    const opt = {
      should_paginate:false,
      _sort:'created_at',
      _sortDir:'desc'
    };

    this.api.getList('games',opt).then(d=>{
      this.games =d;
      //this.util.hideLoading();
    },q=>{
      //this.util.hideLoading();
      this.util.handleError(q);
    })
  }

  goToTournament(a){
    if(a.target_name == 'seminar'){
      const navigationExtra : NavigationExtras = {state: {title:a.title, id:a.target_id}};
      this.router.navigateByUrl('seminar',navigationExtra);
    } else if(a.target_name=='promotion'){
      const navigationExtra : NavigationExtras = {state: {title:a.title, id:a.target_id}};
      this.router.navigateByUrl('promotion',navigationExtra);
    }
  }

  getUser(){
    //this.util.showLoading("loading");
    this.api.getList('auth/me',{id:this.user.id}).then((a:any)=>{
      this.user = a.data.user;
      localStorage.setItem('user_wz',JSON.stringify(this.user));
      //this.util.hideLoading();
    }, q=>{
      //this.util.hideLoading();
      this.util.handleError(q);
    });
  }



  doRefresh(event) {
    this.getTournaments();
    if(this.api.checkUser()){
      this.getUser();
    } else {

    }
    this.api.getList('settings').then(d=>{
      localStorage.setItem('wz_settings',JSON.stringify(JSON.parse(d[0].config)));
      this.settings=JSON.parse(d[0].config)[0];
    });
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
