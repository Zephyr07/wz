import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {UtilProvider} from "../../providers/util/util";
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";

@Component({
  selector: 'app-modal-edit-user',
  templateUrl: './modal-edit-user.component.html',
  styleUrls: ['./modal-edit-user.component.scss'],
})
export class ModalEditUserComponent implements OnInit {
  d = new Date();
  max_date = "";
  imagesContainer= new FormData();
  image = "";
  full_name = "";
  first_name = "";
  gender = "";
  town_id = 0;
  phone:any;
  birthday:any;
  user:any;
  person:any={};
  file_selected=false;

  itemsTown:any=[];
  towns:any=[];
  town:any={};

  constructor(
    private api:ApiProvider,
    private router: Router,
    private util:UtilProvider,
    private modalController:ModalController
  ) {
    if(this.api.checkUser()){
      this.user=JSON.parse(localStorage.getItem('user_wz'));
      this.getPerson(this.user.person.id);
    } else{
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
//    this.getTowns();
  }

  async selectImage(choix) {
    let image:any=undefined;
    if(choix=='take'){
      image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera // Camera, Photos or Prompt!
      });
    } else {
      image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos // Camera, Photos or Prompt!
      });
    }

    this.image = image.webPath;

    if (image) {
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      this.file_selected=true;
      this.imagesContainer.append('image', blob, new Date().getTime()+".png");
    }
  }

  save(){
    this.person.id=this.person.id;
    this.person.full_name=this.util.capitalize(this.full_name);
    //this.person.gender=this.gender;
    //this.person.birthday=this.birthday.substring(0,19);
    delete this.person.image;
    this.util.showLoading("saving");

    this.api.put('people',this.person.id,this.person).then(d=>{
      if(this.file_selected){
        this.api.updateImage(this.imagesContainer,'people',d,'info_updated');
        this.util.hideLoading();
        this.dismiss();
      } else {
        this.util.hideLoading();
        this.util.doToast('info_updated',3000);
        this.dismiss();
      }
    },q=>{
      this.util.hideLoading();
      this.util.handleError(q)
    })
  }

  getPerson(id){
    this.api.get('people',id).then((d:any)=>{
      this.person = d;
      this.full_name=d.full_name;
      this.image=d.image;
      //this.gender=d.gender;
      //this.birthday=d.birthday.substring(0,19);

    })
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
