import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-green-thursday',
  templateUrl: './green-thursday.page.html',
  styleUrls: ['./green-thursday.page.scss'],
})
export class GreenThursdayPage implements OnInit {

  grade="";
  rank="";
  pvA:any=0;
  pvB:any=0;
  pvC:any=0;
  strong_leg="";
  parrain=false;
  child_count=0;

  parrainage=0;
  performance=0;
  developpement=0;
  epargne=0;

  constructor() { }

  ngOnInit() {
  }

  greenThursday(){
    let pv=0;
    if(this.strong_leg=="a"){
      if(this.pvB!=0 && this.pvC!=0){
        pv = this.pvB + this.pvC;
      }
    } else if(this.strong_leg=="b"){
      if(this.pvA!=0 && this.pvC!=0){
        pv = this.pvA + this.pvC;
      }
    } else if(this.strong_leg=="c"){
      if(this.pvA!=0 && this.pvB!=0){
        pv = this.pvA + this.pvB;
      }
    }

    if(this.grade=="platine"){
      this.rank="D1"
    }
    if(this.grade=="vip"){
      this.rank="D2"
    }

    this.parrainage = 6000*this.child_count;

    if(this.grade=="qsilver" || this.grade=="silver"){
      this.performance=pv*48;
    } else if(this.grade=="gold"){
      this.performance=pv*60;
    } else if(this.grade=="platine" || this.grade=="vip"){
      this.performance=pv*72;
    }

    if(this.grade!="qsilver" && this.grade!=""){
      this.developpement = Math.trunc(pv/60)*3600;
    } else{
      this.developpement=0;
    }

    if(this.rank!='D0' && this.rank!="D1" && this.rank!=""){
      this.epargne= Math.trunc((this.developpement+this.performance)*0.05);
    } else {
      this.epargne = 0;
    }

  }
}
