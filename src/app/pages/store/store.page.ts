import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {AlertController, ModalController} from "@ionic/angular";
import {NUMBER_RANGE} from "../../services/contants";
import {UtilProvider} from "../../providers/util/util";
import {ApiProvider} from "../../providers/api/api";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  user:any={};
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
    let time=20;
    let price = 20000;
    if(t=='DUO'){
      pack_id=2;
      time = 40;
      price = 30000;
    } else if(t=='FAMILLE'){
      pack_id=3;
      time = 90;
      price = 50000;
    }

    if(this.user.unit>=price){
      // demande du numéro
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: "S'abonner",
        subHeader:'Vous allez souscrire à '+time+" heures de jeu. Coût : "+price+" U. Tout abonnement précédent sera annulé",
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
              const opt = {
                pack_id,
                price_was:price,
                user_id:this.user.id,
                type:'pack'
              }
              this.util.showLoading('initiation_payment');
              this.api.post('subscriptions',opt).then(d=>{
                console.log(d);

                this.util.hideLoading();
                this.util.doToast('Abonnement activé, vous beneficiez d\'une remise sur nos prix',3000)
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
      this.recharge(price,pack_id,time);
      //this.util.doToast('Solde insuffisant. Veuillez recharger votre compte',3000);
    }


  }

  async recharge(amount,pack_id, time) {
    const alert = await this.alertController.create({
      header: "S'abonner",
      subHeader:'Vous allez souscrire à '+time+" heures de jeu. Coût : "+amount+" FCFA.",
      buttons: [
        {
          text: this.CANCEL,
          role: 'cancel',
        },
        {
          text: this.UPDATE,
          role:'confirm',
          handler:(data)=>{
            if(!isNaN(data.phone) && data.phone <= NUMBER_RANGE.max && data.phone >= NUMBER_RANGE.min){
              this.util.showLoading("treatment");
              const opt = {
                type:'account-pack',
                pack_id,
                amount,
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
