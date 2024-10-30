import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-problem',
  templateUrl: './problem.page.html',
  styleUrls: ['./problem.page.scss'],
})
export class ProblemPage implements OnInit {

  questions:any=[];
  questions_F:any=[];
  questions_M:any=[];
  old_questions:any=[];
  old_questions_F:any=[];
  old_questions_M:any=[];
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
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      this.id= this.router.getCurrentNavigation().extras.state.id;
      this.isOwner=true;
      // @ts-ignore
      this.getProblems(this.id);
    } else {
      //console.log("pas d'id");
      this.getProblems();
    }
  }

  ngOnInit() {
  }

  ionViewWillEnter(){

  }

  getProblems(id?){
    this.questions_M=[];
    this.questions_F=[];
    const opt ={
      status:'enable',
      per_page:10,
      _sort:"created_at",
      _sortDir:'desc'
    };
    if(id){
      opt['user_id'] = id;
    }
    this.api.getList('questions',opt).then((d:any)=>{
      d.forEach(v=>{
        if(v.gender=='male'){
          this.questions_M.push(v);
        } else {
          this.questions_F.push(v);
        }
      });
      this.questions = d;
      this.old_questions = d;
      this.old_questions_M = this.questions_M;
      this.old_questions_F = this.questions_F;
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
    } else if(t=='homme'){
      this.questions = this.old_questions_M
    } else {
      this.questions = this.old_questions_F
    }
  }

  goToDetailProblem(p){
    const navigationExtra : NavigationExtras = {state: {name:"", id:p.id}};
    this.router.navigateByUrl('problem/problem-detail',navigationExtra);
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
