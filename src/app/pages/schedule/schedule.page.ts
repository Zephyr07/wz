import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";
import {UtilProvider} from "../../providers/util/util";
import {AlertController, ModalController} from "@ionic/angular";
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

  is_subscription = false;
  id=0;
  title="aze";
  categories:any=[];
  games:any=[];
  old_games:any=[];
  user:any={};
  game:any={};
  duration=0;
  start_at:any;
  phone:any;
  player_number=0;
  game_id=0;
  category_id=0;
  price=2000;
  reduc=0;
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


  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
    public modalController: ModalController,
    public alertController: AlertController
  ) {
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      this.id = this.router.getCurrentNavigation().extras.state.id;
      this.game_id = this.id;
      this.getGame(this.game_id);
            // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.name;
    } else {
      //console.log("pas d'id");
      // pas de jeu, alors chargement de tous le jeux
      this.id=0;
      this.game_id=0;
      this.getCategories();
      this.getGames();
    }
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.settings = JSON.parse(localStorage.getItem("wz_settings"))[0];
    let user = JSON.parse(localStorage.getItem('user_wz'));
    this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
      this.user = a.data.user;
      this.is_subscription = this.api.checkSubscription(this.user.subscription).is_actived;
      localStorage.setItem('user_wz',JSON.stringify(this.user));
    });
  }

  getGame(id){
    const opt = {
      _includes:'category',
    };

    this.api.get('games',id,opt).then((d:any)=>{
      this.game = d;
      this.category_id = d.category_id;
      if(d.category.id==3){
        // vr
        this.price = this.settings.price.vr.h;
        if(this.is_subscription){
          this.price=this.price - this.price*this.settings.price.vr.reduction;
          this.reduc = this.settings.price.vr.reduction;
        }
      } else {
        // ps
        this.price = this.settings.price.ps.h;
        if(this.is_subscription){
          this.price=this.price - this.price*this.settings.price.ps.reduction;
          this.reduc = this.settings.price.ps.reduction;
        }
      }
    })
  }

  getGames(){
    const opt = {
      should_paginate:false,
      _sort:'name',
      _sortDir:'asc',
      _includes:'category'
    };

    this.api.getList('games',opt).then((d:any)=>{
      this.old_games = d;
    },q=>{
      this.util.handleError(q);
    })
  }

  setGames(){
    this.category_id = parseInt(String(this.category_id));
    this.games = _.filter(this.old_games,{category_id:this.category_id});
    if(this.category_id==3){
      // vr
      this.price = this.settings.price.vr.h;
      if(this.is_subscription){
        this.price=this.price - this.price*this.settings.price.vr.reduction;
        this.reduc = this.settings.price.vr.reduction;
      }
    } else {
      // ps
      this.price = this.settings.price.ps.h;
      if(this.is_subscription){
        this.price=this.price - this.price*this.settings.price.ps.reduction;
        this.reduc = this.settings.price.ps.reduction;
      }
    }
  }

  setPrice(){
    if(this.category_id==3){
      // vr
      this.price = this.settings.price.vr.h;
      if(this.is_subscription){
        this.price=this.price - this.price*this.settings.price.vr.reduction;
        this.reduc = this.settings.price.vr.reduction;
      }
    } else {
      // ps
      this.price = this.settings.price.ps.h;
      if(this.is_subscription){
        this.price=this.price - this.price*this.settings.price.ps.reduction;
        this.reduc = this.settings.price.ps.reduction;
      }
    }
  }

  getCategories(){
    const opt = {
      should_paginate:false,
      _sort:'name',
      _sortDir:'asc',
    };

    this.api.getList('categories',opt).then((d:any)=>{
      this.categories = d;
    },q=>{
      this.util.handleError(q);
    })
  }

  booking(){
    this.util.showLoading('initiation_payment');
    // creation du paiement en type account
    const opt = {
      category_id:this.category_id,
      game_id:this.game_id,
      date:this.start_at,
      duration:this.duration,
      player_number:this.player_number,
      user_id:this.user.id,
      reduc:this.reduc
    };
    this.api.post('schedules',opt).then(async (d:any) => {
      this.util.hideLoading();
      this.util.doToast("Reservation enregistrée",3000);
      this.category_id=0;
      this.game_id=0;
      this.user.unit-=this.duration*this.player_number*this.price;
      this.duration=0;
      this.player_number=0;
      this.start_at = undefined;
    },q=>{
      this.util.hideLoading();
      this.util.handleError(q);
    });

  }

  doRefresh(event) {
    this.getGames();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
