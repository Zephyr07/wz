import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UtilProvider} from "../util/util";
import * as moment from "moment";
import {ActionSheetController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

import {API_ENDPOINT} from "../../services/contants";
import * as _ from "lodash";
import axios from "axios";


/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export const http = axios.create({
  baseURL: API_ENDPOINT,
});

http.defaults.headers['Authorization'] = "Bearer "+localStorage.getItem('jwt_token');
http.interceptors.response.use((res:any) =>{
  let newResponse:any=undefined;
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if (res.data.per_page !== undefined) {
    newResponse = res.data.data;
    newResponse.metadata = _.omit(res.data, 'data');
    return newResponse;
  }

  return res.data;
});

@Injectable()
export class ApiProvider {

  public date_format = 'Y-M-D';

  public autoplay_val = 5000;
  public slide_speed = 700;

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private translate:TranslateService,
    private util:UtilProvider
  ) {

  }

  public getList(target:string,data?:any){
    return new Promise((resolve, reject) => {
      if(data){
        http.get(target,{params:data}).then(d=>{
          resolve(d);
        }, q=>{
          reject(q);
        });
      } else {
        http.get(target).then(d=>{
          resolve(d);
        }, q=>{
          reject(q);
        })
      }
    })
  }

  public get(target:string,id:number,data?:any){
    return new Promise((resolve, reject) => {
      if(data){
        http.get(target+'/'+id,{params:data}).then(d=>{
          resolve(d);
        }, q=>{
          reject(q);
        });
      } else {
        http.get(target+'/'+id).then(d=>{
          resolve(d);
        }, q=>{
          reject(q);
        })
      }
    })
  }

  public post(target:string,data:any){
    return new Promise((resolve, reject) => {
      http.post(target,data).then(d=>{
        resolve(d);
      }, q=>{
        reject(q);
      });
    })
  }

  public put(target:string,id:number,data:any){
    return new Promise((resolve, reject) => {
      http.put(target+'/'+id,data).then(d=>{
        resolve(d);
      }, q=>{
        reject(q);
      });
    })
  }

  public remove(target:string,id:number){
    return new Promise((resolve, reject) => {
      http.delete(target+'/'+id).then(d=>{
        resolve(d);
      }, q=>{
        reject(q);
      });
    })
  }

  formarPrice(price) {
    if (price === undefined) {
      return '';
    } else {
      price += '';
      const tab = price.split('');
      let p = '';
      for (let i = tab.length; i > 0; i--) {
        if (i % 3 === 0) {
          p += ' ';
        }
        p += tab[tab.length - i];
      }
      return p;
    }
  }

  checkUser() {
    if(localStorage.getItem('user_wz')!='undefined' || localStorage.getItem('user_wz')!='null' || localStorage.getItem('user_wz')!=undefined){
      if (JSON.parse(localStorage.getItem('user_wz')) == null) {
        //Metro.notify.create('Vous n\'êtes pas connecté', 'Erreur de connexion', {cls: 'alert'});
        //this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }

  }

  checkCredential() {
    if(localStorage.getItem('auth_wz')!='undefined' || localStorage.getItem('auth_wz')!='null' || localStorage.getItem('auth_wz')!=undefined){
      if (JSON.parse(localStorage.getItem('auth_wz')) == null) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }

  }

  checkSubscription(s){
    let status = {
      is_subscription:false,
      is_actived:false,
      is_paid:false
    }
    if(s!=undefined){
      status.is_subscription=true;
      if(s.state==0 || s.state=='paid' || s.state=='active'){
        // payé
        status.is_paid=true;
        let now = moment();
        let start_at = moment(s.created_at);
        //console.log(start_at.add(s.duration,'month').format("YY MM DD"),now.format("YY MM DD"));
        if(start_at.add(s.pack.duration,'month')>now){
          // activé
          status.is_actived=true;
        }
      }
    }
    localStorage.setItem('subscription_status', JSON.stringify(status));
    return status;
  }


  saveImage(image,objetClass,object_parent_id,text,toast?:boolean,call?){
    image.append('_method', 'POST');

    image.append('place_id',object_parent_id);
    this.post(objetClass,image).then(da=>{
      if(!toast){
        this.util.doToast(text,3000);
      }
      if(call){
        call();
      }
      return true;
    }, q => {
      this.util.handleError(q);
    });
  }

  updateImage(image,objetClass,objet,text,toast?:boolean,call?){
    image.append('_method', 'PUT');
    let id = objet.id;
    if(objet.body){
      id = objet.body.id;
    }
    image.append('id',id);
    this.post(objetClass+'/' + id,image).then(d=>{
      if(!toast){
        this.util.doToast(text,3000);
      }
      if(call){
        call();
      }
      return true;
    }, q => {
      this.util.handleError(q);
    });

    /*this.restangular.all(objetClass+'/' + id).customPOST(image, undefined, undefined, {'Content-Type': undefined}).subscribe((da:any) => {
      if(!toast){
        this.util.doToast(text,3000);
      }
      if(call){
        call();
      }
      return true;
    }, q => {
      this.util.handleError(q);
    });*/
  }

  async postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }



  async askLanguage() {
    let is_log=false;
    let user:any={};
    if(this.checkCredential()){
      is_log=true;
      user=JSON.parse(localStorage.getItem('user_wz'));
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Langue/Language',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Français',
        handler: () => {
          this.translate.use('fr');
          this.translate.setDefaultLang('fr');
          moment.locale('fr');
          if(is_log){
            // update setting
            this.update_settings({language:'fr'});
          }
        }
      },{
        text: 'English',
        handler: () => {
          this.translate.use('en');
          this.translate.setDefaultLang('fr');
          moment.locale('en');
          if(is_log){
            // update setting
            this.update_settings({language:'en'});
          }
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    //console.log('onDidDismiss resolved with role and data', role, data);
  }

  update_settings(credentials: {
    language?:string,notification?:boolean}) {
    let settings=[];
    if(credentials.language){
      settings.push({"language":credentials.language})
    }
    if(credentials.notification){
      settings.push({"notification":credentials.notification})
    }
    return new Promise((resolve, reject) => {
      this.post('auth/update_settings',{settings:JSON.stringify(settings)})
        .then((response:any) => {
          const data = response.data;
          resolve(data);
        }, function(error) {
          // //console.log(error);

          reject(error);
        });
    });

  }

}
