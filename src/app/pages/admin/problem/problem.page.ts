import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-problem',
  templateUrl: './problem.page.html',
  styleUrls: ['./problem.page.scss'],
})
export class ProblemPage implements OnInit {

  questions:any=[];
  questions_A:any=[];
  questions_R:any=[];
  questions_P:any=[];
  old_questions:any=[];
  old_questions_A:any=[];
  old_questions_P:any=[];
  old_questions_R:any=[];
  search="";
  id=0;
  filter='tout';
  is_loading=true;
  isOwner=false;

  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getProblems();
  }

  getProblems(id?){
    this.questions_A=[];
    this.questions_R=[];
    this.questions_P=[];
    const opt ={
      should_paginate:false,
      _sort:"created_at",
      _sortDir:'desc'
    };
    if(id){
      opt['user_id'] = id;
    }
    this.api.getList('questions',opt).then((d:any)=>{
      d.forEach(v=>{
        if(v.status=='enable'){
          this.questions_A.push(v);
        } else if(v.status=='pending'){
          this.questions_P.push(v);
        } else {
          this.questions_R.push(v);
        }
      });
      this.questions = d;
      this.old_questions = d;
      this.old_questions_A = this.questions_A;
      this.old_questions_P = this.questions_P;
      this.old_questions_R = this.questions_R;
      this.is_loading=false;
    },q=>{
      this.is_loading=false;
      this.util.handleError(q);
    })
  }

  switchGender(t){
    this.filter=t;
    if(t=='tout'){
      this.questions = this.old_questions;
    } else if(t=='pending'){
      this.questions = this.old_questions_P;
    } else if(t=='enable'){
      this.questions = this.old_questions_A
    } else {
      this.questions = this.old_questions_R
    }
  }

  goToDetailProblem(p){
    const navigationExtra : NavigationExtras = {state: {name:"", id:p.id}};
    this.router.navigateByUrl('admin/problem/problem-detail',navigationExtra);
  }

  newProblem(){
    if(this.api.checkUser()){
      this.router.navigateByUrl('problem/problem-add');
    } else {
      this.util.doToast('Vous devez être connecté pour poser votre probème',3000,'warning');
      this.router.navigateByUrl('login');
    }
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.questions = this.old_questions;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.questions = this.questions.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
