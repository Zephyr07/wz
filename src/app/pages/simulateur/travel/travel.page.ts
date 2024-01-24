import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.page.html',
  styleUrls: ['./travel.page.scss'],
})
export class TravelPage implements OnInit {
  is_qualified=false;
  start_at:any=null;
  end_at:any=null;
  start_sponsor_pv:any=0;
  end_sponsor_pv:any=0;

  grade="";
  rank="";
  bonus_leg:any=0;
  pv_leg:any=0;
  pv_leg_total:any=0;
  start_pv:any=0;
  end_pv:any=0;
  start_pvA:any=0;
  end_pvA:any=0;
  start_pvB:any=0;
  end_pvB:any=0;
  start_pvC:any=0;
  end_pvC:any=0;
  sum_pv:any=0;
  sum_2_leg:any=0;
  sum_strong_leg:any=0;
  sponsor:any=0;
  pvC:any=0;
  strong_leg="";
  parrain=false;
  child_count=0;

  parrainage=0;
  performance=0;
  developpement=0;
  epargne=0;

  pv_total:any=null;
  sponsor_total:any=null;
  strong_leg_total:any=null;
  pvA_total:any=null;
  pvB_total:any=null;
  pvC_total:any=null;
  bonus_leg_total:any=null;

  constructor() { }

  ngOnInit() {
  }

  incentive(){

    if(this.rank=='D1'){
      this.bonus_leg = this.pv_leg;
    }

    if(this.end_pv-this.start_pv>=this.sum_pv){
      this.pv_total = 0;
    } else {
      this.pv_total = this.sum_pv - (this.end_pv-this.start_pv);
    }

    if(this.end_sponsor_pv-this.start_sponsor_pv>=this.sponsor){
      this.sponsor_total = 0;
    } else {
      this.sponsor_total = this.sponsor - (this.end_sponsor_pv-this.start_sponsor_pv);
    }

    if(this.end_pvA-this.start_pvA>=this.sum_strong_leg){
      this.strong_leg_total = 0;
    } else {
      this.strong_leg_total = this.sum_strong_leg - (this.end_pvA-this.start_pvA);
    }

    if(this.end_pvA-this.start_pvA>=this.bonus_leg){
      this.pvA_total = 0;
    } else {
      this.pvA_total = this.bonus_leg - (this.end_pvA-this.start_pvA);
    }

    if(this.end_pvB-this.start_pvB>=this.bonus_leg){
      this.pvB_total = 0;
    } else {
      this.pvB_total = this.bonus_leg - (this.end_pvB-this.start_pvB);
    }

    if(this.end_pvC-this.start_pvC>=this.bonus_leg){
      this.pvC_total = 0;
    } else {
      this.pvC_total = this.bonus_leg - (this.end_pvC-this.start_pvC);
    }

    const b = this.end_pvB-this.start_pvB;
    const c = this.end_pvC-this.start_pvC;

    if(b+c>=this.sum_2_leg){
      this.bonus_leg_total = 0;
    } else {
      this.bonus_leg_total = this.sum_2_leg - (b+c);
    }

    if(this.rank=="D0"){
      this.is_qualified= this.bonus_leg_total==0&&this.pv_total==0&&this.sponsor_total==0&&
        this.strong_leg_total==0&&this.pvB_total==0&& this.pvC_total==0;
    } else {
      this.is_qualified= this.pv_leg_total==0&&this.pv_total==0&&this.sponsor_total==0&&
        this.pvA_total==0&& this.pvB_total==0&& this.pvC_total==0;
    }


  }

}
