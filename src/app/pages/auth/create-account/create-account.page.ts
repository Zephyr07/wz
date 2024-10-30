import { Component, OnInit } from '@angular/core';
import {UtilProvider} from "../../../providers/util/util";
import {AuthProvider} from "../../../providers/auth/auth";
import {ApiProvider} from "../../../providers/api/api";
import {Router} from "@angular/router";
import {MenuController, NavController} from "@ionic/angular";
import {NUMBER_RANGE} from "../../../services/contants";
import {isCordovaAvailable} from "../../../services/utils";
import {Device} from "@capacitor/device";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  is_loading=false;
  email:any="";
  password="";
  password_confirmation="";
  user_name="";
  gender="";
  private lang="";

  constructor(
    private util:UtilProvider,
    private auth:AuthProvider,
    private api:ApiProvider,
    private router:Router,
    private navCtrl:NavController,
    private menuController : MenuController
  ) {
    this.menuController.enable(false);
  }


  ngOnInit() {
    Device.getLanguageCode().then(d=>{
      this.lang=d.value;
    });
  }

  register() {
    if(this.checkForm()){
      this.util.showLoading('register');
      const opt={
        email:this.email.trim(),
        gender:this.gender,
        password:this.password,
        settings:JSON.stringify([{"language":this.lang},{"notification":"true"}]),
        password_confirmation:this.password_confirmation
      };
      this.auth.register(opt).then((d:any)=>{
        if(isCordovaAvailable()){
          //OneSignal.sendTags({'country_id':d.user.country_id});
        }
        this.util.hideLoading();
        localStorage.setItem('user_lv',JSON.stringify(d.user));
        this.util.doToast('Compte créé',3000,'tertiary');
        this.navCtrl.navigateRoot(['/activated-account']);

      }, q=>{
        this.util.doToast(JSON.stringify(q),3000,'primary');
        this.util.hideLoading();
        this.util.handleError(q);
      })
    }
    //localStorage.setItem('uid','rahul');

  }

  checkSpecialCharater(text) {
    if (text.split(" ").length > 1) {
      return false
    } else if (text.split(",").length > 1) {
      return false
    } else if (text.split(";").length > 1) {
      return false
    } else if (text.split("#").length > 1) {
      return false
    } else if (text.split("@").length > 1) {
      return false
    } else if (text.split("/").length > 1) {
      return false
    } else if (text.split("\\").length > 1) {
      return false
    } else if (text.split("\"").length > 1) {
      return false
    } else if (text.split("'").length > 1) {
      return false
    } else if (text.split("?").length > 1) {
      return false
    } else if (text.split("!").length > 1) {
      return false
    } else if (text.split("$").length > 1) {
      return false
    } else if (text.split("*").length > 1) {
      return false
    } else if (text.split("(").length > 1) {
      return false
    } else if (text.split(")").length > 1) {
      return false
    } else if (text.split("]").length > 1) {
      return false
    } else if (text.split("[").length > 1) {
      return false
    } else if (text.split("{").length > 1) {
      return false
    } else if (text.split("}").length > 1) {
      return false
    } else if (text.split("+").length > 1) {
      return false
    } else if (text.split("=").length > 1) {
      return false
    } else if (text.split("&").length > 1) {
      return false
    } else {
      return true
    }
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


    if (this.gender==null || this.gender==''){
      this.util.doToast("Erreur sur le genre",3000, 'primary');
      return false;
    } else if (this.email==null || this.email==''){
      this.util.doToast("Erreur sur l'email",3000, 'primary');
      return false;
    } else if (!check_email){
      this.util.doToast("Erreur sur l'email",3000, 'primary');
      return false;
    } else if (this.password.length<8){
      this.util.doToast("Le mot de passe doit contenir 8 caractères",3000, 'primary');
      return false;
    } else {
      return true
    }
  }

  goToLogin(){
    this.router.navigateByUrl('login');
  }
}
