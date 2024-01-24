import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {ApiProvider} from "../../providers/api/api";
import * as _ from "lodash";
import {ModalAddStockistComponent} from "../../components/modal-add-stockist/modal-add-stockist.component";
import {UtilProvider} from "../../providers/util/util";
import {ModalController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-stockist',
  templateUrl: './stockist.page.html',
  styleUrls: ['./stockist.page.scss'],
})
export class StockistPage implements OnInit {
  is_loading = true;
  towns:any=[];
  stockists:any=[];
  old_stockists:any=[];
  texte:any="";
  search:any="";
  town:any={};
  town_id:any=0;

  FROM="";

  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
    private modalController:ModalController,
    private translate :TranslateService
  ) {
    this.translate.get('from').subscribe( (res: string) => {
      this.FROM=res;
    })
  }

  ngOnInit() {
    this.getTowns();
  }

  ionViewWillEnter(){
    this.getStockists();
  }

  getStockists(town_id?){
    this.is_loading=true;
    const opt = {
      should_paginate:false,
      _sort:'name',
      _sortDir:'asc',
      _includes: 'town',
      status:'enable',
      town_id:0
    };

    if(town_id){
      opt.town_id =town_id;
    } else {
      delete opt.town_id;
    }

    this.api.getList('stockists',opt).then((c:any)=>{
      this.is_loading=false;
      c.forEach(v=>{
        if(v.town==undefined){
          v.town = {
            name:''
          };
        }
        v.search = v.name+" "+v.phone+" "+v.locality+" "+v.district;
      });
      this.stockists = c;
      this.old_stockists = c;
    },q=>{
      this.util.handleError(q);
    })
  }

  goToStockist(c){
    const navigationExtra : NavigationExtras = {state: {name:c.name, id:c.id}};
    this.router.navigateByUrl('place',navigationExtra);
  }

  async newStockist(o?:any){
    if(this.api.checkUser()){
      const modal = await this.modalController.create({
        component: ModalAddStockistComponent,
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
  
  getTowns(){
    const opt = {
      should_paginate:false,
      _sort:'name',
      _sortDir:'asc',
    };

    this.api.getList('towns',opt).then(c=>{
      this.towns = c;
    },q=>{
      this.util.handleError(q);
    })
  }

  setTown(e){
    if(e.target.value!=0){
      this.town = _.filter(this.towns,{id:parseInt(this.town_id)})[0];
      this.texte = this.FROM+" "+ this.town.name;
      this.getStockists(e.target.value)
    } else {
      this.getStockists();
    }
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.stockists = this.old_stockists;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.stockists = this.stockists.filter((item) => {
        return (item.search.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.getStockists();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
