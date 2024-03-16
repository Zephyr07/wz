import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {NavigationExtras, Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {UtilProvider} from "../../providers/util/util";

@Component({
  selector: 'app-tombola',
  templateUrl: './tombola.page.html',
  styleUrls: ['./tombola.page.scss'],
})
export class TombolaPage implements OnInit {

  tombolas:any=[];

  is_loading=true;

  constructor(
    private api:ApiProvider,
    private router:Router,
    private modalController:ModalController,
    private util:UtilProvider
  ) { }

  ngOnInit() {
    this.getTombolas();
  }

  getTombolas(){
    this.is_loading=true;
    const opt = {
      should_paginate:false,
      _sort:'name',
      _sortDir:'asc',
      status:'enable'
    };

    this.api.getList('tombolas',opt).then((d:any)=>{
      this.tombolas = d;
      this.is_loading=false;
    },q=>{
      this.util.handleError(q);
    })
  }

  goTo(p){
    const navigationExtra : NavigationExtras = {state: {name:p.name, id:p.id}};
    this.router.navigateByUrl('tombola/tombola-detail',navigationExtra);
  }

  doRefresh(event) {
    this.getTombolas();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
