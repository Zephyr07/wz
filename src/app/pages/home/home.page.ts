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


  schedule="disable";
  otaku="disable";
  tombola="disable";

  is_loading = true;
  is_loading_games = true;
  is_loading_tournament = true;
  is_user:any ;
  tournaments:any=[];
  games:any=[];

  private user:any={
    person:{},
  };

  full_name="";
  image="";
  unit="";
  hour=0;
  sponsor_code="";
  pack:any={};

  is_subscription = false;
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

  tournament_count:any = 0;
  offer_count:any = 0;
  tombola_count:any = 0;

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
    this.getSettings();
    this.getTournaments();
    this.getGames();
    this.getTombola();
  }


  ionViewWillEnter() {
    this.is_user =localStorage.getItem('is_user');
    if(this.is_user=='true'){
      let user = JSON.parse(localStorage.getItem('user_wz'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        this.user = a.data.user;
        this.full_name= a.data.user.person.full_name;
        this.image= a.data.user.person.image;
        this.unit= a.data.user.unit;
        this.hour= a.data.user.hour;
        this.sponsor_code= a.data.user.sponsor_code;
        if(this.user.subscription){
          this.pack= a.data.user.subscription.pack;
          this.user.subscription_status=this.api.checkSubscription(this.user.subscription);
          this.is_subscription = this.user.subscription_status.is_actived;
          this.user.is_subscription=this.is_subscription;
        }

        localStorage.setItem('user_wz',JSON.stringify(this.user));


        //this.getUser();
      });
    }

  }

  getSettings(){
    this.api.getList('settings').then(d=>{
      this.settings=JSON.parse(d[0].config)[0];
      this.schedule = this.settings.schedule;
      this.otaku = this.settings.otaku;
      this.tombola = this.settings.tombola;
      localStorage.setItem('wz_settings',JSON.stringify(this.settings));
    });
  }

  goToTest(){
    //this.router.navigateByUrl('test');
    this.dev_count+=1;
    if(this.dev_count==10){
      this.util.about_dev();
      this.dev_count=0;
    }
  }

  goToMyPoints(){
    this.router.navigateByUrl('/user/recharge-account');
  }

  goTo(url){
    if(url=='product'){
      this.router.navigateByUrl(url);
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
    } else if(url=='tombolas'){
      const navigationExtra : NavigationExtras = {state: {name:"1 mois de jeu à gagner", id:1}};
      this.router.navigateByUrl('tombola/tombola-detail',navigationExtra);
    } else {
      this.router.navigateByUrl('tabs/'+url);
    }
  }

  getTournaments(){
    this.is_loading_tournament=true;
    //this.util.showLoading("loading");
    const opt = {
      should_paginate:false,
      'end_at-get':moment().format("YYYY-MM-DD hh:mm:ss")

    };

    this.api.getList('tournaments',opt).then((d:any)=>{
      this.tournaments =d;
      this.tournament_count = d.length;
      this.is_loading_tournament=false;
      //this.util.hideLoading();
    },q=>{
      //this.util.hideLoading();
      this.is_loading_tournament=false;
      this.util.handleError(q);
    })
  }

  getTombola(){
    //this.util.showLoading("loading");
    const opt = {
      should_paginate:false,
      _agg:'count',
      status:'enable'

    };

    this.api.getList('tombolas',opt).then(d=>{
      this.tombola_count = d;
    },q=>{
      //this.util.hideLoading();
      this.util.handleError(q);
    })

    this.api.getList('offers',opt).then((d:any)=>{
      if(d>0){
        d--;
      }
      this.offer_count = d;
    },q=>{
      //this.util.hideLoading();
      this.util.handleError(q);
    })
  }

  getGames(){
    this.is_loading_games =true;
    //this.util.showLoading("loading");
    const opt = {
      should_paginate:true,
      _sort:'updated_at',
      _sortDir:'desc',
      per_page:9
    };

    this.api.getList('games',opt).then(d=>{
      this.games =d;
      this.is_loading_games =false;
      //this.util.hideLoading();
    },q=>{
      this.is_loading_games =false;
      //this.util.hideLoading();
      this.util.handleError(q);
    })
  }

  goToTournament(p){
    const navigationExtra : NavigationExtras = {state: {name:p.name, id:p.id}};
    this.router.navigateByUrl('tournament/tournament-detail',navigationExtra);
  }

  goToSchedule(){
    if(this.is_user=='true'){
      // reserver une seance de jeu
      this.router.navigateByUrl('schedule');
    } else {
      this.util.doToast("Vous devez être connecté pour pouvoir réserver",3000,'light');
    }
  }

  goToGame(p){
    const navigationExtra : NavigationExtras = {state: {name:"", id:p.id}};
    this.router.navigateByUrl('tabs/game/game-list',navigationExtra);
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
    //this.getTournaments();
    if(this.api.checkUser()){
      this.ionViewWillEnter();
    } else {

    }
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
