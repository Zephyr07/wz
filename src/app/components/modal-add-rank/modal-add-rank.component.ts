import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";

@Component({
  selector: 'app-modal-add-rank',
  templateUrl: './modal-add-rank.component.html',
  styleUrls: ['./modal-add-rank.component.scss'],
})
export class ModalAddRankComponent implements OnInit {
  objet:any={};
  user:any={};
  note = 0;
  content="";

  comments:any=[];
  isLoadingRank=true;

  per_page = 20;
  page = 1;
  last_page = 10000000;
  max_length = 0;
  old_max_length = 0;

  constructor(
    private modalController:ModalController,
    private api:ApiProvider,
    private util:UtilProvider
  ) {

  }

  ngOnInit() {
    if(this.objet.target=='training'){
      this.getCommentTraining()
    }
  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_lr'));
    } else{
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  getCommentTraining(){

    const opt = {
      ratingable_type:'App\\Models\\Training',
      ratingable_id:this.objet.id,
      should_paginate:true,
      _includes:'user.partner',
      _sort:'created_at',
      _sortDir:'desc',
      per_page:this.per_page,
      page:this.page
    };

    this.api.getList('ratings',opt).then((r:any)=>{
      if(r.length>0){
        this.last_page = r.metadata.last_page;
        this.max_length = r.metadata.total;
        this.old_max_length = this.max_length;
        r.forEach(v=>{
          //v.created_at = moment(v.created_at).format("DD MMM YYYY");
          if(v.user.partner.image.split('product_poster').length>0){
            // pas d'image
            // attribution image par defaut
            v.user.partner.image="../../../../assets/icon/lr.png"
          }
          this.comments.push(v);
        });
        if(this.page==1){
          this.isLoadingRank=false;
        }
        this.page++;
      } else {
        this.isLoadingRank=false;
        //this.util.hideLoading();

      }
    }, q=>{
      this.util.handleError(q);
    })
  }

  saveRank(){
    let tmp = "";
    if(this.objet.target=='product'){
      tmp='App\\Models\\Product';
    } else {
      tmp='App\\Models\\Training'
    }
    this.util.showLoading('saving');
    // verification s'il n'exite pas déjà de note pour cette place
    const opt = {
      ratingable_id:this.objet.id,
      ratingable_type: tmp,
      user_id:this.user.id
    }

    this.api.getList('ratings',opt).then((d:any)=>{
      if(d.length>0){
        // il existe une note, modification de la valeur
        let rank = d[0];
        rank.rating = this.note;
        rank.comment = this.content;

        this.api.put('ratings',rank.id,rank).then(r=>{
          // note mise à jour
          this.util.hideLoading();
          this.dismiss();
          this.util.doToast('notice_save',2000);
        }, q=>{
          this.util.hideLoading();
          this.util.handleError(q);
        })
      } else {
        // il n'existe pas de note
        // creation
        const opt ={
          comment:this.content,
          rating:this.note,
          ratingable_id:this.objet.id,
          ratingable_type: tmp,
          user_id:this.user.id
        };

        this.api.post('ratings',opt).then(d=>{
          this.util.hideLoading();
          this.note = 0;
          this.content="";
          this.dismiss();
          this.util.doToast('notice_save',2000);
        }, q=>{
          this.util.hideLoading();
          this.util.handleError(q);
        })
      }
    }, q=>{
      this.util.hideLoading();
      this.util.handleError(q);
    })
  }
}
