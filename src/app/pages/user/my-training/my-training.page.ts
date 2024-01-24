import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-my-training',
  templateUrl: './my-training.page.html',
  styleUrls: ['./my-training.page.scss'],
})
export class MyTrainingPage implements OnInit {
  
  training_users=[];
  old_training_users=[];
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
      this.user = JSON.parse(localStorage.getItem('user_lr'));
      this.getTrainingUsers(this.user.id);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToTraining(m){
    const navigationExtra : NavigationExtras = {state: {title:m.title, id:m.id}};
    this.router.navigateByUrl('training/module',navigationExtra);
  }

  getTrainingUsers(id){
    const opt = {
      should_paginate:false,
      _sort:'title',
      _sortDir:'asc',
      user_id:id,
      status:"active",
      _includes:'training'
    };

    this.api.getList('training_users',opt).then((d:any)=>{
      this.old_training_users=d;
      this.training_users=d;
    })
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.training_users = this.old_training_users;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.training_users = this.training_users.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.getTrainingUsers(this.user.id);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
