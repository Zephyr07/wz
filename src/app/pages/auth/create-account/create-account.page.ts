import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";
import * as _ from 'lodash';
import {AuthProvider} from "../../../providers/auth/auth";
import {Device} from "@capacitor/device";
import {AlertController, NavController} from "@ionic/angular";
import {Router} from "@angular/router";
import {isCordovaAvailable} from "../../../services/utils";
import {TranslateService} from "@ngx-translate/core";
import {NUMBER_RANGE} from "../../../services/contants";
import OneSignal from "onesignal-cordova-plugin";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  d = new Date();
  max_date = "";
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop:true
  };
  MIN = NUMBER_RANGE.min;
  MAX = NUMBER_RANGE.max;
  imagesContainer= new FormData();
  referral:any = null;
  sponsor_code:any = null;
  image = "";
  step=0;
  country_id=0;
  file_selected=false;
  texte="next";
  full_name:any=null;
  phone:any=null;
  email:any=null;
  password:any=null;
  gender:any=null;
  birthday:any=null;
  lang="";

  countries:any=[];
  itemsCountry:any=[];
  country:any={};

  constructor(
    private router:Router,
    private api:ApiProvider,
    private util:UtilProvider,
    private alertController:AlertController,
    private navCtrl:NavController,
    private auth:AuthProvider,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('fr');
    let m = "", j="";
    if(this.d.getMonth()+1<10){
      m="0"+(this.d.getMonth()+1);
    } else {
      m=""+this.d.getMonth()+1;
    }

    if(this.d.getDate()<10){
      j="0"+this.d.getDate();
    } else {
      j=""+this.d.getDate();
    }

    this.max_date = this.d.getFullYear()+'-'+m+"-"+j;
  }

  ngOnInit() {
    Device.getLanguageCode().then(d=>{
      this.lang=d.value;
    });
  }

  backToPreviousPage(){
    document.getElementById('backButton').click();
  }

  next(){

    if(this.step==0){
      this.phone = parseInt(this.phone);
      // verification si le numéro est dans le bon format
      if (this.phone>NUMBER_RANGE.min){
        if(this.phone<NUMBER_RANGE.max ){
          // OK
          // verification si le numéro est déjà dans la base de donnée
          const opt = {
            phone:this.phone,
            _includes:'person'
          };

          this.api.getList('users',opt).then((e:any)=>{
            if(e.length>0){
              // utilisateur existant
              this.login();
            } else {
              this.step+=1;
            }
          })
        } else {
          // not ok
          this.step=0;
          this.texte="next";
          this.util.doToast("Le numéro doit être compris entre "+(NUMBER_RANGE.min)+" et "+(NUMBER_RANGE.max),2000, 'danger');
        }
      } else {
        //not ok
        this.step=0;
        this.texte="next";
        this.util.doToast("Le numéro doit être compris entre "+(NUMBER_RANGE.min)+" et "+(NUMBER_RANGE.max),2000, 'danger');
      }
    } else if(this.step==2){
      // verification si l'email existe déjà
      if (this.email!=""){
        const opt = {
          email:this.email,
          _includes:'person'
        };

        this.api.getList('users',opt).then((e:any)=>{
          if(e.length>0){
            if(e[0].person==null){
              // utilisateur pas habilité à entrer dans l'application
              this.util.doToast("Contactez le support au +237 690070009 pour assistance",5000,'warning');
            } else {
              this.login();
            }
          } else {
            this.step+=1;
          }
        })
      }
    } else if(this.step==4){
      if(this.sponsor_code!="" && this.sponsor_code!=null){
        if(!this.checkSpecialCharater(this.sponsor_code)){
          this.util.doToast('sponsor_code_blank_space',3000, 'light','top');
        } else {
          // verification si le sponsor_code existe
          const opt ={
            sponsor_code:this.sponsor_code
          };

          this.api.getList('users',opt).then((d:any)=>{
            if(d.length<=0){
              //code n'existe pas
              this.step+=1;
              if(this.step==6){
                this.texte = "save";
              }
            } else {
              this.sponsor_code="";
              this.util.doToast('sponsor_code_exist',3000, 'warning','top');
            }
          })
        }

      } else{
        this.util.doToast('sponsor_code_empty',3000, 'warning','top');
      }

    } else if(this.step==5){
      if(this.referral!="" && this.referral!=null){
        // verification si le code promo existe
        const opt ={
          sponsor_code:this.referral
        }

        this.api.getList('users',opt).then((d:any)=>{
          if(d.length>0){
            //code existant
            this.step+=1;
            if(this.step==6){
              this.texte = "save";
            }
          } else {
            this.referral="";
            this.util.doToast('referral_not_exist',3000, 'warning','top');
          }
        })
      } else{
        this.step+=1;
        if(this.step==6){
          this.texte = "save";
        }
      }

    } else if(this.step==6){
      this.texte = "save";
      this.save();
    } else {
      this.step+=1;
      if(this.step==6){
        this.texte = "save";
      }
    }
  }

  checkSpecialCharater(text){
    if(text.split(" ").length>1){
      return false
    } else if(text.split(",").length>1){
      return false
    } else if(text.split(";").length>1){
      return false
    } else if(text.split("#").length>1){
      return false
    } else if(text.split("@").length>1){
      return false
    } else if(text.split("/").length>1){
      return false
    } else if(text.split("\\").length>1){
      return false
    } else if(text.split("\"").length>1){
      return false
    } else if(text.split("'").length>1){
      return false
    } else if(text.split("?").length>1){
      return false
    } else if(text.split("!").length>1){
      return false
    } else if(text.split("$").length>1){
      return false
    } else if(text.split("*").length>1){
      return false
    } else if(text.split("(").length>1){
      return false
    } else if(text.split(")").length>1){
      return false
    } else if(text.split("]").length>1){
      return false
    } else if(text.split("[").length>1){
      return false
    } else if(text.split("{").length>1){
      return false
    } else if(text.split("}").length>1){
      return false
    } else if(text.split("+").length>1){
      return false
    } else if(text.split("=").length>1){
      return false
    } else if(text.split("&").length>1){
      return false
    } else {
      return true
    }
  }

  getCountries(){
    const opt ={
      should_paginate:false,
      _sort:'name',
      _sortDir:'asc'
    };
    this.api.getList('countries',opt).then(d=>{
      this.countries=d;
    }, q=>{
      this.util.handleError(q);
    })
  }

  async inputCountryChanged($event){
    let value = $event.target.value;
    if(value.length<= 0){
      this.itemsCountry = [];
      return;
    }
    const items = this.countries.filter(
      (item:any)=> item.name.includes(value)
    )
    this.itemsCountry = items;
  }

  selectedCountry(item){
    this.country = item;
    this.country_id = item.id;
    this.itemsCountry=[];
  }

  async login(){
    let external_id = localStorage.getItem("external_id");
    const alert = await this.alertController.create({
      header: 'Compte existant',
      subHeader:"Entrez votre mot de passe pour accéder à votre compte",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            this.step=0
          },
        },
        {
          text: 'Connexion',
          role: 'confirm',
          handler: (data) => {
            const opt = {
              email:this.phone,
              password:data.password
            };
            if(this.step==2){
              opt.email=this.email
            }

            this.util.showLoading('identification');
            this.auth.login(opt).then((d:any)=>{
              if(isCordovaAvailable()){
                //OneSignal.sendTags({'country_id':d.user.country_id});
              }
              localStorage.setItem('is_user','true');
              this.util.hideLoading();
              this.navCtrl.navigateRoot(['/tabs'])
            }, q=>{
              this.util.hideLoading();
              this.util.doToast("Mot de passe incorrect",3000,'warning');
            })
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Mot de passe',
          type:"password",
          name:"password",
        }
      ],
    });

    await alert.present();
  }

  previous(){
    if(this.step>0){
      this.step-=1;
      if(this.step<5){
        this.texte="next"
      }
    }
  }

  addImage(){
    document.getElementById('file-inputs').click();
  }

  save(){
    let external_id = localStorage.getItem("external_id");
    if(this.checkForm()){
      this.util.showLoading('saving');
      // enregistrement des données
      const opt = {
        full_name:this.util.capitalize(this.full_name),
        password:this.password,
        password_confirmation:this.password,
        //country_id:this.country_id,
        phone:this.phone,
        email:this.email,
        referral:this.referral,
        sponsor_code:this.sponsor_code,
        //external_id,
        settings:JSON.stringify([{"language":this.lang},{"notification":"true"}])
      };
      
      /*if(this.referral==null || this.referral == ""){
        delete opt.referral;
      }*/

      this.auth.register(opt).then((r:any)=>{
        localStorage.setItem('is_user','true');
        if(isCordovaAvailable()){
          //OneSignal.sendTags({'country_id':this.country_id});
        }
        this.api.updateImage(this.imagesContainer,'people',r.user.person,'account_created');
        //this.navCtrl.navigateRoot(['/user']);
        this.navCtrl.navigateRoot(['/tabs']);
        //this.navCtrl.navigateRoot(['/activated-account']); // activation du compte
        this.util.hideLoading();
      },q=>{
        this.util.hideLoading();
        this.util.handleError(q);
      });
    }
  }

  onSelectFile(event:any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    //this.imageSrc = reader.result as string;
    this.file_selected=true;
    this.imagesContainer.append('image', event.target.files[0], event.target.files[0].name);
    reader.onload = () => {
      this.image = reader.result as string;
    };
  }

  checkForm(){
    let check_email=false;
    if(this.email!=null){
      const opt = this.email.split('@');
      if(opt.length==2){
        const tmp = opt[1].split('.');
        check_email = tmp.length >= 2;
      } else {
        check_email= false;
      }
    }


    if(this.full_name==null || this.full_name==''){
      this.step=1;
      this.texte="next";
      this.util.doToast("Erreur sur le nom complet",3000, 'danger');
      return false;
    } else if (isNaN(this.phone)){
      this.step=0;
      this.texte="next";
      this.util.doToast("Erreur sur le numéro de téléphone",3000, 'danger');
      return false;
    } else if (!isNaN(this.phone) && (this.phone<NUMBER_RANGE.min || this.phone>NUMBER_RANGE.max)){
      this.step=0;
      this.texte="next";
      this.util.doToast("Le numéro doit être compris entre 620 000 000 et 699 999 99",3000, 'danger');
      return false;
    } else if (this.email==null || this.email==''){
      this.step=2;
      this.texte="next";
      this.util.doToast("Erreur sur l'email",3000, 'danger');
      return false;
    } else if (!check_email){
      this.step=2;
      this.texte="next";
      this.util.doToast("Erreur sur l'email",3000, 'danger');
      return false;
    } else if (!this.file_selected){
      this.step=3;
      this.texte="next";
      this.util.doToast("Erreur sur l'image",3000, 'danger');
      return false;
    } else if (this.password.length<8){
      this.step=6;
      this.util.doToast("Le mot de passe doit contenir 8 caractères",3000, 'danger');
      return false;
    } else {
      return true
    }
  }

  doRefresh(event) {
    Device.getLanguageCode().then(d=>{
      this.lang=d.value;
    });
    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }


  goToLogin(){
    this.router.navigateByUrl('login');
  }
}
