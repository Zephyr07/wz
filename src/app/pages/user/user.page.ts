import {Component, OnInit} from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {NavigationExtras, Router} from "@angular/router";
import {AuthProvider} from "../../providers/auth/auth";
import {UtilProvider} from "../../providers/util/util";
import {TranslateService} from "@ngx-translate/core";
import {AlertController, ModalController} from "@ionic/angular";
import * as moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  lang="";
  user:any={};
  CANCEL="";
  UPDATE="";
  TEXT="";
  OLD_PASS="";
  PHONE="";
  PASSWORD="";
  AMOUNT="";
  PASS="";
  NEW_PASS="";
  DELETE="";
  CONFIRM_DELETE_TEXT="";
  country:any={};
  is_subscription=false;
  point=1;
  user_point:number=0;
  phone:number;
  password="";
  is_user=false;
  username="";
  showLoading=true;
  uid="";

  count_a=0;
  count_q=0;

  constructor(
    private router:Router,
    private util:UtilProvider,
    private api:ApiProvider,
    private auth:AuthProvider,
    private alertController :AlertController,
    private modalController:ModalController,
    private translate:TranslateService
  ) {
    this.translate.get('cancel').subscribe( (res: string) => {
      this.CANCEL=res;
    });
    this.translate.get('update').subscribe( (res: string) => {
      this.UPDATE=res;
    });
    this.translate.get('old_password').subscribe( (res: string) => {
      this.OLD_PASS=res;
    });
    this.translate.get('password_confirmation').subscribe( (res: string) => {
      this.NEW_PASS=res;
    });
    this.translate.get('update_password').subscribe( (res: string) => {
      this.TEXT=res;
    });
    this.translate.get('new_password').subscribe( (res: string) => {
      this.PASS=res;
    });
    this.translate.get('password').subscribe( (res: string) => {
      this.PASSWORD=res;
    });
    this.translate.get('delete').subscribe( (res: string) => {
      this.DELETE=res;
    });
    this.translate.get('ask_password').subscribe( (res: string) => {
      this.CONFIRM_DELETE_TEXT=res;
    });
    this.translate.get('phone').subscribe( (res: string) => {
      this.PHONE=res;
    });
    this.translate.get('amount').subscribe( (res: string) => {
      this.AMOUNT=res;
    });

  }

  ngOnInit() {
    this.lang = moment().locale();
  }

  ionViewWillEnter(){
    
    if (this.api.checkUser()) {
      this.is_user=true;
      let user = JSON.parse(localStorage.getItem('user_lv'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        this.user = a.data.user;
        this.uid=this.user.uid.split('-')[4];
        this.username=this.user.user_name;
        this.user_point=this.user.point;
        this.getCountQuestion(this.user.id);
        this.getCountAnswer(this.user.id);
        this.api.getSettings().then((d:any)=>{
          this.showLoading=false;
        })
      });
    } else {
      this.is_user=true;
      this.util.doToast('Vous n\'êtes pas connecté',2000,'light');
      this.router.navigate(['/login']);
      this.showLoading=false;
    }

  }

  async deleteUser() {
    const alert = await this.alertController.create({
      header: "Supprimer le compte",
      subHeader:this.CONFIRM_DELETE_TEXT,
      buttons: [
        {
          text: this.CANCEL,
          role: 'cancel',
        },
        {
          text: this.DELETE,
          role:'confirm',
          handler:(data)=>{
            //this.util.showLoading("updating");
            if(data.password!=""){
              if(data.password.length>7){
                const opt={
                  email:data.email,
                  password:data.password,

                };
                this.auth.delete(opt).then((d:any)=>{
                  this.util.hideLoading();
                  this.util.doToast("account_delete",5000);
                  this.router.navigateByUrl('login');
                })
              } else {
                this.util.hideLoading();
                this.util.doToast("error_password_1",5000);
              }

            } else {
              this.util.hideLoading();
              this.util.doToast('error_password_2',5000);
            }

          }
        },
      ],
      inputs: [
        {
          placeholder: 'Email',
          type:'email',
          name:'email'
        },
        {
          placeholder: this.PASSWORD,
          type:'password',
          name:'password',
          attributes: {
            minlength: 8,
          },
        }
      ],
    });

    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.TEXT,
      buttons: [
        {
          text: this.CANCEL,
          role: 'cancel',
        },
        {
          text: this.UPDATE,
          role:'confirm',
          handler:(data)=>{
            //this.util.showLoading("updating");
            if(data.password_confirmation==data.password && data.current_password!=data.password){
              if(data.password.length>5){
                const opt={
                  id:this.user.id,
                  phone:this.user.phone,
                  email:this.user.email,
                  current_password:data.current_password,
                  password_confirmation:data.password_confirmation,
                  password:data.password,

                };

                this.auth.update_info(opt).then((d:any)=>{
                  this.util.hideLoading();
                  this.util.doToast("password_updated",5000);
                })
              } else {
                this.util.hideLoading();
                this.util.doToast("error_password_1",5000);
              }

            } else {
              this.util.hideLoading();
              this.util.doToast('error_password_2',5000);
            }

          }
        },
      ],
      inputs: [
        {
          placeholder: this.OLD_PASS,
          type:'password',
          value:'',
          name:'current_password',
          attributes: {
            minlength: 6,
          },
        },
        {
          placeholder: this.PASS,
          type:'password',
          value:'',
          name:'password',
          attributes: {
            minlength: 6,
          },
        },
        {
          placeholder: this.NEW_PASS,
          type:'password',
          value:'',
          name:'password_confirmation',
          attributes: {
            minlength: 6,
          },
        }
      ],
    });

    await alert.present();
  }

  askLanguage(){
    this.api.askLanguage();
  }


  logout(){
    this.auth.logout().then((d:any)=>{
      //this.router.navigateByUrl('home');
      this.router.navigateByUrl('login');
    })
  }


  doRefresh(event) {
   this.ionViewWillEnter();

    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

  getCountAnswer(user_id){
    const opt = {
      user_id,
      _agg:'count',
      should_paginate:false
    };

    this.api.getList('answersA',opt).then((d:any)=>{
      this.count_a=d;
    },q=>{
      this.util.handleError(q);
    })
  }

  getCountQuestion(user_id){
    const opt = {
      user_id,
      _agg:'count',
      should_paginate:false
    };

    this.api.getList('questions',opt).then((d:any)=>{
      this.count_q=d;
    },q=>{
      this.util.handleError(q);
    })
  }

  problems(){
    const navigationExtra : NavigationExtras = {state: {name:"", id:this.user.id}};
    this.router.navigateByUrl('problem',navigationExtra);
  }

  answers(){
    const navigationExtra : NavigationExtras = {state: {name:"", id:this.user.id}};
    this.router.navigateByUrl('user/answer',navigationExtra);
  }

  showAccount(){
    this.router.navigateByUrl('user/account');
  }
}
