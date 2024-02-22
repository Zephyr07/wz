import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {NUMBER_RANGE} from "../../services/contants";
import {UtilProvider} from "../../providers/util/util";
import {ApiProvider} from "../../providers/api/api";
import {TranslateService} from "@ngx-translate/core";
import * as _ from 'lodash';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  user:any={};
  pack:any={};
  packs:any=[];
  CANCEL="";
  AMOUNT="";
  UPDATE="";
  TEXT="";
  PHONE="";

  constructor(
    private router:Router,
    private util:UtilProvider,
    private api:ApiProvider,
    private alertController : AlertController,
    private translate:TranslateService
  ) {
    this.translate.get('cancel').subscribe( (res: string) => {
      this.CANCEL=res;
    });
    this.translate.get('confirm').subscribe( (res: string) => {
      this.UPDATE=res;
    });
    this.translate.get('recharge_account').subscribe( (res: string) => {
      this.TEXT=res;
    });
    this.translate.get('phone').subscribe( (res: string) => {
      this.PHONE=res;
    });
    this.translate.get('amount').subscribe( (res: string) => {
      this.AMOUNT=res;
    });
  }

  ngOnInit() {
    this.getPacks();
  }

  ionViewWillEnter() {
    if (this.api.checkUser()) {
      this.user = JSON.parse(localStorage.getItem('user_wz'));
    }
  }

  getPacks(){
    this.api.getList('packs').then(d=>{
      this.packs = d;
    })
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
    } else if(t=='ABONNEMENT'){
      pack_id=4;
    }

    this.pack = _.find(this.packs,{'id':pack_id});

    let titre ="S'abonner";
    let text = 'Vous allez souscrire à '+this.pack.game_hour+" heures de jeu. Coût : "+this.pack.price+" U. Tout abonnement précédent sera annulé";
    let result = "Pack acheté, vos heures de jeux ont été créditées";
    if(pack_id==4){
      titre = "Devenir membre";
      text = "Vous allez devenir membre de la salle et bénéficier de reduction sur nos prix. Coût : 1 000U";
      result = "Bienvenue cher membre. Vous bénéficier des reductions sur nos prix"
    }

    if(this.user.unit>=this.pack.price){
      // demande du numéro
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: titre,
        subHeader:text,
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
              let target = "transactions";
              if(pack_id==4){
                // subscription
                target = "subscriptions";
              }
              const opt = {
                pack_id,
                user_id:this.user.id,
                type:'pack'
              };
              this.util.showLoading('initiation_payment');
              this.api.post(target,opt).then(d=>{
                this.util.hideLoading();
                this.util.doToast(result,5000)
              }, q=>{
                this.util.hideLoading();
                this.util.handleError(q);
              });
            }
          }
        ]
      });

      await alert.present();
    } else {
      // recharge du compte
      this.recharge(this.pack);
      //this.util.doToast('Solde insuffisant. Veuillez recharger votre compte',3000);
    }


  }

  async recharge(pack) {
    let titre ="S'abonner";
    let text = 'Vous allez souscrire à '+pack.game_hour+" heures de jeu. Coût : "+pack.price+" FCFA. Entrez le numéro pour le paiement mobile";
    if(pack.id==4){
      titre = "Devenir membre";
      text = "Vous allez devenir membre de la salle. Entrez le numéro pour le paiement mobile";
    }
    const alert = await this.alertController.create({
      header: titre,
      subHeader:text,
      buttons: [
        {
          text: this.CANCEL,
          role: 'cancel',
        },
        {
          text: this.UPDATE,
          role:'confirm',
          handler:(data)=>{
            let type = "account-pack";
            if(pack.id==4){
              type = "account-subscription";
            }
            if(!isNaN(data.phone) && data.phone <= NUMBER_RANGE.max && data.phone >= NUMBER_RANGE.min){
              this.util.showLoading("treatment");
              const opt = {
                type,
                'pack_id':pack.id,
                user_id:this.user.id
              };
              this.api.post('init_buy_account',opt).then(async (d:any) => {
                // initialisation du payment my-coolPay
                this.api.post('payment/' + d.id + '/' + data.phone,{}).then(e=>{
                  this.util.hideLoading();
                  this.util.doToast('payment_pending',5000);
                  // redirection vers la page de l'user
                  /*setTimeout(()=>{
                    this.navCtrl.navigateRoot(['/user']);
                  },3000)*/
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
              this.util.doToast('Veuillez entrer un numéro de téléphone valide',3000);
            }
          }
        },
      ],
      inputs: [
        {
          placeholder: this.PHONE,
          value:this.user.phone,
          type:'number',
          name:'phone',
          attributes: {
            min: NUMBER_RANGE.min,
            max: NUMBER_RANGE.max
          },
        }
      ],
    });

    await alert.present();
  }

}
