import {Component, OnInit} from '@angular/core';
import {UtilProvider} from "../../../providers/util/util";
import {ApiProvider} from "../../../providers/api/api";
import {Router} from "@angular/router";
import * as moment from 'moment';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  statut="";
  is_loading=true;
  subscription:any={
    pack:{}
  };
  user:any={};
  subscription_status:any={};
  
  constructor(
    private api:ApiProvider,
    private util:UtilProvider,
    private router:Router
  ) {
    //moment.locale('fr');
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_lr'));
      this.subscription_status=this.api.checkSubscription(this.user.subscription);
      this.getSubscriptions();
    } else{
      // pas connecté
    }
  }

  getSubscriptions(){
    this.is_loading=true;
    const opt = {
      user_id:this.user.id,
      should_paginate:false,
      _sort:'id',
      _sortDir:'desc',
      _includes:'pack'
    };

    this.api.getList('subscriptions',opt).then((d:any)=>{
      if(d.length>0){
        d[d.length-1].expiration_date=moment(d[d.length-1].created_at).add(d[d.length-1].duration,'month').format('DD MMMM YYYY à HH:mm');
        this.subscription = d[d.length-1];
        this.subscription_status=this.api.checkSubscription(d[d.length-1]);
      }
      this.is_loading=false;
    }, q=>{
      this.is_loading=false;
      this.util.handleError(q);
    })
  }

  doRefresh(event) {
    this.getSubscriptions();

    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
  goToSubscription(){
    this.router.navigateByUrl('user/pack');
  }

}
