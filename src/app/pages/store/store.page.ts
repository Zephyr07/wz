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
        subHeader:'Vous allez souscrire à '+time+" heures de jeu. Coût : "+price+" U",
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
      this.util.doToast('Solde insuffisant. Veuillez recharger votre compte',3000);
    }


  }

}
