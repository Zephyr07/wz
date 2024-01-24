import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {ModalController} from "@ionic/angular";
import {UtilProvider} from "../../../providers/util/util";

@Component({
  selector: 'app-demand',
  templateUrl: './demand.page.html',
  styleUrls: ['./demand.page.scss'],
})
export class DemandPage implements OnInit {
  stockists:any=[];
  promotions:any=[];
  questions:any=[];
  seminars:any=[];
  user:any={};
  is_loading=true;
  constructor(
    private modalController:ModalController,
    private api:ApiProvider,
    private util: UtilProvider
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_lr'));
      this.getStockist();
      this.getSeminar();
      this.getPromotion();
      this.getQuestion();
    } else{
      // pas connecté
    }
  }

  getPromotion(){
    this.is_loading=true;
    const opt = {
      user_id:this.user.id,
      _sort:'created_at',
      _sortDir:'desc',
      should_paginate:false
    }

    this.api.getList('promotions',opt).then((d:any)=>{
      this.promotions = d;
      this.is_loading=false;
    }, q=>{
      this.is_loading=false;
      this.util.handleError(q);
    })
  }

  getSeminar(){
    this.is_loading=true;
    const opt = {
      user_id:this.user.id,
      _sort:'created_at',
      _sortDir:'desc',
      should_paginate:false
    }

    this.api.getList('seminars',opt).then((d:any)=>{
      this.seminars = d;
      this.is_loading=false;
    }, q=>{
      this.is_loading=false;
      this.util.handleError(q);
    })
  }

  getQuestion(){
    this.is_loading=true;
    const opt = {
      user_id:this.user.id,
      _sort:'created_at',
      _sortDir:'desc',
      should_paginate:false
    }

    this.api.getList('questions',opt).then((d:any)=>{
      this.questions = d;
      this.is_loading=false;
    }, q=>{
      this.is_loading=false;
      this.util.handleError(q);
    })
  }

  getStockist(){
    this.is_loading=true;
    const opt = {
      user_id:this.user.id,
      _sort:'created_at',
      _sortDir:'desc',
      should_paginate:false
    }

    this.api.getList('stockists',opt).then((d:any)=>{
      this.stockists = d;
      this.is_loading=false;
    }, q=>{
      this.is_loading=false;
      this.util.handleError(q);
    })
  }

  doRefresh(event) {
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user'));
      this.getStockist();
      this.getSeminar();
      this.getPromotion();
      this.getQuestion();
    } else{
      // pas connecté
    }

    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

  deleteSeminar(s){
    this.api.remove('seminars',s.id).then(d=>{
      this.getSeminar();
      this.util.doToast("seminar_delete",2000);
    })
  }
  
  deletePromotion(s){
    this.api.remove('promotions',s.id).then(d=>{
      this.getPromotion();
      this.util.doToast("promotion_delete",2000);
    })
  }

  deleteQuestion(s){
    this.api.remove('questions',s.id).then(d=>{
      this.getQuestion();
      this.util.doToast("question_delete",2000);
    })
  }
  
  deleteStockist(s){
    this.api.remove('stockists',s.id).then(d=>{
      this.getStockist();
      this.util.doToast("stockist_delete",2000);
    })
  }

}
