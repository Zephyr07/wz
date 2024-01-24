import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";
import {ModalController, Platform} from "@ionic/angular";
import {UtilProvider} from "../../providers/util/util";

@Component({
  selector: 'app-modal-add-question',
  templateUrl: './modal-add-question.component.html',
  styleUrls: ['./modal-add-question.component.scss'],
})
export class ModalAddQuestionComponent implements OnInit {
  title = null;
  user:any;
  titre="new_question";

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
        title:this.util.capitalize(this.title),
        status:"enable",
        user_id:this.user.id
      };

      this.api.post('questions',p).then(d=>{
        this.util.doToast('question_save',3000);
        this.dismiss('create-question');
      },q=>{
        this.util.handleError(q);
      })
    }
  }

  checkForm(){
    if(this.title==""){
      this.util.doToast("title_empty",5000);
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
}
