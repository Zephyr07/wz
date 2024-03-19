import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonModal, ModalController, NavController} from "@ionic/angular";
import {NUMBER_RANGE} from "../../../services/contants";
import {ApiProvider} from "../../../providers/api/api";
import {Router} from "@angular/router";
import {UtilProvider} from "../../../providers/util/util";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-tombola-detail',
  templateUrl: './tombola-detail.page.html',
  styleUrls: ['./tombola-detail.page.scss'],
})
export class TombolaDetailPage implements OnInit {
  @ViewChild('modalRank') modalRank: IonModal;
  id=0;
  user_result:number;
  is_win = false;
  is_played = false;
  tombola:any={};
  result=0

  name="";
  texte="";

  is_phone=false;
  user:any={};

  can_play=false;
  phone:number;
  MIN = NUMBER_RANGE.min;
  MAX = NUMBER_RANGE.max;

  isLoading=true;
  settings:any={
    android:{
      subscription:false
    },
    ios:{
      subscription:false
    }
  };

  CANCEL="";
  AMOUNT="";
  UPDATE="";
  TEXT="";
  PHONE="";
  isLogged = false;
  is_subscription=false;

  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
    public modalController: ModalController,
    public alertController: AlertController,
    private navCtrl:NavController,
    private translate: TranslateService
  ) {
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      this.id= this.router.getCurrentNavigation().extras.state.id;
      this.getTombola(this.id);
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.name;
    } else {
      //console.log("pas d'id");
      this.id=1;
      this.getTombola(this.id);
    }

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

  getTombola(id){
    this.id=id;
    let user=JSON.parse(localStorage.getItem('user_wz'));
    this.api.get('tombolas',id).then((d:any)=>{
      this.tombola = d;
      if(user.unit>= d.fees){
        this.can_play=true;
      }
      this.isLoading=false;
    },q=>{
      this.util.handleError(q);
    })
  }


  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_wz'));
      this.is_subscription = this.api.checkSubscription(this.user.subscription).is_actived;
      //this.phone=this.user.phone;
    }
    if(localStorage.getItem('wz_settings')!='undefined'){
      this.settings = JSON.parse(localStorage.getItem('wz_settings'))[0];
    } else {

    }
  }

  backToPreviousPage(){
    document.getElementById('backButton').click();
  }

  async askSchedule(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Confirmation",
      subHeader:"Confirmez-vous le nombre "+this.user_result+" ? Cela vous coûtera "+this.tombola.fees+"U",
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
    if(this.tombola.fees==0 || this.tombola.fees<this.user.unit){
      this.util.showLoading("loading");

      const opt ={
        type:'solo',
        user_result:this.user_result,
        tombola_id:this.tombola.id,
        user_id:this.user.id,
        price_was:this.tombola.fees
      };

      this.api.post('tombola_participants',opt).then((d:any)=>{
        this.is_played=true;
        this.result = d.result;
        if(d.result == d.user_result){
          this.is_win=true;
        }

        this.util.hideLoading();
      },q=>{
        this.util.hideLoading();
        this.util.handleError(q);
      })

    } else {
      this.api.rechargeAccount(this.tombola.fees,this.user.id);
    }
  }

  checkNumber(){
    this.is_phone = this.MIN <= this.phone && this.phone <= this.MAX;
  }

  support(){
    if(this.translate.getDefaultLang()=='fr'){
      window.location.href="https://api.whatsapp.com/send?phone=237673996540&text=Bonjour+je+souhaite+reserver+pour+le+tournoi+"+this.tombola.name;
    } else {
      window.location.href="https://api.whatsapp.com/send?phone=237673996540&text=Hello+I+want+to+buy+for+tombola"+this.tombola.name;
    }
  }

  replay(){
    this.is_win=false;
    this.is_played=false;
    this.result=0;
    this.user_result=undefined
  }

  doRefresh(event) {
    this.ionViewWillEnter();
    this.getTombola(this.id);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

}
