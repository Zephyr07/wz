import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {NUMBER_RANGE} from "../../services/contants";
import {UtilProvider} from "../../providers/util/util";
import {ApiProvider} from "../../providers/api/api";

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  user:any={};

  constructor(
    private router:Router,
    private util:UtilProvider,
    private api:ApiProvider,
    private alertController : AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.api.checkUser()) {
      this.user = JSON.parse(localStorage.getItem('user_wz'));
    }
  }

  goToSchedule(){
    this.router.navigateByUrl('schedule');
  }

  async subscribe(t){
    let pack_id=1;
    if(t=='DUO'){
      pack_id=2;
    } else if(t=='FAMILLE'){
      pack_id=3;
    }

    // demande du numéro
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Paiement',
      subHeader:'Entrer le compte Mobile Money (Orange ou MTN) pour payer votre abonnement '+t,
      inputs: [
        {
          name: 'phone',
          type: 'number',
          placeholder: 'Téléphone'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Payer',
          handler: (data:any) => {
            //console.log('Confirm Ok', data);
            if(data.phone>=NUMBER_RANGE.min && data.phone<=NUMBER_RANGE.max){
              this.util.showLoading('initiation_payment');
              // connexion
              const opt = {
                type:'account',
                pack_id,
                user_id:this.user.id,
              };
              this.api.post('init_buy_training',opt).then(async (d:any) => {
                // initialisation du payment my-coolPay
                this.api.post('payment/' + d.id + '/' + data.phone,{}).then(e=>{
                  this.util.hideLoading();
                  this.util.doToast('payment_pending',5000);
                  // redirection vers la page de l'user
                  setTimeout(()=>{
                    //this.navCtrl.navigateRoot(['/user/my-schedule']);
                  },3000)
                }, q=>{
                  this.util.hideLoading();
                  this.util.handleError(q);
                })
                //console.log(d);
              },q=>{
                this.util.hideLoading();
                this.util.handleError(q);
              });
            } else {
              this.util.doToast('Erreur sur le numéro',3000);
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
