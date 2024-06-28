import {Component, OnInit} from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {AdmobProvider} from "../../providers/admob/AdmobProvider";

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

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
      this.admob.showBanner('bottom',30);
    }

  }

  ionViewWillLeave(){
    let settings = JSON.parse(localStorage.getItem('wz_settings'));
    if(settings.pub=='enable'){
      this.admob.hideBanner();
    }
  }


  goToGame(category_id){
    let name = "PS5";
    if(category_id==1){
      name= "PS4"
    } else if(category_id==3){
      name = "Réalité Virtuelle"
    }
    if(category_id==0){
      this.router.navigateByUrl('tabs/game/mini-game')
    } else {
      const navigationExtra : NavigationExtras = {state: {name, category_id}};
      this.router.navigateByUrl('tabs/game/game-list',navigationExtra)
    }
  }
}
