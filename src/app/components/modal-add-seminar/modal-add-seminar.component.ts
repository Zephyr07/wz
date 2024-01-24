import { Component, OnInit } from '@angular/core';
import {NUMBER_RANGE} from "../../services/contants";
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";
import {ModalController, Platform} from "@ionic/angular";
import {UtilProvider} from "../../providers/util/util";
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {Directory, Filesystem} from "@capacitor/filesystem";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-modal-add-seminar',
  templateUrl: './modal-add-seminar.component.html',
  styleUrls: ['./modal-add-seminar.component.scss'],
})
export class ModalAddSeminarComponent implements OnInit {

  is_image=false;

  MIN = NUMBER_RANGE.min;
  MAX = NUMBER_RANGE.max;

  towns:any=[];
  where="physic";
  imagesContainer= new FormData();
  image:any = {};
  link = null;
  title = null;
  description = null;
  locality = null;
  start_at:any = null;
  price = null;
  town_id = 0;
  phone:any = null;
  user:any;
  file_selected=false;
  titre="new_seminar";

  itemsTown:any=[];
  town:any={};

  options={
    header: 'Catégorie',
    subHeader: 'Select your favorite color',
  };
  d = new Date();
  min_date = "";

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
    this.min_date = this.d.getFullYear()+'-'+m+"-"+j;
  }

  ngOnInit() {
    this.getTowns();

  }

  getTowns(){
    const opt ={
      should_paginate:false,
      _sort:'title',
      _sortDir:'asc'
    };
    this.api.getList('towns',opt).then(d=>{
      this.towns=d;
    })
  }

  getTown(id){
    this.api.get('towns',id).then((d:any)=>{
      this.town = {title:d.title}
    })
  }


  async inputTownChanged($event){
    let value = $event.target.value;
    if(value.length<= 0){
      this.itemsTown = [];
      return;
    }
    const items = this.towns.filter(
      (item:any)=> item.title.includes(value)
    )
    this.itemsTown = items;
  }

  selectedTown(item){
    this.town = item;
    this.town_id = item.id;
    this.itemsTown=[];
  }

  async selectImage(choix) {
    let image:any=undefined;
    if(choix=='take'){
      image = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera // Camera, Photos or Prompt!
      });
    } else {
      image = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos // Camera, Photos or Prompt!
      });
    }

    this.image.url = image.webPath;

    if (image) {
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      this.file_selected=true;
      this.imagesContainer.append('image', blob, new Date().getTime()+".png");
      await this.savePicture(image);
    }
  }

  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.util.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }

  save(){
    if(this.checkForm()){

      const p = {
        title:this.title,
        description:this.description,
        locality:this.locality,
        start_at:this.start_at,
        link:this.link,
        status:"enable",
        phone:this.phone,
        price:this.price,
        town_id:this.town_id,
        user_id:this.user.id
      };
      if(this.price==null){
        delete p.price;
      }

      if(this.user.phone=='696870700' || this.user.phone=='693051450'){
        p.status='enable';
      }

      if(this.where=="online"){
        delete p.town_id;
        delete p.locality;
      } else {
        delete p.link;
      }

      this.api.post('seminars',p).then((d:any)=>{
        if(this.file_selected){
          if(d.seminar){
            this.api.updateImage(this.imagesContainer,'seminars',d.seminar,'seminar_save');
            this.dismiss('create-seminar');
          } else {
            this.api.updateImage(this.imagesContainer,'seminars',d,'seminar_save');
            this.dismiss('create-seminar');
          }
        } else {
          this.util.doToast('seminar_save',3000);
          this.dismiss('create-seminar');
        }
      },q=>{
        this.util.handleError(q);
      })
    }
  }

  checkForm(){
    if(this.title==""){
      this.util.doToast("title_empty",3000, 'warning');
      return false;
    } else if(this.description==""){
      this.util.doToast("description_empty",3000, 'warning');
      return false;
    } else if (this.phone == 0 || this.phone==undefined){
      this.util.doToast("phone_empty",3000, 'warning');
      return false;
    } else if (this.phone < this.MIN || this.phone>this.MAX){
      this.util.doToast("bad_range_phone",3000, 'warning');
      return false;
    } else if (this.start_at==null){
      this.util.doToast("date_empty",3000, 'warning');
      return false;
    } else if (this.where=="online" && (this.link==""||this.link==undefined)){
      this.util.doToast("link_empty",3000, 'warning');
      return false;
    } else if (this.where=="physic" && (this.locality==""||this.locality==undefined)){
      this.util.doToast("locality_empty",3000, 'warning');
      return false;
    } else if (this.where=="physic" && (this.town_id==0)){
      this.util.doToast("town_empty",3000, 'warning');
      return false;
    } else if (!this.file_selected){
      this.util.doToast("empty_image",3000, 'warning');
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

    this.getTowns();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
