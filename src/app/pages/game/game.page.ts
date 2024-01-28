import {Component, OnInit, ViewChild} from '@angular/core';
import {IonModal, ModalController} from "@ionic/angular";
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import {Router} from "@angular/router";
import * as moment from "moment";
import * as _ from "lodash";

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  @ViewChild('modalDetail') modal: IonModal;
  games=[];
  old_games=[];
  game:any={
    town:{}
  };

  is_participation = false;
  user:any={};
  search="";
  is_loading=true;

  constructor(
    private api:ApiProvider,
    private util:UtilProvider,
    private modalController:ModalController,
    private router:Router
  ) {
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      let id = this.router.getCurrentNavigation().extras.state.id;
      // alors un seminaire est là
      this.getGame(id);
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.title;
    } else {

    }
  }

  ngOnInit() {
    this.getGames();
  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user = JSON.parse(localStorage.getItem('user_lr'));
    } else {

    }
  }

  getGame(id){
    const opt = {
      _includes:'category',
    };

    this.api.get('games',id,opt).then((d:any)=>{
      let da = moment(d.start_at).utc();
      d.heure = da.format('H') + 'h' + da.format('mm');
      d.jour = da.format('DD');
      d.mois = da.format('MMM');
      d.participant = d.participants.length;
      this.game = d;
      document.getElementById('open-modal').click();
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
      d.forEach(v=>{
        v.search = v.name+" "+v.description;
        v.video_url = v.video_url.replace('watch?v=','embed/');
      });
      this.old_games=d;
      this.games = _.filter(d,{category_id:2});
      this.is_loading=false;
    },q=>{
      this.util.handleError(q);
    })
  }

  filterGame(id){
    this.games = _.filter(this.old_games,{category_id:id});
  }

  participer(id){
    if(this.api.checkUser()){
      let user = JSON.parse(localStorage.getItem('user_lr'));
      const opt = {
        game_id:id,
        user_id:user.id
      };

      this.api.post('participants',opt).then((d:any)=>{
        this.is_participation=true;
        this.util.doToast("participation_save",3000);
        this.game.participant++;
      },q=>{
        this.util.handleError(q);
      })
    } else {
      this.util.loginModal();
    }
  }

  removeParticipation(id){
    const opt = {
      game_id:id,
      user_id:this.user.id
    };

    this.api.getList('participants',opt).then((d:any)=>{
      d[0].remove().then(a=>{
        this.is_participation=false;
        this.game.participant--;
        this.util.doToast("participation_cancel",3000);
      })
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
    // reserver une seance de jeu
    this.closeModal();
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
    this.getGames();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
