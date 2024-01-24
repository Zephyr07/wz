import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonModal, ModalController} from "@ionic/angular";
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import * as moment from "moment";
import * as _ from "lodash";
import {NavigationExtras, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {NUMBER_RANGE} from "../../services/contants";
import {ModalAddRankComponent} from "../../components/modal-add-rank/modal-add-rank.component";

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {

  @ViewChild('modalDetail') modal: IonModal;
  trainings=[];
  old_trainings=[];
  training:any={
    town:{}
  };

  is_participation = false;
  user:any={};
  search="";

  TRAINING_TITLE="";
  TRAINING_TEXT="";
  BUY="";
  CANCEL="";
  PHONE_NUMBER_TITLE="";
  PHONE="";
  PHONE_NUMBER_TEXT="";


  is_loading=true;

  constructor(
    private api:ApiProvider,
    private util:UtilProvider,
    private alertController:AlertController,
    private modalController:ModalController,
    private router:Router,
    private translate:TranslateService
  ) {
    this.translate.get('cancel').subscribe( (res: string) => {
      this.CANCEL=res;
    });
    this.translate.get('phone_number_title').subscribe( (res: string) => {
      this.PHONE_NUMBER_TITLE=res;
    });
    this.translate.get('phone').subscribe( (res: string) => {
      this.PHONE=res;
    });
    this.translate.get('phone_number_text').subscribe( (res: string) => {
      this.PHONE_NUMBER_TEXT=res;
    });
    this.translate.get('training_title').subscribe( (res: string) => {
      this.TRAINING_TITLE=res;
    });
    this.translate.get('training_text').subscribe( (res: string) => {
      this.TRAINING_TEXT=res;
    });
    this.translate.get('buy').subscribe( (res: string) => {
      this.BUY=res;
    });
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      let id= this.router.getCurrentNavigation().extras.state.id;
      // alors un seminaire est là
      this.getTraining(id);
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.title;
    } else {

    }
  }

  ngOnInit() {
    this.getTrainings();
  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user = JSON.parse(localStorage.getItem('user_lr'));
      if(this.user.country==undefined){
        this.api.get('countries',this.user.country_id).then(d=>{
          this.user.country = d;
          console.log(d);
          localStorage.setItem('user_lr',JSON.stringify(this.user));
        })
      } else {
        console.log(this.user.country);
      }
    } else {

    }
  }

  ionViewWillLeave(){
    this.modal.setCurrentBreakpoint(0);
  }

  getTrainings(){
    this.is_loading=true;
    const opt = {
      should_paginate:false,
      _sort:'price',
      _sortDir:'asc',
      status:"enable",
      _includes:"modules,training_users"
    };

    this.api.getList('trainings',opt).then((d:any)=>{
      d.forEach(v=>{
        v.modules=_.orderBy(v.modules,'order');
        v.students = _.filter(v.training_users,{status:'active'}).length;
      });

      this.old_trainings=d;
      this.trainings=d;
      this.is_loading=false;
    },q=>{
      this.util.handleError(q);
    })
  }

  getTraining(id){
    const opt = {
      should_paginate:false,
      _sort:'title',
      _sortDir:'asc',
      status:"enable",
      _includes:"modules,training_users"
    };

    this.api.get('trainings',id,opt).then((d:any)=>{
      d=d.body;
      d.modules=_.orderBy(d.modules,'order');
      d.students = _.filter(d.training_users,{status:'active'}).length;
      this.training=d;
      document.getElementById('open-modal').click();
    },q=>{
      this.util.handleError(q);
    })
  }

  contactUs(){
    document.getElementById('contact').click();
  }

  newTraining(){
    window.location.href="https://api.whatsapp.com/send?phone=237696870700&text=Bonjour+je+veux+ajouter+une+formation+à+l'application";
  }

  startTraining(t){
    // si gratuit alors route vers module

    const opt = {
      user_id:this.user.id,
      training_id:t.id
    };

    this.api.getList('training_users',opt).then((d:any)=>{
      if(d.length>0){
        // verification du status
        if(d[0].status=='active'){
          // utilisateur a déjà souscrit à la formation
          const navigationExtra : NavigationExtras = {state: {title:t.title, id:t.id}};
          this.router.navigateByUrl('training/module',navigationExtra);
        } else {
          // suppression de ce qui n'a pas été payé
          this.api.remove('training_users',d[0].id);

          if(t.price <1){
            // ajout du training user
            const o =  {
              user_id:this.user.id,
              training_id:t.id,
              status:'active'
            };

            this.api.post('training_users',o).then(da=>{

              const navigationExtra : NavigationExtras = {state: {title:t.title, id:t.id}};
              this.router.navigateByUrl('training/module',navigationExtra);
            });
          } else {
            // ask for number to for payment
            //this.util.showModal(this.TRAINING_TITLE,this.TRAINING_TEXT,this.BUY,'training/buy-training')

            if(this.user.country.payment_status=='enable'){
              this.askNumber(t);
            } else {
              this.util.doToast("Paiement non autorisé pour votre pays",3000,'danger');
            }
          }
        }
      } else {
        if(t.price <1){
          // ajout du training user
          const o =  {
            user_id:this.user.id,
            training_id:t.id,
            status:'active'
          };

          this.api.post('training_users',o).then(da=>{

            const navigationExtra : NavigationExtras = {state: {title:t.title, id:t.id}};
            this.router.navigateByUrl('training/module',navigationExtra);
          });
        } else {
          // ask for number to for payment
          //this.util.showModal(this.TRAINING_TITLE,this.TRAINING_TEXT,this.BUY,'training/buy-training')

          if(this.user.country.payment_status=='enable'){
            this.askNumber(t);
          } else {
            this.util.doToast("Paiement non autorisé pour votre pays",3000,'danger');
          }
        }

      }
    },q=>{
      this.util.handleError(q);
    })
  }

  async newRank(o?:any){
    if(this.api.checkUser()){
      o=this.training;
      o.target = 'training';
      const modal = await this.modalController.create({
        component: ModalAddRankComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'objet': o
        }
      });
      return await modal.present();
    } else {
      this.util.loginModal();
    }

  }

  async askNumber(t){
    const alert = await this.alertController.create({
      header: this.PHONE_NUMBER_TITLE,
      subHeader:this.PHONE_NUMBER_TEXT,
      buttons: [
        {
          text: this.CANCEL,
          role: 'cancel',
        },
        {
          text: this.BUY,
          role:'confirm',
          handler:(data)=>{
            //this.util.showLoading("updating");
            this.util.showLoading('initiation_payment');
            // creation du paiement en type account
            const opt = {
              type:'training',
              pack_id:t.id,
              duration:1
            };
            this.api.post('init_buy_training',opt).then(async (d:any) => {
              // initialisation du payment my-coolPay
              this.api.post('payment/' + d.id + '/' + data.phone,{}).then(e=>{
                this.util.hideLoading();
                this.util.doToast('payment_pending',5000);
                // redirection vers la page de l'user

              }, q=>{
                this.util.doToast(q.message,'3000','danger');
                this.util.hideLoading();
                this.util.handleError(q);
              })
              //console.log(d);
            },q=>{
              this.util.hideLoading();
              this.util.handleError(q);
            });

          }
        },
      ],
      inputs: [
        {
          placeholder: this.PHONE,
          type:'number',
          value:this.user.phone,
          name:'phone',
          attributes: {
            min: NUMBER_RANGE.min+1,
            max: NUMBER_RANGE.max-1,
          },
        }
      ],
    });

    await alert.present();
  }

  goTo(s){
    document.getElementById('open-modal').click();
    const x = _.filter(s.participants,{user_id:this.user.id, training_id:s.id});
    this.is_participation = x.length > 0;
    this.training = s;
  }

  closeModal(){
    this.modal.setCurrentBreakpoint(0);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.trainings = this.old_trainings;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.trainings = this.trainings.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.getTrainings();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
