import { Component, OnInit } from '@angular/core';
import {NUMBER_RANGE} from "../../services/contants";
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";
import {ModalController, Platform} from "@ionic/angular";
import {UtilProvider} from "../../providers/util/util";

@Component({
  selector: 'app-modal-add-stockist',
  templateUrl: './modal-add-stockist.component.html',
  styleUrls: ['./modal-add-stockist.component.scss'],
})
export class ModalAddStockistComponent implements OnInit {

  is_image=false;

  MIN = NUMBER_RANGE.min;
  MAX = NUMBER_RANGE.max;

  towns:any=[];
  district = null;
  name = null;
  locality = null;
  town_id = 0;
  phone:any = null;
  user:any;
  titre="new_stockist";
  code="";

  itemsTown:any=[];
  town:any={};

  options={
    header: 'Catégorie',
    subHeader: 'Select your favorite color',
  };
  d = new Date();
  min_date = "";

  constructor(
    private api:ApiProvider,
    private router: Router,
    private platform:Platform,
    private util:UtilProvider,
    private modalController:ModalController,
  ) {
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_lr'));

    } else{
      this.router.navigate(['/login']);
    }

    let m = "", j="";
    if(this.d.getMonth()+1<10){
      m="0"+(this.d.getMonth()+1);
    } else {
      m=""+this.d.getMonth()+1;
    }

    if(this.d.getDate()<10){
      j="0"+this.d.getDate();
    } else {
      j=""+this.d.getDate();
    }
    this.min_date = this.d.getFullYear()+'-'+m+"-"+j;
  }

  ngOnInit() {
    this.getTowns();

  }

  getTowns(){
    const opt ={
      should_paginate:false,
      _sort:'district',
      _sortDir:'asc'
    };
    this.api.getList('towns',opt).then(d=>{
      this.towns=d;
    },q=>{
      this.util.handleError(q);
    })
  }
  

  save(){
    if(this.checkForm()){

      const p = {
        district:this.district,
        name:this.name,
        locality:this.locality,
        code:this.code,
        status:"enable",
        phone:this.phone,
        town_id:this.town_id,
        user_id:this.user.id
      };

      if(this.user.phone=='696870700' || this.user.phone=='693051450'){
        p.status='enable';
      }

      this.api.post('stockists',p).then(d=>{
        this.util.doToast('stockist_save',3000);
        this.dismiss('create-stockist');
      },q=>{
        this.util.handleError(q);
      })
    }
  }

  checkForm(){
    if(this.district==""){
      this.util.doToast("district_empty",3000, 'warning');
      return false;
    } else if(this.name==""){
      this.util.doToast("name_empty",3000, 'warning');
      return false;
    } else if(this.district==""){
      this.util.doToast("district_empty",3000, 'warning');
      return false;
    } else if (this.phone == 0 || this.phone==undefined){
      this.util.doToast("phone_empty",3000, 'warning');
      return false;
    } else if (this.phone < this.MIN || this.phone>this.MAX){
      this.util.doToast("bad_range_phone",3000, 'warning');
      return false;
    } else {
      return true;
    }
  }

  dismiss(s) {
    this.modalController.dismiss(s);
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data

  }

  doRefresh(event) {

    this.getTowns();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
