import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  phone="";
  constructor(
    private api:ApiProvider,
    private util:UtilProvider
  ) { }

  ngOnInit() {
  }

  reset(){
    // verification si l'email existe
    const opt = {
      phone:this.phone
    }

    this.api.getList('users',opt).then((d:any)=>{
      if(d.length>0){
        // utilisateur existant
        window.location.href="https://api.whatsapp.com/send?phone=237673996540&text=Bonjour+je+souhaite+réinitialiser+mon+mot+de+passe+svp.+Compte : "+this.phone
      } else {
        // utilisateur inexistant
        this.util.doToast('Utilisateur inexistant, merci de creer votre compte',5000,'warning');
      }
    })
  }
}
