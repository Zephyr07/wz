import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UtilProvider} from "../../providers/util/util";
import {ApiProvider} from "../../providers/api/api";
import {ModalCgvComponent} from "../../components/modal-cgv/modal-cgv.component";
import {ModalController} from "@ionic/angular";
import {ModalCguComponent} from "../../components/modal-cgu/modal-cgu.component";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  settings:any={
    android:{
      subscription:false
    },
    ios:{
      subscription:false
    }
  };


  constructor(
    private router:Router,
    private util:UtilProvider,
    private api:ApiProvider,
    private modalController : ModalController
  ) {

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // recupération des settings
    if(localStorage.getItem('wz_settings')!='undefined'){
      this.settings = JSON.parse(localStorage.getItem('wz_settings'))[0];
    } else {

    }
  }

  async cgv(){
    const modal = await this.modalController.create({
      component: ModalCgvComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }

  async cgu(){
    const modal = await this.modalController.create({
      component: ModalCguComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }

  goToAccount(){
    //const navigationExtra : NavigationExtras = {state: {film:{'name':f.name, 'id':f.id}}};
    this.router.navigateByUrl('user');
  }

  goToReferral(){
    //const navigationExtra : NavigationExtras = {state: {film:{'name':f.name, 'id':f.id}}};
    this.router.navigateByUrl('referral');
  }

  contactUs(){
    document.getElementById('contact').click();
  }

  askLanguage(){
    this.api.askLanguage();
  }

}
