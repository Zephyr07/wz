import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  count_a=0;
  count_q=0;

  constructor(
    private api:ApiProvider,
    private util:UtilProvider,
    private router:Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getCountAnswer();
    this.getCountQuestion();
  }

  answers(){
    this.router.navigateByUrl('admin/answer');
  }

  problems(){
    this.router.navigateByUrl('admin/problem');
  }

  getCountAnswer(){
    const opt = {
      status:'pending',
      _agg:'count',
      should_paginate:false
    };

    this.api.getList('answersA',opt).then((d:any)=>{
      this.count_a=d;
    },q=>{
      this.util.handleError(q);
    })
  }

  getCountQuestion(){
    const opt = {
      status:'pending',
      _agg:'count',
      should_paginate:false
    };

    this.api.getList('questions',opt).then((d:any)=>{
      this.count_q=d;
    },q=>{
      this.util.handleError(q);
    })
  }
}
