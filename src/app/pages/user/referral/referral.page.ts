import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";
import {COMMISSION} from "../../../services/contants";
import * as _ from "lodash";

@Component({
  selector: 'app-referral',
  templateUrl: './referral.page.html',
  styleUrls: ['./referral.page.scss'],
})
export class ReferralPage implements OnInit {
  user:any={};
  is_loading=true;
  users=[];
  unpaid_commissions=[];
  commissions=[];
  COMMISSION=COMMISSION;
  col1=6;
  col2=6;
  col3=6;
  amount=0;

  constructor(
    private api:ApiProvider,
    private util:UtilProvider
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_lr'));
      this.getUsers();
      this.getCommissions();
    } else{
      // pas connecté
    }
  }

  getCommissions(){
    const opt={
      should_paginate: false,
      _sort:'created_at',
      _sortDir:"desc",
      _includes:'payment.subscription.user,payment.subscription.pack',
      user_id:this.user.id
    };

    this.api.getList('commissions',opt).then((d:any)=>{
      this.unpaid_commissions = _.filter(d,{'status':'unpaid'});
      this.commissions = d;
      if(this.unpaid_commissions.length>0){
        this.col1=3;
        this.col2=4;
        this.col3=5;
        this.unpaid_commissions.forEach(v=>{
          this.amount+=v.price;
        });
      } else {
        this.col1=6;
        this.col2=6;
      }
    },q=>{
      this.util.handleError(q);
    })
  }

  getUsers(){
    this.is_loading=true;
    const opt = {
      referral:this.user.sponsor_code,
      _sort:'created_at',
      _sortDir:'desc',
      _includes:'partner,country',
      should_paginate:false
    };

    this.api.getList('users',opt).then((d:any)=>{
      this.users = d;
      this.is_loading=false;
    }, q=>{
      this.util.handleError(q);
    })
  }

  showCommission(){
    document.getElementById('open-modal').click();
  }

  doRefresh(event) {
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_lr'));
      this.getUsers();
      this.getCommissions();
      this.amount = 0;
    } else{
      // pas connecté
    }

    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
