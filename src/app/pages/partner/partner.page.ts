import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import * as _ from "lodash";
import {UtilProvider} from "../../providers/util/util";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.page.html',
  styleUrls: ['./partner.page.scss'],
})
export class PartnerPage implements OnInit {

  country:any={};
  pack:any={};
  packs = [];
  combos = [];
  countries = [];
  country_id=0;
  pack_id=0;
  is_pack=false;

  constructor(
    private api: ApiProvider,
    private util: UtilProvider,
    private translate: TranslateService,
  ) {

  }

  ngOnInit() {
    this.getCountries();
  }

  partner(){
    this.pack = _.find(this.packs,{id:parseInt(this.pack_id+"")});
    this.is_pack=true;

  }

  setCountry(){
    this.country = _.find(this.countries,{id:parseInt(this.country_id+"")});
    this.packs = this.country.combos;
    this.is_pack=false;
  }

  getCountries(){
    const opt ={
      should_paginate:false,
      status:'enable',
      _includes:'combos'
    };

    this.api.getList('countries',opt).then((d:any)=>{
      d.forEach(v=>{
        if(v.combos.length>0){
          this.countries.push(v);
        }
      })
    },q=>{
      this.util.handleError(q);
    })
  }

  buyPack(){
    if(this.translate.getDefaultLang()=='fr'){
      window.location.href="https://api.whatsapp.com/send?phone=237696870700&text=Bonjour+je+veux+devenir+partenaire+longrich+au+pack+"+this.pack.name+" ("+this.pack.price+" "+this.country.currency+") ["+this.country.name+"]";
    } else {
      window.location.href="https://api.whatsapp.com/send?phone=237696870700&text=Hello+I+want+to+become+a+longrich+partner+"+this.pack.name+" ("+this.pack.price+" "+this.country.currency+") ["+this.country.name+"]";
    }
  }
}
