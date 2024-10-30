import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import {TranslateService} from "@ngx-translate/core";
import * as moment from "moment";
import {AuthProvider} from "../../providers/auth/auth";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  private user:any={

  };
  problems:any=[];
  uid="";

  dev_count=0;
  is_user="";

  is_loading=true;

  UPGRADE_PACK_TITLE="";
  UPGRADE_PACK_TEXT="";
  SUBSCRIPTION_EXPIRED_TITLE="";
  SUBSCRIPTION_EXPIRED_CONTENT="";
  NO_SUBSCRIPTION_TITLE="";
  NO_SUBSCRIPTION_CONTENT="";
  SUBSCRIPTION="";

  constructor(
    private api: ApiProvider,
    private auth: AuthProvider,
    private router : Router,
    private util:UtilProvider,
    private translate:TranslateService
  ) {
    this.translate.get('upgrade_pack_title').subscribe( (res: string) => {
      this.UPGRADE_PACK_TITLE=res;
    });
    this.translate.get('upgrade_pack_text').subscribe( (res: string) => {
      this.UPGRADE_PACK_TEXT=res;
    });
    this.translate.get('no_subscription_title').subscribe( (res: string) => {
      this.NO_SUBSCRIPTION_TITLE=res;
    });
    this.translate.get('no_subscription_content').subscribe( (res: string) => {
      this.NO_SUBSCRIPTION_CONTENT=res;
    });
    this.translate.get('subscription_expired_title').subscribe( (res: string) => {
      this.SUBSCRIPTION_EXPIRED_TITLE=res;
    });
    this.translate.get('subscription_expired_content').subscribe( (res: string) => {
      this.SUBSCRIPTION_EXPIRED_CONTENT=res;
    });
    this.translate.get('subscribe').subscribe( (res: string) => {
      this.SUBSCRIPTION=res;
    });
  }

  ngOnInit() {

  }


  ionViewWillEnter() {
    this.getProblems();

    if (this.api.checkUser()) {
      let user = JSON.parse(localStorage.getItem('user_lv'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        console.log(a);
        if(a.data.user.status=='pending_activation'){
          this.logout();
        }
        this.user = a.data.user;
        this.uid=this.user.uid;
        const l = JSON.parse(this.user.settings)[0].language;
        this.translate.use(l);
        this.translate.setDefaultLang(l);
        moment.locale(l);
        localStorage.setItem('user_lv',JSON.stringify(this.user));
      },q=>{
        this.logout();
        this.util.handleError(q);
      });
    } else {
      //this.util.doToast('Vous n\'êtes pas connecté',2000,'light');
      //this.router.navigate(['/login']);
    }

  }

  getProblems(){
    this.is_loading=true;
    const opt ={
      status:'enable',
      per_page:10,
      _sort:"created_at",
      _sortDir:'desc'
    };

    this.api.getList('questions',opt).then((d:any)=>{
      this.problems = d;
      this.is_loading=false;
    },q=>{
      this.is_loading=false;
      this.util.handleError(q);
    })
  }

  goToTest(){
    //this.router.navigateByUrl('test');
    this.dev_count+=1;
    if(this.dev_count==10){
      this.util.about_dev();
      this.dev_count=0;
    }
  }

  goToUrl(url){
    if(url=='user'){
      if(this.api.checkUser()){
        this.router.navigateByUrl(url);
      } else {
        this.router.navigateByUrl('login');
      }
    } else {
      this.router.navigateByUrl(url);
    }

  }

  goToProblem(){
    this.router.navigateByUrl('problem');
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

  logout(){
    this.auth.logout().then((d:any)=>{
      this.uid="";
      //this.router.navigateByUrl('home');
      this.router.navigateByUrl('/');
    })
  }

  doRefresh(event) {
    //this.getTournaments();
    if(this.api.checkUser()){
      this.ionViewWillEnter();
    } else {

    }
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
