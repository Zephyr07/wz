import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";
import {ModalController, Platform} from "@ionic/angular";
import {UtilProvider} from "../../providers/util/util";
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {Directory, Filesystem} from "@capacitor/filesystem";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-modal-add-tournament',
  templateUrl: './modal-add-tournament.component.html',
  styleUrls: ['./modal-add-tournament.component.scss'],
})
export class ModalAddTournamentComponent  implements OnInit {

  is_image=false;

  countries:any=[];

  imagesContainer= new FormData();
  image:any = {};
  name = null;
  description = null;
  min_participant:any;
  max_participant:any;
  winner_price:any;
  fees:any;
  user:any;
  image_selected=false;
  titre="new_tournament";


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
      this.user=JSON.parse(localStorage.getItem('user_wz'));

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
      // awzeady loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }

  save(){
    if(this.checkForm()){
      const p = {
        name:this.util.capitalize(this.name),
        description:this.util.capitalize(this.description),
        start_at:this.start_at,
        min_participant:this.min_participant,
        max_participant:this.max_participant,
        fees:this.fees,
        winner_price:this.winner_price,
        status:"enable"
      };

      this.api.post('tournaments',p).then((d:any)=>{
        if(this.image_selected){
          if(d.tournament){
            this.api.updateImage(this.imagesContainer,'tournaments',d.tournament,'tournament_save');
            this.dismiss('create-tournament');
          } else {
            this.api.updateImage(this.imagesContainer,'tournaments',d,'tournament_save');
            //this.dismiss('create-tournament');
          }
        } else {
          this.util.doToast('tournament_save',3000);
          this.dismiss('create-tournament');
        }
      },q=>{
        this.util.handleError(q);
      })
    }
  }

  checkForm(){
    if(this.name==""){
      this.util.doToast("name_empty",5000);
      return false;
    } else if (this.start_at==undefined){
      this.util.doToast("start_at_empty",5000);
      return false;
    } else if (this.fees==undefined){
      this.util.doToast("fees_empty",5000);
      return false;
    } else if (this.winner_price==undefined){
      this.util.doToast("winner_price_empty",5000);
      return false;
    } else if (this.min_participant==undefined){
      this.util.doToast("min_participant_empty",5000);
      return false;
    } else if ( !this.image_selected){
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

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
