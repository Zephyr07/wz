import {Component, OnInit, ViewChild} from '@angular/core';
import {IonModal} from "@ionic/angular";
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";
import {NavigationExtras, Router} from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: 'app-module',
  templateUrl: './module.page.html',
  styleUrls: ['./module.page.scss'],
})
export class ModulePage implements OnInit {
  id=0;
  modules=[];
  old_modules=[];
  search="";
  title="";

  is_loading=true;

  constructor(
    private api:ApiProvider,
    private router:Router,
    private util:UtilProvider
  ) {
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      this.id= this.router.getCurrentNavigation().extras.state.id;
      this.getModules(this.id);
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.title;
    } else {
      //console.log("pas d'id");
      this.id=1;
      this.getModules(this.id);
    }
  }

  ngOnInit() {

  }

  goToChapter(m){
    const navigationExtra : NavigationExtras = {state: {title:m.title, id:m.id}};
    this.router.navigateByUrl('training/module/chapter',navigationExtra);
  }

  getModules(id){
    this.is_loading=true;
    const opt = {
      should_paginate:false,
      _sort:'order',
      _sortDir:'asc',
      training_id:id,
      status:"enable"
    };

    this.api.getList('modules',opt).then((d:any)=>{
      this.old_modules=d;
      this.modules=d;
      this.is_loading=false;
    },q=>{
      this.util.handleError(q);
    })
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.modules = this.old_modules;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.modules = this.modules.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.getModules(this.id);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
