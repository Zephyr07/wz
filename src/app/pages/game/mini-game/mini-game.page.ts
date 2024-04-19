import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-mini-game',
  templateUrl: './mini-game.page.html',
  styleUrls: ['./mini-game.page.scss'],
})
export class MiniGamePage implements OnInit {

  constructor(
    private router:Router
  ) {

  }

  ngOnInit() {

  }



  goToGame(target){
    if(target=='10'){
      this.router.navigateByUrl('triple-choice')
    } else if (target=='memory'){
      this.router.navigateByUrl('memory-game')
    }
  }
}
