import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import * as moment from 'moment';
import {IonModal, ModalController} from "@ionic/angular";
import {ModalAddSeminarComponent} from "../../components/modal-add-seminar/modal-add-seminar.component";
import {UtilProvider} from "../../providers/util/util";
import * as _ from "lodash";
import {Router} from "@angular/router";

@Component({
  selector: 'app-seminar',
  templateUrl: './seminar.page.html',
  styleUrls: ['./seminar.page.scss'],
})
export class SeminarPage implements OnInit {
  @ViewChild('modalDetail') modal: IonModal;
  seminars=[];
  old_seminars=[];
  seminar:any={
    town:{}
  };

  is_participation = false;
  user:any={};
  search="";
  is_loading=true;

  constructor(
    private api:ApiProvider,
    private util:UtilProvider,
    private modalController:ModalController,
    private router:Router
  ) {
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      let id = this.router.getCurrentNavigation().extras.state.id;
      // alors un seminaire est là
      this.getSeminar(id);
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.title;
    } else {

    }
  }

  ngOnInit() {
    this.getSeminars();
  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user = JSON.parse(localStorage.getItem('user_lr'));
    } else {

    }
  }

  getSeminar(id){
    const opt = {
      _includes:'participants',
    };

    this.api.get('seminars',id,opt).then((d:any)=>{
      let da = moment(d.start_at).utc();
      d.heure = da.format('H') + 'h' + da.format('mm');
      d.jour = da.format('DD');
      d.mois = da.format('MMM');
      d.participant = d.participants.length;
      this.seminar = d;
      document.getElementById('open-modal').click();
    })
  }

  getSeminars(){
    const opt = {
      should_paginate:false,
      "start_at-get":moment().add(-1,'days').format('YYYY-MM-DD'),
      _sort:'start_at',
      _sortDir:'desc',
      _includes:'participants,town.region.country',
      status:"enable"
    };

    this.api.getList('seminars',opt).then((d:any)=>{
      d.forEach(v=>{
        v.search = v.title+" "+v.locality;
        let d = moment(v.start_at).utc();
        v.heure = d.format('H') + 'h' + d.format('mm');
        v.jour = d.format('DD');
        v.mois = d.format('MMM');
        v.participant = v.participants.length;
      });
      this.old_seminars=d;
      this.seminars=d;
      this.is_loading=false;
    },q=>{
      this.util.handleError(q);
    })
  }

  async newSeminar(o?:any){
    if(this.api.checkUser()){
      this.modal.setCurrentBreakpoint(0);
      const modal = await this.modalController.create({
        component: ModalAddSeminarComponent,
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

  participer(id){
    if(this.api.checkUser()){
      let user = JSON.parse(localStorage.getItem('user_lr'));
      const opt = {
        seminar_id:id,
        user_id:user.id
      };

      this.api.post('participants',opt).then((d:any)=>{
        this.is_participation=true;
        this.util.doToast("participation_save",3000);
        this.seminar.participant++;
      },q=>{
        this.util.handleError(q);
      })
    } else {
      this.util.loginModal();
    }
  }

  removeParticipation(id){
    const opt = {
      seminar_id:id,
      user_id:this.user.id
    };

    this.api.getList('participants',opt).then((d:any)=>{
      d[0].remove().then(a=>{
        this.is_participation=false;
        this.seminar.participant--;
        this.util.doToast("participation_cancel",3000);
      })
    },q=>{
      this.util.handleError(q);
    })
  }

  goTo(s){
    document.getElementById('open-modal').click();
    const x = _.filter(s.participants,{user_id:this.user.id, seminar_id:s.id});
    this.is_participation = x.length > 0;
    this.seminar = s;
  }

  closeModal(){
    this.modal.setCurrentBreakpoint(0);
  }
  call(){
    console.log("tel:+"+this.seminar.town.region.country.area_code+""+this.seminar.phone);
    window.open("tel:+"+this.seminar.town.region.country.area_code+""+this.seminar.phone);
  }

  link(){
    window.location.href=this.seminar.link;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.seminars = this.old_seminars;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.seminars = this.seminars.filter((item) => {
        return (item.search.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }
  
  doRefresh(event) {
    this.is_loading=true;
    this.getSeminars();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
