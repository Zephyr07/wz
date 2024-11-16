import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";
import {NavigationExtras, Router} from "@angular/router";
import * as moment from 'moment';
import {IonModal} from "@ionic/angular";

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.page.html',
  styleUrls: ['./problem-detail.page.scss'],
})
export class ProblemDetailPage implements OnInit {
  @ViewChild('modalDetail') modal: IonModal;
  @ViewChild('modalNewComment') modalComment: IonModal;
  private screenHeight: number = window.innerHeight;
  description="";
  user:any={};
  hauteur="";
  id=0;
  lang="";
  problem:any={
    answers:[],
    ratings:{
      stats:{}
    }
  };
  is_loading=true;

  BADGE:any=[
    {
      min:1000,
      max:10000
    },{
      min:10000,
      max:100000
    },{
      min:100000,
      max:1000000
    }
  ];

  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
  ) {
    this.hauteur = (this.screenHeight*0.7)+'px';
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      this.id= this.router.getCurrentNavigation().extras.state.id;
      // @ts-ignore
      this.getProblem(this.id);
    } else {
      //console.log("pas d'id");

    }
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.lang = moment.locales()[0];

    if (this.api.checkUser()) {
      let user = JSON.parse(localStorage.getItem('user_lv'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        this.user = a.data.user;
        localStorage.setItem('user_lv',JSON.stringify(this.user));
      },q=>{
        //this.router.navigate(['/login']);
        this.util.handleError(q);
      });
    } else {
      //this.util.doToast('Vous n\'êtes pas connecté',2000,'light');
      //this.router.navigate(['/login']);
    }

    this.api.getSettings().then((d:any)=>{
      this.BADGE = d.badge;
    },q=>{
      this.util.handleError(q);
    })

  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength}`;
  }

  getProblem(id){
    const opt = {

    };
    this.api.get('questions',id,opt).then((d:any)=>{
      /*d.answers.forEach(a=>{
        a.isRank=false;
      });*/
      this.problem = d;
      if(this.api.checkUser()){
        let user = JSON.parse(localStorage.getItem('user_lv'));
        this.getRatingOfUser(user.id);
      }
      this.getCommentaire(d.id);
    },q=>{
      this.is_loading=false;
      this.util.handleError(q);
    })
  }

  getRatingOfUser(user_id){
    const opt = {
      user_id,
      ratingable_id:this.id,
      ratingable_type:'App\\Models\\Question'
    };

    this.api.getList('ratings',opt).then((d:any)=>{
      this.problem.isRank = d.length > 0;
    },q=>{
      this.util.handleError(q);
    })
  }

  saveComment(){
    if(this.api.checkUser()){
      if(this.description!=''){
        const opt = {
          content:this.description,
          user_id:this.user.id,
          question_id:this.id
        };
        this.api.post('answers',opt).then((d:any)=>{
          this.util.doToast('Merci pour votre partage, votre expérience est en cours de validation',5000,'tertiary');
          this.description="";
          this.problem.answers.push(d);
          this.modalComment.setCurrentBreakpoint(0);
        },q=>{
          this.util.handleError(q);
        })
      }
    } else {
      this.modal.setCurrentBreakpoint(0);
      this.modalComment.setCurrentBreakpoint(0);
      this.util.doToast('Vous devez être connecté pour partager votre expérience',3000,'tertiary');
      this.router.navigate(['/login']);
    }

  }

  saveRank(target,object){
    if(this.api.checkUser()){
      let tmp='App\\Models\\Question';
      if(target=='answer'){
        tmp='App\\Models\\Answer';
      }
      if(object.isRank){


        const opt = {
          ratingable_id:object.id,
          ratingable_type: tmp,
          user_id:this.user.id
        };
        // il existe une note, on supprime
        this.api.getList('ratings',opt).then((d:any)=>{
          this.api.remove('ratings',d[0].id).then(a=>{
            object.isRank=!object.isRank;
            object.ratings.total--;
          }, q=>{
            this.util.hideLoading();
            this.util.handleError(q);
          });
        }, q=>{
          this.util.hideLoading();
          this.util.handleError(q);
        })
      } else {


        const opt ={
          comment:"J'aime",
          rating:5,
          ratingable_id:object.id,
          ratingable_type: tmp,
          user_id:this.user.id
        };

        this.api.post('ratings',opt).then(d=>{
          object.isRank=!object.isRank;
          object.ratings.total++;
        }, q=>{
          this.util.hideLoading();
          this.util.handleError(q);
        })
      }
    } else {
      this.util.doToast('Vous devez être connecté pour realiser cette action',3000,'tertiary');
      this.router.navigate(['/login']);
    }


  }

  getCommentaire(question_id){
    const opt = {
      _includes:'user',
      question_id,
      status:'enable',
      should_paginate:true,
      per_page:20
    };
    if(this.api.checkUser()){
      let user = JSON.parse(localStorage.getItem('user_lv'));
      opt['user_id']=user.id
    }
    this.api.getList('answers',opt).then((d:any)=>{
      this.is_loading=false;
      d.forEach(v=>{
        let x = v.user.uid.split('-');
        v.uid= x[4];
        //v.uid= '';
      });
      this.problem.answers = d;
    },q=>{
      this.is_loading=false;
      this.util.handleError(q);
    })
  }

  newComment(){

  }
}
