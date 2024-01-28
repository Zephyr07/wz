import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {NavigationExtras, Router} from "@angular/router";
import {UtilProvider} from "../../providers/util/util";
import {ModalAddPromotionComponent} from "../../components/modal-add-promotion/modal-add-promotion.component";
import {ModalController} from "@ionic/angular";
import {ModalAddTournamentComponent} from "../../components/modal-add-tournament/modal-add-tournament.component";
import * as moment from "moment";

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.page.html',
  styleUrls: ['./tournament.page.scss'],
})
export class TournamentPage implements OnInit {
  can_add_tournament = false;
  tournaments:any=[];
  old_tournaments:any=[];
  search="";

  is_loading=true;

  constructor(
    private api:ApiProvider,
    private router:Router,
    private modalController:ModalController,
    private util:UtilProvider
  ) { }

  ngOnInit() {
    if(this.api.checkUser()){
      let user=JSON.parse(localStorage.getItem('user_wz'));
      //this.phone=this.user.phone;
      if(user.phone=='696870700'){
        this.can_add_tournament = true;
      }
    }
    this.getTournaments();
  }

  getTournaments(){
    this.is_loading=true;
    const opt = {
      should_paginate:false,
      _sort:'start_at',
      _sortDir:'desc',
    };

    this.api.getList('tournaments',opt).then((d:any)=>{
      d.forEach(v=>{
        v.search = v.name+" "+v.locality;
        let d = moment(v.start_at).utc();
        v.heure = d.format('H') + 'h' + d.format('mm');
        v.jour = d.format('DD');
        v.mois = d.format('MMM');
      });
      this.old_tournaments = d;
      this.tournaments = d;
      this.is_loading=false;
    },q=>{
      this.util.handleError(q);
    })
  }

  goTo(p){
    const navigationExtra : NavigationExtras = {state: {name:p.name, id:p.id}};
    this.router.navigateByUrl('tournament/tournament-detail',navigationExtra);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.tournaments = this.old_tournaments;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.tournaments = this.tournaments.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  async newTournament(){
    if(this.api.checkUser()){
      const modal = await this.modalController.create({
        component: ModalAddTournamentComponent,
        cssClass: 'my-custom-class'
      });
      return await modal.present();
    } else {

    }
  }

  doRefresh(event) {
    this.getTournaments();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
