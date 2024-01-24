import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-simulateur',
  templateUrl: './simulateur.page.html',
  styleUrls: ['./simulateur.page.scss'],
})
export class SimulateurPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  goTo(url){
    this.router.navigateByUrl(url);
  }
}
