import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {AuthProvider} from "../../providers/auth/auth";

@Component({
  selector: 'app-modal-edit-user',
  templateUrl: './modal-edit-user.component.html',
  styleUrls: ['./modal-edit-user.component.scss'],
})
export class ModalEditUserComponent implements OnInit {

  password = "";
  gender = "";
  user:any={};

  constructor(
    private api:ApiProvider,
    private router: Router,
    private util:UtilProvider,
    private auth:AuthProvider,
    private modalController:ModalController
  ) {
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_lv'));
      this.gender=this.user.gender;
    } else{
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
//    this.getTowns();
  }

  save(){
    const opt={
      gender:this.gender,
      password:this.password,
      current_password:this.password,
      password_confirmation:this.password,
      id:this.user.id
    };
    this.util.showLoading("saving");

    this.auth.update_info(opt).then((d:any)=>{
      localStorage.setItem('user_ka',JSON.stringify(d.user));
      this.util.hideLoading();
      this.util.doToast('info_updated',3000);
      this.confirm();
    },q=>{
      this.util.hideLoading();
      this.util.handleError(q)
    })
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalController.dismiss('user_updated', 'confirm');
  }

}
