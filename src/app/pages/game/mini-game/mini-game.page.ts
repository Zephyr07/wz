import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {AdmobProvider} from "../../../providers/admob/AdmobProvider";

@Component({
  selector: 'app-mini-game',
  templateUrl: './mini-game.page.html',
  styleUrls: ['./mini-game.page.scss'],
})
export class MiniGamePage implements OnInit {

  constructor(
    private router:Router,
    private admob:AdmobProvider
  ) {

  }

  ngOnInit() {

  }

  ionViewWillEnter(){
    let settings = JSON.parse(localStorage.getItem('wz_settings'));
    if(settings.pub=='enable'){
      this.admob.showBanner('bottom',0);
    }
  }

  ionViewWillLeave(){
    let settings = JSON.parse(localStorage.getItem('wz_settings'));
    if(settings.pub=='enable'){
      this.admob.hideBanner();
    }
  }


  goToGame(target){
    if(target=='10'){
      this.router.navigateByUrl('triple-choice')
    } else if (target=='memory'){
      this.router.navigateByUrl('memory-game')
    }
  }
}
