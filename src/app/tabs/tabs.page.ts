import { Component } from '@angular/core';
import {ApiProvider} from "../providers/api/api";
import * as moment from 'moment';
import {UtilProvider} from "../providers/util/util";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  tournament:any = 0;
  tombola:any = 0;
  constructor(
    private api:ApiProvider,
    private router:Router,
    private util:UtilProvider
  ) {
    this.getTournaments();
    this.getTombola();
  }

  getTournaments(){
    //this.util.showLoading("loading");
    const opt = {
      should_paginate:false,
      _agg:'count',
      'end_at-get':moment().format("YYYY-MM-DD hh:mm:ss")

    };

    this.api.getList('tournaments',opt).then(d=>{
      this.tournament = d;
    },q=>{
      //this.util.hideLoading();
      this.util.handleError(q);
    })
  }

  getTombola(){
    //this.util.showLoading("loading");
    const opt = {
      should_paginate:false,
      _agg:'count',
      status:'enable'

    };

    this.api.getList('tombolas',opt).then(d=>{
      this.tombola = d;
    },q=>{
      //this.util.hideLoading();
      this.util.handleError(q);
    })
  }

  test(){
    this.router.navigateByUrl('/test');
  }
}
