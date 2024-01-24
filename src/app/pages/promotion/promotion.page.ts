import {Component, OnInit, ViewChild} from '@angular/core';
import {IonModal, ModalController} from "@ionic/angular";
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import * as moment from "moment";
import {ModalAddPromotionComponent} from "../../components/modal-add-promotion/modal-add-promotion.component";
import * as _ from "lodash";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.page.html',
  styleUrls: ['./promotion.page.scss'],
})
export class PromotionPage implements OnInit {
  @ViewChild('modalDetail') modal: IonModal;
  promotions=[];
  old_promotions=[];
  promotion:any={
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
    private router : Router
  ) {
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      let id= this.router.getCurrentNavigation().extras.state.id;
      // alors un promotion est là
      this.getPromotion(id);
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.title;
    } else {

    }
  }

  ngOnInit() {
    this.getPromotions();
  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user = JSON.parse(localStorage.getItem('user_lr'));
    } else {

    }
  }

  getPromotion(id){
    const opt = {
      _includes:'country',
    };

    this.api.get('promotions',id,opt).then((d:any)=>{
      if(d.image.split('default').length>1){
        // pas d'image
        // attribution image par defaut
        d.image=null;
      } else {

      }
      if(d.file.split('default.jpg').length>1){
        // pas de fichier
        // attribution image par defaut
        d.file=null;
      } else {
      }
      this.promotion = d;
      document.getElementById('open-modal').click();
    },q=>{
      this.util.handleError(q);
    })
  }

  getPromotions(){
    this.is_loading=true;
    const opt = {
      should_paginate:false,
      _sort:'created_at',
      _sortDir:'desc',
      _includes:'country',
      status:"enable"
    };

    this.api.getList('promotions',opt).then((d:any)=>{
      d.forEach(v=>{
        v.search = v.title+" "+v.country.name;
        if(v.image.split('default').length>1){
          // pas d'image
          // attribution image par defaut
          v.image=null;
        } else {

        }
        if(v.file.split('default.jpg').length>1){
          // pas de fichier
          // attribution image par defaut
          v.file=null;
        } else {
        }
      });
      this.old_promotions=d;
      this.promotions=d;
      this.is_loading=false;
    },q=>{
      this.util.handleError(q);
    })
  }

  async newPromotion(o?:any){
    if(this.api.checkUser()){
      this.modal.setCurrentBreakpoint(0);
      const modal = await this.modalController.create({
        component: ModalAddPromotionComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'objet': o
        }
      });
      return await modal.present();
    } else {
      this.util.loginModal();
    }

  }



  goTo(s){
    document.getElementById('open-modal').click();
    this.promotion = s;
  }

  closeModal(){
    this.modal.setCurrentBreakpoint(0);
  }
  call(){
    window.open("tel:+237"+this.promotion.phone);
  }

  link(){
    window.location.href=this.promotion.link;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.promotions = this.old_promotions;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.promotions = this.promotions.filter((item) => {
        return (item.search.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.getPromotions();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
