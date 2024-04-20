import { Component, OnInit } from '@angular/core';
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  constructor(
    private platform:Platform
  ) { }

  ngOnInit() {
  }

  update(){
    if(this.platform.is('ios')){
      // redirection vers app store
      window.location.href="https://apps.apple.com/cm/app/warzone-salle-de-jeux/id6478315145"
    } else {
      // redirection vers play store
      window.location.href="https://play.google.com/store/apps/details?id=com.egofisance.wz"
    }
  }

}
