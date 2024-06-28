import {Component, OnInit, ViewChild} from '@angular/core';
import {IonModal, ModalController} from "@ionic/angular";
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";
import {NavigationExtras, Router} from "@angular/router";
import * as _ from "lodash";
import {AdmobProvider} from "../../../providers/admob/AdmobProvider";

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.page.html',
  styleUrls: ['./game-list.page.scss'],
})
export class GameListPage implements OnInit {

  @ViewChild('modalDetail') modal: IonModal;
  games=[];
  old_games=[];
  game:any={
    town:{}
  };
  name="";
  user:any={};
  search="";
  is_loading=true;
  is_user=false;
  private category_id=0;

  constructor(
    private api:ApiProvider,
    private util:UtilProvider,
    private modalController:ModalController,
    private router:Router,
    private admob:AdmobProvider
  ) {
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      let id = this.router.getCurrentNavigation().extras.state.id;
      if(id){
        this.getGame(id);
      }
      // @ts-ignore
      let category_id = this.router.getCurrentNavigation().extras.state.category_id;
      this.category_id = category_id;
      if(category_id){
        this.getGames(category_id)
      }
      // @ts-ignore
      this.name= this.router.getCurrentNavigation().extras.state.name;

    } else {

    }
  }

  ngOnInit() {

  }

  ionViewWillLeave(){
    let settings = JSON.parse(localStorage.getItem('wz_settings'));
    if(settings.pub=='enable'){
      this.admob.hideBanner();
    }
  }

  ionViewWillEnter(){
    let settings = JSON.parse(localStorage.getItem('wz_settings'));
    if(settings.pub=='enable'){
      this.admob.showBanner('bottom',0);
    }
    if(this.api.checkUser()){
      this.user = JSON.parse(localStorage.getItem('user_wz'));
      this.is_user=true;
    } else {
      this.is_user=false;
    }
  }

  getGame(id){
    const opt = {
      _includes:'category',
    };

    this.api.get('games',id,opt).then((d:any)=>{
      this.game = d;
      this.category_id = d.category_id;
      this.name = d.category.name;
      this.getGames(d.category_id);
      document.getElementById('open-modal').click();
    })
  }

  getGames(category_id){
    this.is_loading = true;
    const opt = {
      should_paginate:false,
      category_id,
      _sort:'name',
      _sortDir:'asc',
      _includes:'category'
    };

    this.api.getList('games',opt).then((d:any)=>{
      d.forEach(v=>{
        v.search = v.name+" "+v.description;
        v.video_url = v.video_url.replace('watch?v=','embed/');
      });
      this.old_games=d;
      this.games = d;
      this.is_loading=false;
    },q=>{
      this.util.handleError(q);
    })
  }

  goTo(s){
    document.getElementById('open-modal').click();
    this.game = s;
  }

  closeModal(){
    this.modal.setCurrentBreakpoint(0);
  }
  schedule(){
    if(this.is_user){
      // reserver une seance de jeu
      const navigationExtra : NavigationExtras = {state: {name:this.game.name, id:this.game.id}};
      this.router.navigateByUrl('schedule',navigationExtra);
      this.closeModal();
    } else {
      this.util.doToast("Vous devez être connecté pour pouvoir réserver",3000,'light');
    }

  }

  link(){
    window.location.href=this.game.link;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.games = this.old_games;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.games = this.games.filter((item) => {
        return (item.search.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.is_loading=true;
    this.getGames(this.category_id);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
