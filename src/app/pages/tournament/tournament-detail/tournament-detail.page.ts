import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonInfiniteScroll, IonModal, ModalController, NavController} from "@ionic/angular";
import {ApiProvider} from "../../../providers/api/api";
import {Router} from "@angular/router";
import {UtilProvider} from "../../../providers/util/util";
import {TranslateService} from "@ngx-translate/core";
import {NUMBER_RANGE} from "../../../services/contants";
import * as moment from "moment";
import {ModalTournamentParticipantComponent} from "../../../components/modal-tournament-participant/modal-tournament-participant.component";
import {Device} from "@capacitor/device";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

@Component({
  selector: 'app-tournament-detail',
  templateUrl: './tournament-detail.page.html',
  styleUrls: ['./tournament-detail.page.scss'],
})
export class TournamentDetailPage implements OnInit {
  @ViewChild('modalRank') modalRank: IonModal;
  id=0;
  number=0;
  participants=0;
  title="";
  tournament:any={};
  show_pointer=false;
  tabID="company";
  name="";
  texte="";
  content="";
  isLoadingRank = true;
  is_phone=false;
  user:any={};
  is_user=false;
  is_event=false;
  can_subscribe=false;
  phone:number;
  cod_id:number;
  cod_name="";
  MIN = NUMBER_RANGE.min;
  MAX = NUMBER_RANGE.max;

  imagesContainer= new FormData();
  image = "";
  file_selected=false;

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
    Device.getLanguageCode().then(d=>{
      this.translate.use(d.value);
      moment.locale(d.value);
    })

    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      this.id= this.router.getCurrentNavigation().extras.state.id;
      this.getTournament(this.id);
      this.getParticipants(this.id);
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.name;
    } else {
      //console.log("pas d'id");
      this.id=1;
      this.getTournament(this.id);
      this.getParticipants(this.id);
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

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.is_user=true;
      this.user=JSON.parse(localStorage.getItem('user_wz'));
      this.is_subscription = this.api.checkSubscription(this.user.subscription).is_actived;
      //this.phone=this.user.phone;
      this.checkSubscription();
    } else {
      this.is_user=false;
    }
    if(localStorage.getItem('wz_settings')!='undefined'){
      this.settings = JSON.parse(localStorage.getItem('wz_settings'));
    } else {

    }
  }

  getTournament(id){
    this.id=id;
    const opt = {
      _includes:"participants"
    };

    this.api.get('tournaments',id,opt).then((d:any)=>{
      if(d.start_at==d.end_at){
        d.jour = moment(d.start_at).format('DD');
      } else {
        d.jour = moment(d.start_at).format('DD')+" - "+moment(d.end_at).format('DD');
      }
      d.mois = moment(d.end_at).format('MMMM');
      this.tournament = d;
      this.isLoading=false;
      this.is_event=d.is_event;
    },q=>{
      this.util.handleError(q);
    })
  }

  getParticipants(id){
    const opt = {
      should_paginate:false,
      tournament_id:id,
      '_agg':'count'
    };
    this.api.getList('participants',opt).then((d:any)=>{
      this.participants = d;
    },q=>{
      this.util.handleError(q);
    })
  }

  async listParticipant(o?:any){
    o=this.id;
    const modal = await this.modalController.create({
      component: ModalTournamentParticipantComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'objet': o
      }
    });
    return await modal.present();

  }

  async selectImage(choix) {
    let image:any=undefined;
    if(choix=='take'){
      image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera // Camera, Photos or Prompt!
      });
    } else {
      image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos // Camera, Photos or Prompt!
      });
    }

    this.image = image.webPath;

    if (image) {
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      this.file_selected=true;
      this.imagesContainer.append('image', blob, new Date().getTime()+".png");
    }
  }

  backToPreviousPage(){
    document.getElementById('backButton').click();
  }

  participate(){
    if(this.tournament.is_cod){
      // ouverture du modal avec les infos
    } else {
      this.askSchedule();
    }
  }

  async askSchedule(){
    if(this.tournament.is_cod && !this.file_selected){
      this.util.doToast("Image absente",3000, 'light')
    } else {
      let price = this.tournament.fees;
      if(this.is_subscription){
        price*=0.8;
      }
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: "Confirmation",
        subHeader:"Voulez-vous participer ? Cela vous coûtera "+price+"U",
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

  }

  showSchedule(){
    let price = this.tournament.fees;
    if(this.is_subscription){
      price*=0.8;
    }
    if(price==0 || price<this.user.unit){
      this.util.showLoading("payment");

      const opt ={
        type:'tournament',
        tournament_id:this.tournament.id,
        cod_id:this.cod_id,
        cod_name:this.cod_name,
        user_id:this.user.id,
        is_s:this.is_subscription,
        price_was:price
      };

      this.api.post('participants',opt).then(d=>{
        if(this.tournament.is_cod && this.file_selected){
          // enregistrement de l'iamge
          let te = "Votre inscription au tournoi "+this.tournament.name+" a été enregistrée. Nous procédons à la vérifications de vos informations";
          this.api.updateImage(this.imagesContainer,'participants',d,te);
        } else {
          this.util.doToast("Votre inscription au tournoi "+this.tournament.name+" a été enregistrée",3000);
        }
        this.can_subscribe=false;
        this.modalRank.setCurrentBreakpoint(0);
        this.doRefresh("");
        this.util.hideLoading();
      },q=>{
        this.util.hideLoading();
        this.util.handleError(q);
      })

    } else {
      this.api.rechargeAccount(this.tournament.fees,this.user.id);
    }
  }

  checkNumber(){
    this.is_phone = this.MIN <= this.phone && this.phone <= this.MAX;
  }

  openModal(){
    document.getElementById('open-modal').click();
  }

  support(){
    if(this.translate.getDefaultLang()=='fr'){
      window.location.href="https://api.whatsapp.com/send?phone=237673996540&text=Bonjour+je+souhaite+reserver+pour+le+tournoi+"+this.tournament.name;
    } else {
      window.location.href="https://api.whatsapp.com/send?phone=237673996540&text=Hello+I+want+to+buy+for+tournament"+this.tournament.name;
    }
  }

  checkSubscription(){

    const opt = {
      user_id:this.user.id,
      tournament_id:this.id,
      state:'paid'
    };

    this.api.getList('participants',opt).then((d:any)=>{
      if(d.length>0){
        this.number=d[0].id;
        // l'utilisateur a déjà effectué une reservation
        this.can_subscribe = false;
        this.texte = "Vous participez déjà à ce tournoi";
        if(this.is_event){
          this.texte="Vous participez déjà à cet évènement"
        }
      } else {
        this.can_subscribe=true;
      }
    })
  }

  async subscribe(){
    let titre = "Devenir membre";
    let text = "Vous allez devenir membre de la salle et bénéficier de reduction sur nos prix. Coût : 1 000U";
    let result = "Bienvenue cher membre. Vous bénéficier des reductions sur nos prix";
    if(this.user.unit>=1000){
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
              let target = "subscriptions";
              const opt = {
                pack_id:4,
                user_id:this.user.id,
                type:'pack'
              };
              this.util.showLoading('initiation_payment');
              this.api.post(target,opt).then(d=>{
                this.util.hideLoading();
                this.util.doToast(result,5000)
                this.ionViewWillEnter();
                this.getTournament(this.id);
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
      this.recharge();
      //this.util.doToast('Solde insuffisant. Veuillez recharger votre compte',3000);
    }


  }

  async recharge() {
    let titre = "Devenir membre";
    let text = "Vous allez devenir membre de la salle. Entrez le numéro pour le paiement mobile";
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
            let type = "account-subscription";
            if(!isNaN(data.phone) && data.phone <= NUMBER_RANGE.max && data.phone >= NUMBER_RANGE.min){
              this.util.showLoading("treatment");
              const opt = {
                type,
                'pack_id':4,
                user_id:this.user.id
              };
              this.api.post('init_buy_account',opt).then(async (d:any) => {
                // initialisation du payment my-coolPay
                this.api.post('payment/' + d.id + '/' + data.phone,{}).then(e=>{
                  this.util.hideLoading();
                  this.util.doToast('payment_pending',5000);
                  this.ionViewWillEnter();
                  this.getTournament(this.id);
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

  async rechargeAccount(fees) {
    let text = "Recharger votre compte de "+fees+"U. Entrer le numéro pour le paiement mobile";
    const alert = await this.alertController.create({
      header: this.TEXT,
      subHeader: text,
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
                type:'account',
                amount:data.amount,
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
          placeholder: this.AMOUNT,
          type:'number',
          name:'amount',
          value:fees,
          attributes: {
            step:50,
            min: 0
          },
        },
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

  login(){
    this.router.navigateByUrl('/login');
  }

  becomeMember(){
    this.modalRank.setCurrentBreakpoint(0);
    this.router.navigateByUrl('/tabs/store');
  }

  doRefresh(event) {
    this.texte="";
    this.ionViewWillEnter();
    this.getTournament(this.id);
    this.getParticipants(this.id);
    this.checkSubscription();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

}
