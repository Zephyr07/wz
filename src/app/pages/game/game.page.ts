import {Component, OnInit} from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  constructor(
    private router:Router,
  ) {

  }

  ngOnInit() {

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
