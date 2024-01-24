import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";
import {ModalController, Platform} from "@ionic/angular";
import {UtilProvider} from "../../providers/util/util";

@Component({
  selector: 'app-modal-add-testimonial',
  templateUrl: './modal-add-testimonial.component.html',
  styleUrls: ['./modal-add-testimonial.component.scss'],
})
export class ModalAddTestimonialComponent implements OnInit {
  objet:any={};
  name="";
  content = null;
  user:any;
  titre="new_testimonial";


  constructor(
    private api:ApiProvider,
    private router: Router,
    private platform:Platform,
    private util:UtilProvider,
    private modalController:ModalController,
  ) {

    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_lr'));
    } else{
      this.router.navigate(['/login']);
    }

  }

  ngOnInit() {

  }


  save(){
    if(this.checkForm()){

      const p = {
        content:this.content,
        status:"pending",
        product_id:this.objet.id,
        user_id:this.user.id
      };

      this.api.post('testimonials',p).then(d=>{
        this.util.doToast('testimonial_save',3000);
        this.dismiss('create-testimonial');
      },q=>{
        this.util.handleError(q);
      })
    }
  }

  checkForm(){
    if(this.content==""){
      this.util.doToast("content_empty",3000, 'warning');
      return false;
    } else {
      return true;
    }
  }

  dismiss(s) {
    this.modalController.dismiss(s);
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data

  }

  doRefresh(event) {

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }


}
