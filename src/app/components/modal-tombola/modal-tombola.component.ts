import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";

@Component({
  selector: 'app-modal-tombola',
  templateUrl: './modal-tombola.component.html',
  styleUrls: ['./modal-tombola.component.scss'],
})
export class ModalTombolaComponent  implements OnInit {

  tombola:any={};
  user:any={};
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

  per_page = 20;
  page = 1;
  last_page = 10000000;
  max_length = 0;
  old_max_length = 0;

  constructor(
    private alertController:AlertController,
    private modalController:ModalController,
    private api:ApiProvider,
    private util:UtilProvider
  ) {

  }

  ngOnInit() {
    this.fees = this.tombola.fees;

  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      let user = JSON.parse(localStorage.getItem('user_wz'));
      this.api.getList('auth/me',{id:user.id}).then((a:any)=>{
        this.user = a.data.user;
        localStorage.setItem('user_wz',JSON.stringify(this.user));
      });
    } else{
    }
  }

  async askSchedule(){
    let t =this.tombola.fees;
    let subheader = "Confirmez-vous le nombre "+this.user_result+" ? Cela vous coûtera "+t+"U";
    if(this.type=='triple'){
      t = this.tombola.fees*3;
      subheader = "Confirmez-vous les nombres "+this.user_result+", "+this.user_result1+" et "+this.user_result2+", ? Cela vous coûtera "+t+"U";
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
            this.showSchedule();
          }
        }
      ]
    });

    await alert.present();
  }

  showSchedule(){
    if(this.checkResult()){
      let t=this.tombola.fees;
      if(this.type=='triple'){
        t = this.tombola.fees*3
      }
      if(this.tombola.fees==0 || t<=this.user.unit){
        this.util.showLoading("loading");

        const opt ={
          type:this.type,
          user_result:this.user_result,
          user_result1:this.user_result1,
          user_result2:this.user_result2,
          tombola_id:this.tombola.id,
          user_id:this.user.id,
          price_was:t
        };

        this.api.post('tombola_participants',opt).then((d:any)=>{
          this.is_played=true;
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
        this.util.doToast("Solde insuffisant",3000,'warning');
        this.api.rechargeAccount(t-this.user.unit,this.user.id);
      }
    } else {
      this.util.doToast("Reponses absente",3000,"warning");
    }

  }

  setType(){
    if(this.type=='solo'){
      this.fees=this.tombola.fees;
    } else {
      this.fees = this.tombola.fees*3;
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
