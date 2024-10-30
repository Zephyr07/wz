import { Component, OnInit } from '@angular/core';
import {UtilProvider} from "../../../providers/util/util";
import {AuthProvider} from "../../../providers/auth/auth";
import {NavController} from "@ionic/angular";
import {ApiProvider} from "../../../providers/api/api";

@Component({
  selector: 'app-activated-account',
  templateUrl: './activated-account.page.html',
  styleUrls: ['./activated-account.page.scss'],
})
export class ActivatedAccountPage implements OnInit {
  private user:any={};
  is_loading=false;
  code:any=null;
  email="";

  constructor(
    private util:UtilProvider,
    private api:ApiProvider,
    private auth:AuthProvider,
    private navCtrl:NavController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('user_lv'));
    this.email = this.user.email;
  }

  active() {
    if(this.code<100000 || this.code >999999){
      this.util.doToast('Erreur sur le code d\'activation',3000,'tertiary');
    } else {
      this.util.showLoading('Activation');
      const opt ={
        code:this.code,
        user_id:this.user.id
      };
      this.auth.activate(opt).then(d=>{
        this.util.doToast("Compte activé, vous pouvez vous connecter",2000,'tertiary');
        this.util.hideLoading();
        this.navCtrl.navigateRoot(['/login']);

      }, q=>{
        this.util.hideLoading();
        this.util.doToast('Erreur sur le code d\'activation',3000,'tertiary');
        this.util.handleError(q);
      })
    }

  }

  backToPreviousPage(){
    this.auth.logout();
    document.getElementById('backButton').click();
  }

  sendOTPCode(){
    this.api.post('send_otp',{email:this.email}).then((d:any)=>{
      this.util.doToast(d.data,3000,'tertiary');
    },q=>{
      this.util.handleError(q);
    })
  }

  contactUs(){
    document.location.href="mailto:myconfidens@gmail.com"
  }

}
