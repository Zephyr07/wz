import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import {ModalController} from "@ionic/angular";
import {ModalAddQuestionComponent} from "../../components/modal-add-question/modal-add-question.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  questions:any=[];
  old_questions:any=[];
  search="";
  is_loading_answer=true;
  is_loading=true;
  answer="";

  NOT_LOGGED_TITLE="";
  NOT_LOGGED_CONTENT="";
  SIGNIN="";

  user:any={};


  constructor(
    private api : ApiProvider,
    private util: UtilProvider,
    private modalController : ModalController,
    private translate:TranslateService
  ) {
    this.translate.get('not_logged_title').subscribe( (res: string) => {
      this.NOT_LOGGED_TITLE=res;
    });
    this.translate.get('not_logged_content').subscribe( (res: string) => {
      this.NOT_LOGGED_CONTENT=res;
    });
    this.translate.get('signin').subscribe( (res: string) => {
      this.SIGNIN=res;
    });
  }

  ngOnInit() {
    this.getQuestions();
  }

  ionViewWillEnter() {
    if (this.api.checkUser()) {
      this.user = JSON.parse(localStorage.getItem('user_wz'));
    }
  }

  getQuestions(){
    const opt = {
      should_paginate:false,
      _sort:'created_at',
      _sortDir:'desc',
      status:'enable'
    };

    this.api.getList('questions',opt).then(d=>{
      this.old_questions = d;
      this.questions = d;
      this.is_loading=false;
    }, q=>{
      this.util.handleError(q);
    })
  }

  async newQuestion() {
    if (this.api.checkUser()) {
      const modal = await this.modalController.create({
        component: ModalAddQuestionComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'objet': {}
        }
      });
      return await modal.present();
    } else {
      this.util.showModal(this.NOT_LOGGED_TITLE, this.NOT_LOGGED_CONTENT, this.SIGNIN, 'login')
    }
  }

  showAnswer(q){
    if(q.answers==null){
      const opt = {
        question_id:q.id,
        _sort:'updated_at',
        _sortDir:'desc',
        _includes:'user.person',
        status:'enable'
      };

      this.api.getList('answers',opt).then(d=>{
        this.is_loading_answer=false;
        q.answers=d;
      })
    }

  }

  addAnswer(q){
    if(this.api.checkUser()){
      if(this.answer!=""){
        let user = JSON.parse(localStorage.getItem('user_wz'));
        const opt = {
          question_id:q.id,
          user_id:user.id,
          content:this.answer,
          status:"pending"
        };
        this.api.post('answers',opt).then(d=>{
          this.util.doToast('answer_save',5000);
          this.answer="";
        }, q=>{
          this.util.handleError(q);
        })
      } else {
        this.util.doToast("answer_empty",3000, 'warning')
      }

    } else {
      // not logged
      this.util.showModal(this.NOT_LOGGED_TITLE, this.NOT_LOGGED_CONTENT, this.SIGNIN, 'login')
    }
    // verification s'il est connecté

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
    this.getQuestions();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
