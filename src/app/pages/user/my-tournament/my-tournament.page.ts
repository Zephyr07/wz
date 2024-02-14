import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-my-tournament',
  templateUrl: './my-tournament.page.html',
  styleUrls: ['./my-tournament.page.scss'],
})
export class MyTournamentPage implements OnInit {

  subscriptions=[];
  old_subscriptions=[];
  search="";
  title="";
  user:any;
  is_loading = true;

  constructor(
    private api:ApiProvider,
    private router:Router
  ) {

  }

  ngOnInit() {
    if (this.api.checkUser()) {
      this.user = JSON.parse(localStorage.getItem('user_wz'));
      this.getSubscription(this.user.id);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToTournament(m){
    const navigationExtra : NavigationExtras = {state: {name:m.name, id:m.id}};
    this.router.navigateByUrl('tournament/tournament-detail',navigationExtra);
  }

  getSubscription(id){
    const opt = {
      should_paginate:false,
      _sort:'name',
      _sortDir:'asc',
      user_id:id,
      state:"paid",
      _includes:'tournament'
    };

    this.api.getList('participants',opt).then((d:any)=>{
      this.old_subscriptions=d;
      this.subscriptions=d;
      this.is_loading=false;
    })
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.subscriptions = this.old_subscriptions;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.subscriptions = this.subscriptions.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.getSubscription(this.user.id);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
