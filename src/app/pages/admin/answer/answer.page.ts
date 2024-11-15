import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";
import {NavigationExtras, Router} from "@angular/router";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-answer',
  templateUrl: './answer.page.html',
  styleUrls: ['./answer.page.scss'],
})
export class AnswerPage implements OnInit {

  answers:any=[];
  answers_A:any=[];
  answers_R:any=[];
  answers_P:any=[];
  old_answers:any=[];
  old_answers_A:any=[];
  old_answers_P:any=[];
  old_answers_R:any=[];
  search="";
  id=0;
  filter='tout';
  is_loading=true;
  isOwner=false;

  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
    private alertController : AlertController
  ) {

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getProblems();
  }

  getProblems(id?){
    this.answers_A=[];
    this.answers_R=[];
    this.answers_P=[];
    const opt ={
      should_paginate:false,
      _sort:"created_at",
      _sortDir:'desc'
    };
    if(id){
      opt['user_id'] = id;
    }
    this.api.getList('answersA',opt).then((d:any)=>{
      d.forEach(v=>{
        if(v.status=='enable'){
          this.answers_A.push(v);
        } else if(v.status=='pending'){
          this.answers_P.push(v);
        } else {
          this.answers_R.push(v);
        }
      });
      this.answers = d;
      this.old_answers = d;
      this.old_answers_A = this.answers_A;
      this.old_answers_P = this.answers_P;
      this.old_answers_R = this.answers_R;
      this.is_loading=false;
    },q=>{
      this.is_loading=false;
      this.util.handleError(q);
    })
  }

  switchGender(t){
    this.filter=t;
    if(t=='tout'){
      this.answers = this.old_answers;
    } else if(t=='pending'){
      this.answers = this.old_answers_P;
    } else if(t=='enable'){
      this.answers = this.old_answers_A
    } else {
      this.answers = this.old_answers_R
    }
  }

  async showModal(a){
    const alert = await this.alertController.create({
      header: 'Approuver la réponse ?',
      message : a.content.substring(0,50),
      buttons: [
        {
          text: 'Approuver',
          handler: () => {
            this.updateAnswer(a,'enable');
          },
        },
        {
          text: 'Rejeter',
          handler: () => {
            this.updateAnswer(a,'rejected');
          },
        },
      ],
    });

    await alert.present();
  }

  updateAnswer(a,status){
    a.status=status;
    this.api.put('answers',a.id,a).then(d=>{
      this.util.doToast('Status mis à jour',1000,'tertiary');
    },q=>{
      this.util.handleError(q);
    });
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.answers = this.old_answers;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.answers = this.answers.filter((item) => {
        return (item.content.toLowerCase().indexOf(val.toLowerCase()) > -1);
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
