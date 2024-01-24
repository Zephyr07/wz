import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";
import {ModalController, Platform} from "@ionic/angular";
import {UtilProvider} from "../../providers/util/util";
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {Directory, Filesystem} from "@capacitor/filesystem";
import {Capacitor} from "@capacitor/core";


@Component({
  selector: 'app-modal-add-promotion',
  templateUrl: './modal-add-promotion.component.html',
  styleUrls: ['./modal-add-promotion.component.scss'],
})
export class ModalAddPromotionComponent implements OnInit {
  is_image=false;

  countries:any=[];

  imagesContainer= new FormData();
  image:any = {};
  title = null;
  description = null;
  country_id = 0;
  user:any;
  image_selected=false;
  titre="new_promotion";


  public file_selected = false;
  public fileSrc ="";
  public file = new FormData();

  d = new Date();
  min_date = "";
  start_at:any;
  end_at:any;

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
    this.getCountries();

  }

  getCountries(){
    const opt ={
      should_paginate:false,
      _sort:'title',
      _sortDir:'asc'
    };
    this.api.getList('countries',opt).then(d=>{
      this.countries=d;
    },q=>{
      this.util.handleError(q);
    })
  }

  selectFile(){
    document.getElementById('fileChoose').click();
  }

  onSelectFile(event:any) {
    this.file_selected = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    //this.imageSrc = reader.result as string;
    this.file.append('file', event.target.files[0], event.target.files[0].name);
    reader.onload = () => {
      this.fileSrc = event.target.files[0].name;
    };
    this.image_selected=false;
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
      this.image_selected=true;
      this.imagesContainer.append('image', blob, new Date().getTime()+".png");
      await this.savePicture(image);
    }
    this.file_selected=false;
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
        title:this.util.capitalize(this.title),
        description:this.util.capitalize(this.description),
        start_at:this.start_at,
        end_at:this.end_at,
        status:"enable",
        country_id:this.country_id,
        user_id:this.user.id
      };

      if(this.user.phone=='696870700' || this.user.phone=='693051450'){
        p.status='enable';
      }

      this.api.post('promotions',p).then((d:any)=>{
        console.log(d);
        if(this.image_selected){
          if(d.promotion){
            this.api.updateImage(this.imagesContainer,'promotions',d.promotion,'promotion_save');
            this.dismiss('create-promotion');
          } else {
            this.api.updateImage(this.imagesContainer,'promotions',d,'promotion_save');
            //this.dismiss('create-promotion');
          }
        } else if(this.file_selected){
          if(d.promotion){
            this.api.updateImage(this.file,'promotions',d.promotion,'promotion_save');
            this.dismiss('create-promotion');
          } else {
            this.api.updateImage(this.file,'promotions',d,'promotion_save');
            //this.dismiss('create-promotion');
          }
        } else {
          this.util.doToast('promotion_save',3000);
          //this.dismiss('create-promotion');
        }
      },q=>{
        this.util.handleError(q);
      })
    }
  }

  checkForm(){
    if(this.title==""){
      this.util.doToast("title_empty",5000);
      return false;
    } else if (this.start_at==undefined){
      this.util.doToast("start_at_empty",5000);
      return false;
    } else if (this.end_at==undefined){
      this.util.doToast("end_at_empty",5000);
      return false;
    } else if (!this.file_selected && !this.image_selected){
      this.util.doToast("empty_image",5000);
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

    this.getCountries();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
