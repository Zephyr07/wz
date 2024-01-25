import { Component } from '@angular/core';
import {ApiProvider} from "../providers/api/api";
import * as moment from 'moment';
import {UtilProvider} from "../providers/util/util";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  tournament:any = 0;
  constructor(
    private api:ApiProvider,
    private util:UtilProvider
  ) {
    this.getTournaments()
  }

  getTournaments(){
    //this.util.showLoading("loading");
    const opt = {
      should_paginate:false,
      _agg:'count',
      'start_at-get':moment().format("YYYY-MM-DD hh:mm:ss")

    };

    this.api.getList('tournaments',opt).then(d=>{
      this.tournament = d;
    },q=>{
      //this.util.hideLoading();
      this.util.handleError(q);
    })
  }
}
