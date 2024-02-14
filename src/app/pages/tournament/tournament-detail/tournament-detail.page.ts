import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonInfiniteScroll, IonModal, ModalController, NavController} from "@ionic/angular";
import {ApiProvider} from "../../../providers/api/api";
import {Router} from "@angular/router";
import {UtilProvider} from "../../../providers/util/util";
import {TranslateService} from "@ngx-translate/core";
import {NUMBER_RANGE} from "../../../services/contants";

@Component({
  selector: 'app-tournament-detail',
  templateUrl: './tournament-detail.page.html',
  styleUrls: ['./tournament-detail.page.scss'],
})
export class TournamentDetailPage implements OnInit {
  @ViewChild('modalRank') modalRank: IonModal;
  id=0;
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
  can_subscribe=false;
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

  OUI="";
  NON="";
  TITLE="";
  TEXT="";
  isLogged = false;

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
      this.getTournament(this.id);
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.name;
    } else {
      //console.log("pas d'id");
      this.id=1;
      this.getTournament(this.id);
    }
    this.translate.get('yes').subscribe( (res: string) => {
      this.OUI=res;
    });
    this.translate.get('no').subscribe( (res: string) => {
      this.NON=res;
    });
    this.translate.get('ignore_buy_title').subscribe( (res: string) => {
      this.TITLE=res;
    });
    this.translate.get('ignore_buy_text').subscribe( (res: string) => {
      this.TEXT=res;
    });
  }

  ngOnInit() {
  }

  getTournament(id){
    this.id=id;
    const opt = {
      _includes:"participants"
    };

    this.api.get('tournaments',id,opt).then(d=>{
      this.tournament = d;
      this.isLoading=false;
    },q=>{
      this.util.handleError(q);
    })
  }


  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_wz'));
      //this.phone=this.user.phone;
      this.checkSubscription();
    }
    if(localStorage.getItem('wz_settings')!='undefined'){
      this.settings = JSON.parse(localStorage.getItem('wz_settings'))[0];
    } else {

    }
  }

  backToPreviousPage(){
    document.getElementById('backButton').click();
  }

  showSchedule(){
    if(this.tournament.fees<this.user.unit){
      this.util.showLoading("payment");

      const opt ={
        type:'tournament',
        tournament_id:this.tournament.id,
        user_id:this.user.id,
        price_was:this.tournament.fees
      };

      this.api.post('participants',opt).then(d=>{
        this.util.doToast("Votre inscription au tournoi "+this.tournament.name+" a été enregistrée",3000);
        this.can_subscribe=false;
        this.util.hideLoading();
      },q=>{
        this.util.hideLoading();
        this.util.handleError(q);
      })

    } else {
      this.util.doToast("Solde insuffisant. Veuillez recharger votre compte",5000);
    }
  }

  checkNumber(){
    this.is_phone = this.MIN <= this.phone && this.phone <= this.MAX;
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
        // l'utilisateur a déjà effectué une reservation
        this.can_subscribe = false;
        this.texte = "Vous participez déjà a ce tournoi";
      } else {
        this.can_subscribe=true;
      }
    })
  }

  doRefresh(event) {
    this.getTournament(this.id);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

}
