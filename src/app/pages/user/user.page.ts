import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AlertController, ModalController} from "@ionic/angular";
import {ApiProvider} from "../../providers/api/api";
import {ModalEditUserComponent} from "../../components/modal-edit-user/modal-edit-user.component";
import {UtilProvider} from "../../providers/util/util";
import {AuthProvider} from "../../providers/auth/auth";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  user:any={
    person:{},
    subscription:{
      pack:{}
    }
  };
  settings:any={
    android:{
      subscription:false
    },
    ios:{
      subscription:false
    }
  };
  subscription_status:any={};
  CANCEL="";
  UPDATE="";
  TEXT="";
  OLD_PASS="";
  PASSWORD="";
  PASS="";
  NEW_PASS="";
  DELETE="";
  CONFIRM_DELETE_TEXT="";
  country:any={};

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
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // recupération des settings
    if(localStorage.getItem('wz_settings')!='undefined'){
      this.settings = JSON.parse(localStorage.getItem('wz_settings'))[0];
    } else {

    }

    if (this.api.checkUser()) {
      let user = JSON.parse(localStorage.getItem('user_wz'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        this.user = a.data.user;
        localStorage.setItem('user_wz',JSON.stringify(this.user));
        this.subscription_status=this.api.checkSubscription(this.user.subscription);
        this.getPerson(this.user.id);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToRechargeAccount(){
    //const navigationExtra : NavigationExtras = {state: {film:{'name':f.name, 'id':f.id}}};
    this.router.navigateByUrl('recharge-account');
  }

  goToDemand(){
    //const navigationExtra : NavigationExtras = {state: {film:{'name':f.name, 'id':f.id}}};
    this.router.navigateByUrl('user/demand');
  }

  goToReferral(){
    //const navigationExtra : NavigationExtras = {state: {film:{'name':f.name, 'id':f.id}}};
    this.router.navigateByUrl('user/referral');
  }

  goToMyTournament(){
    //const navigationExtra : NavigationExtras = {state: {film:{'name':f.name, 'id':f.id}}};
    this.router.navigateByUrl('user/my-tournament');
  }

  goToMySchedule(){
    //const navigationExtra : NavigationExtras = {state: {film:{'name':f.name, 'id':f.id}}};
    this.router.navigateByUrl('user/my-schedule');
  }

  goToPoint(){
    //const navigationExtra : NavigationExtras = {state: {film:{'name':f.name, 'id':f.id}}};
    this.router.navigateByUrl('point');
  }

  goToSubscription(){
    if(this.user.subscription){
      this.router.navigateByUrl('user/subscription');
    } else {
      this.router.navigateByUrl('tabs/store');
    }
  }

  goToSetting(){
    //const navigationExtra : NavigationExtras = {state: {film:{'name':f.name, 'id':f.id}}};
    this.router.navigateByUrl('setting');
  }

  goToSuggestion(){
    //const navigationExtra : NavigationExtras = {state: {film:{'name':f.name, 'id':f.id}}};
    this.router.navigateByUrl('suggestion');
  }

  goToBackOffice(){
    window.location.href="https://www.weblongrich.com";
  }

  getPerson(user_id){
    this.api.getList('people',{user_id}).then((d:any)=>{
      this.user.person = d[0];
    }, q=>{
      this.util.handleError(q);
    })
  }

  contactUs(){
    document.getElementById('contact').click();
  }

  logout(){
    this.auth.logout().then((d:any)=>{
      this.router.navigateByUrl('login');
      //this.router.navigateByUrl('home');
    })
  }

  getCountry(id){
    this.api.get('countries',id).then(d=>{
      console.log(d);
      this.country = d;
    })
  }

  async editUser(o?:any){
    o=this.user;
    const modal = await this.modalController.create({
      component: ModalEditUserComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'objet': o
      }
    });
    return await modal.present();
  }

  async deleteUser() {
    const alert = await this.alertController.create({
      header: this.DELETE,
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
                  this.router.navigateByUrl('home');
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

  doRefresh(event) {
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_wz'));
      this.getPerson(this.user.person.id);
    } else{
      this.router.navigate(['/login']);
    }

    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
