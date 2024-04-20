import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import {AdmobProvider} from "../../providers/admob/AdmobProvider";

@Component({
  selector: 'app-modal-tombola',
  templateUrl: './modal-tombola.component.html',
  styleUrls: ['./modal-tombola.component.scss'],
})
export class ModalTombolaComponent  implements OnInit {

  tombola:any={};
  private user:any={};
  unit=0;
  fees = 0;
  type="solo";
  result:number;
  user_result1:number;
  user_result2:number;
  user_result:number;
  content="";

  comments:any=[];
  isLoadingRank=true;
  is_played=false;
  is_win=false;
  showAdButton=false;
  is_subscription=false;

  per_page = 20;
  page = 1;
  last_page = 10000000;
  max_length = 0;
  old_max_length = 0;

  constructor(
    private alertController:AlertController,
    private modalController:ModalController,
    private api:ApiProvider,
    private admob:AdmobProvider,
    private util:UtilProvider
  ) {

  }

  ngOnInit() {
    this.admob.prepareRewardVideo().then(d=>{
      this.showAdButton=true;
    });
    this.fees = this.tombola.fees;
    if(this.tombola.free){
      this.fees=0;
    }
    if(this.is_subscription){
      this.fees*=0.8;
    }

  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      let user = JSON.parse(localStorage.getItem('user_wz'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        this.user = a.data.user;
        this.unit=this.user.unit;
        this.is_subscription = this.api.checkSubscription(this.user.subscription).is_actived;
        this.fees = this.tombola.fees;
        if(this.tombola.free){
          this.fees=0;
        }
        if(this.is_subscription){
          this.fees*=0.8;
        }
        localStorage.setItem('user_wz',JSON.stringify(this.user));
      });
    } else{
    }
  }

  async askSchedule(){
    let t =this.fees;
    let subheader = "Confirmez-vous le nombre "+this.user_result+" ? Cela vous coûtera "+t+"U";
    if(this.type=='triple'){
      subheader = "Confirmez-vous les nombres "+this.user_result+", "+this.user_result1+" et "+this.user_result2+" ? Cela vous coûtera "+t+"U";
    }

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Confirmation",
      subHeader:subheader,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmer',
          handler: (data:any) => {
            this.admob.prepareRewardVideo();
            this.showSchedule();
          }
        }
      ]
    });

    await alert.present();
  }

  showSchedule(){
    if(this.checkResult()){
      if(this.tombola.free){
        this.fees=0;
      }
      let t=this.fees;

      if(this.fees==0 || t<=this.user.unit){
        this.util.showLoading("loading");

        const opt ={
          type:this.type,
          user_result:this.user_result,
          user_result1:this.user_result1,
          user_result2:this.user_result2,
          tombola_id:this.tombola.id,
          user_id:this.user.id,
          price_was:t,
          is_s:this.is_subscription,
          is_free:false
        };

        opt.is_free = this.tombola.free;

        this.api.post('tombola_participants',opt).then((d:any)=>{
          this.is_played=true;
          this.fees=this.tombola.fees;
          this.result = d.result;
          this.user.unit-=t;
          localStorage.setItem('user_wz',JSON.stringify(this.user));
          if(this.type=='triple'){
            if(d.result == d.user_result || d.result == d.user_result1|| d.result == d.user_result2){
              this.is_win=true;
            }
          } else {
            if(d.result == d.user_result){
              this.is_win=true;
            }
          }
          this.util.hideLoading();
        },q=>{
          this.util.hideLoading();
          this.util.handleError(q);
        })

      } else {
        this.util.doToast("insufficient_balance",3000,'warning');
        this.api.rechargeAccount(t-this.user.unit,this.user.id);
      }
    } else {
      this.util.doToast("missing_answer",3000,"warning");
    }

  }

  setType(){
    this.fees = this.tombola.fees;
    if(this.tombola.free){
      this.fees=0;
    }
    if(this.is_subscription){
      this.fees*=0.8;
    }
    if(this.type!='solo'){
      this.fees = this.fees*3;
    }
    this.user_result = undefined;
    this.user_result2 = undefined;
    this.user_result1 = undefined;
  }

  replay(){
    this.api.getList('auth/me',{id:this.user.id}).then((a:any)=>{
      this.user = a.data.user;
      localStorage.setItem('user_wz',JSON.stringify(this.user));
    });
    this.is_win=false;
    this.is_played=false;
    this.result=0;
    this.user_result=undefined;
    this.user_result1=undefined;
    this.user_result2=undefined;
    this.tombola.free=false;
  }

  replayAd(){
    this.admob.showRewardVideo().then(async d=>{
      this.replay();
      this.tombola.free=true;
      this.fees=0;
    })
  }

  checkResult(){
    if(this.user_result!=undefined){
      if(this.type=='triple'){
        if(this.user_result1 != undefined && this.user_result2!=undefined){
          return true;
        } else {
          return false;
        }
      } else {
        return true
      }
    } else {
      return false;
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
