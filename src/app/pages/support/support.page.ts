import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import * as moment from "moment";
import {ApiProvider} from "../../providers/api/api";
import {Share} from "@capacitor/share";
import {ModalCgvComponent} from "../../components/modal-cgv/modal-cgv.component";
import {ModalCguComponent} from "../../components/modal-cgu/modal-cgu.component";
import {AlertController, ModalController, Platform} from "@ionic/angular";

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {
  version = environment.version;
  lang="";


  constructor(
    private router:Router,
    private modalController:ModalController,
    private alertController:AlertController,
    private api:ApiProvider,
    private platform:Platform
  ) { }

  ngOnInit() {
    this.lang = moment().locale();
  }

  async shareApp(){
    let url = "https://play.google.com/store/apps/details?id=com.zayan.confidens";
    if(this.platform.is('ios')){
      url=""
    }
    await Share.share({
      title: 'Découvre Confidens ',
      text: 'Un espace où tu peux parler de tes soucis en toute anonymat et trouver du soutien auprès d\'une communauté bienveillante. Pose tes questions, partage tes doutes, et reçois des conseils sans jugement. 🤝💬',
      url
    });
  }

  askLanguage(){
    this.api.askLanguage();
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

  contact(){
    document.location.href="mailto:myconfidens@gmail.com"
  }

}
