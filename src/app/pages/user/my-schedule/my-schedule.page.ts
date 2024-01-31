import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.page.html',
  styleUrls: ['./my-schedule.page.scss'],
})
export class MySchedulePage implements OnInit {

  schedules=[];
  old_schedules=[];
  search="";
  title="";
  user:any;

  constructor(
    private api:ApiProvider,
    private router:Router
  ) {

  }

  ngOnInit() {
    if (this.api.checkUser()) {
      this.user = JSON.parse(localStorage.getItem('user_wz'));
      this.getSchedule(this.user.id);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getSchedule(id){
    const opt = {
      should_paginate:false,
      _sort:'date',
      _sortDir:'asc',
      user_id:id,
      status:"paid",
      _includes:'game'
    };
    console.log(opt);
    this.api.getList('schedules',opt).then((d:any)=>{
      this.old_schedules=d;
      this.schedules=d;
    })
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.schedules = this.old_schedules;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.schedules = this.schedules.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.getSchedule(this.user.id);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
