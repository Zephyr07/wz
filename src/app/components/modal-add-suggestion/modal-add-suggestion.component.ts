import {Component, Input, OnInit} from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import {ModalController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-modal-add-suggestion',
  templateUrl: './modal-add-suggestion.component.html',
  styleUrls: ['./modal-add-suggestion.component.scss'],
})
export class ModalAddSuggestionComponent implements OnInit {
  @Input() objet:any;
  titre = "Nouvelle suggestion";
  content="";
  user:any={};

  constructor(
    private util:UtilProvider,
    private modalController:ModalController,
    private translate:TranslateService,
    private api:ApiProvider,
  ) {
    this.translate.get('new_suggestion').subscribe(async (res: string) => {
      this.titre=res;
    }, q=>{
      //console.log(q);
    })
    this.user=JSON.parse(localStorage.getItem('user_playce'));
  }

  ngOnInit() {
    if(this.objet!=undefined){
      this.translate.get('update_suggestion').subscribe(async (res: string) => {
        this.titre=res;
      }, q=>{
        //console.log(q);
      })
      this.content=this.objet.content;
    }
  }

  saveSuggestion(){
    if(this.checkForm()){
      this.util.showLoading('saving');
      if(this.objet!=undefined){
        this.objet.content=this.content;
        this.objet.status='new';
        this.objet.put().subscribe(d=>{
          this.util.hideLoading();
          this.util.doToast('suggestion_edit',3000);
          this.dismiss();
        }, q=>{
          this.util.hideLoading();
          this.util.handleError(q);
        })
      } else {
        //ajout
        this.api.Suggestions.post({content:this.content,status:'new',user_id:this.user.id}).subscribe(d=>{
          this.util.hideLoading();
          this.util.doToast("suggestion_save",3000);
          this.dismiss();
        }, q=>{
          this.util.hideLoading();
          this.util.handleError(q);
        })
      }
      // edit


    }
  }

  checkForm(){
   if(this.content==""){
      this.util.doToast("description_missed",5000);
      return false
    } else {
      return true;
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
