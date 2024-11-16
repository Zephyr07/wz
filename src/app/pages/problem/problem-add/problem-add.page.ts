import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";
import {NavigationExtras, Router} from "@angular/router";
import {AdmobProvider} from "../../../providers/admob/AdmobProvider";

@Component({
  selector: 'app-problem-add',
  templateUrl: './problem-add.page.html',
  styleUrls: ['./problem-add.page.scss'],
})
export class ProblemAddPage implements OnInit {

  description="";
  title="";
  isSave=false;
  private user:any={};
  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength}`;
  }

  constructor(
    private api:ApiProvider,
    private util:UtilProvider,
    private router:Router,
    private admob:AdmobProvider
  ) { }

  ngOnInit() {
    this.admob.loadInterstitial();
  }

  ionViewWillEnter() {

    if (this.api.checkUser()) {
      let user = JSON.parse(localStorage.getItem('user_lv'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        this.user = a.data.user;
        localStorage.setItem('user_lv',JSON.stringify(this.user));
      },q=>{
        this.util.doToast('Vous devez être connecté pour poser votre problème',2000,'tertiary');
        this.router.navigate(['/login']);
        this.util.handleError(q);
      });
    } else {
      this.util.doToast('Vous devez être connecté pour poser votre problème',2000,'tertiary');
      this.router.navigate(['/login']);
    }

  }

  save(){
    if(!this.util.validateTextInput(this.title)){
      this.util.doToast('Numéro non autorisé',2000, 'warning')
    } else if (!this.util.validateTextInput(this.description)){
      this.util.doToast('Numéro non autorisé',2000, 'warning')
    } else {
      if(this.description!="" && this.title!=""){
        this.util.showLoading('Enregistrement');
        const opt = {
          gender:this.user.gender,
          title:this.title,
          description:this.description,
          user_id:this.user.id
        };

        this.api.post('questions',opt).then(d=>{
          this.util.hideLoading();
          this.isSave=true;
          this.description="";
          this.title="";
          this.admob.showInterstitial();
          this.admob.loadInterstitial();
          setTimeout(()=>{
            this.isSave=false;
          },3000);
        }, q=>{
          this.util.hideLoading();
          this.util.handleError(q);
          }
        )
      }
    }

  }

}
