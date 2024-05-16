import {Injectable} from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  ToastController
} from '@ionic/angular';
import {RouteProvider} from "./route";
import {Router} from "@angular/router";
//import {Geolocation} from "@capacitor/geolocation";
import {TranslateService} from "@ngx-translate/core";
import * as CryptoJS from 'crypto-js';
import {CryptoJSAesJson, IV, KEY} from "../../services/contants";
import {Photo} from "@capacitor/camera";
import {Filesystem} from "@capacitor/filesystem";


@Injectable()
export class UtilProvider {
  public date_format = 'Y-M-D';
  public position:any={};
  public autoplay_val = 5000;
  public slide_speed = 700;
  public load: any;

  CANCEL="";
  TEXT="";
  CONTACT="";
  DELETE="";
  YES="";
  NO="";
  CONNECT="";
  DELETE_TITLE="";

  NOT_LOGGED_TITLE="";
  NOT_LOGGED_CONTENT="";
  SIGNIN="";

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public modalController: ModalController,
    public loadingController: LoadingController,
    private router: Router,
    private route: RouteProvider,
    public navCtrl: NavController,
    private plt: Platform,
    private translate:TranslateService
  ) {
    this.translate.get('yes').subscribe( (res: string) => {
      this.YES=res;
    });
    this.translate.get('no').subscribe( (res: string) => {
      this.NO=res;
    });
    this.translate.get('close').subscribe( (res: string) => {
      this.CANCEL=res;
    });
    this.translate.get('help_for_contact').subscribe( (res: string) => {
      this.TEXT=res;
    });
    this.translate.get('delete_title').subscribe( (res: string) => {
      this.DELETE_TITLE=res;
    });
    this.translate.get('contact_me').subscribe( (res: string) => {
      this.CONTACT=res;
    });
    this.translate.get('deleted').subscribe( (res: string) => {
      this.DELETE=res;
    });
    this.translate.get('login').subscribe( (res: string) => {
      this.CONNECT=res;
    });
    this.translate.get('not_logged_title').subscribe( (res: string) => {
      this.NOT_LOGGED_TITLE=res;
    });
    this.translate.get('not_logged_content').subscribe( (res: string) => {
      this.NOT_LOGGED_CONTENT=res;
    });
    this.translate.get('signin').subscribe( (res: string) => {
      this.SIGNIN=res;
    });
  }

  formarPrice(price) {
    if (price === undefined) {
      return '';
    } else {
      price += '';
      const tab = price.split('');
      let p = '';
      for (let i = tab.length; i > 0; i--) {
        if (i % 3 === 0) {
          p += ' ';
        }
        p += tab[tab.length - i];
      }
      return p;
    }
  }

  async doToast(text, time, color?,pos?:'top' | 'middle' | 'bottom'){
    let p:'top' | 'middle' | 'bottom' = "bottom";
    if(pos){
      p=pos;
    }
    this.translate.get(text).subscribe(async (res: string) => {
      if (color == undefined) {
        color = 'primary';
      }
      const toast = await this.toastController.create({
        message: res,
        color,
        position: p,
        duration: time
      });
      toast.present();
    }, q=>{
      //console.log(q);
    });

  }

  async showLoading(text) {
    this.translate.get(text).subscribe(async (res: string) => {
      this.load = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: res
      });
      await this.load.present();
    }, q=>{
      //console.log(q);
    })
  }

  async hideLoading(){
    this.load.dismiss();
    const { role, data } = await this.load.onDidDismiss();
  }

  handleError(q, next?){
    if(q.response){
      q=q.response;
    }
    if(q.data.ct){
      // crypté
      q.data = this.decryptAESData(JSON.stringify(q.data));
    }
    if (q.data.status_code === 401) {
      if(q.data.errors.message[0]=="These credentials do not match our records."){
        this.doToast('bad_credential',3000,'danger');
      } else {
        this.doToast('Vous n\'êtes pas connecté',3000);
      }
      localStorage.setItem('user_taxi_driver',undefined);
      /*if(next){
        this.presentToastWithOptions(next);
      }*/
    } else if(q.status === 401){
      this.doToast('bad_credential',3000);
    } else if (q.status === 422) {
      let message = "";
      for(let i in q.data.errors){
        message+=""+q.data.errors[i][0]+", ";
      }
      this.doToast(message,5000, 'light');
    } else if (q.error) {
      this.doToast(q.error,3000, 'light');
    } else {
      //alert(JSON.stringify(q.data));
      if(q.data.error && q.data.error.message){
        this.doToast(JSON.stringify(q.data.error.message)+ '\n Erreurs ' + q.data.error.status_code,5000);
      } else {
        this.doToast(JSON.stringify(q.data.message)+ '\n Erreur ',5000 , 'light');
      }
      //this.hideLoading();
    }
  }

  async presentToastWithOptions(text,next,time?,button_text?) {
    this.translate.get(text).subscribe(async (res: string) => {
      let button = this.CONNECT;
      if(button_text){
        button = button_text
      }
      const toast = await this.toastController.create({
        message: res,
        //position: 'top',
        color: 'secondary',
        duration: time,
        buttons: [
          {
            cssClass:"buttonToast",
            text: button,
            role: 'cancel',
            handler: () => {
              // redirection vers next
              this.navCtrl.navigateRoot( next);
            }
          }
        ]
      });
      toast.present();
    }, q=>{
      //console.log(q);
    })

  }

  /*async openSearchModal() {
    const modal = await this.modalController.create({
      component: ModalSearchComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }*/

  capitalize(str){
    if(str!=null){
      return str.charAt(0).toUpperCase() + str.slice(1);
    } else {
      return str;
    }
  }

  async presentAlertPrompt(url:string, state:any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Connectez-vous',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Mot de passe',
          cssClass: 'specialClass',
          attributes: {
            maxlength: 6,
            inputmode: 'decimal'
          }
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Connexion',
          handler: (data:any) => {
            //console.log('Confirm Ok', data);
            if(data.email!="" && data.password!=""){
             // connexion

             //redirection
              this.route.routeToProduct(state);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async loginModal(){
    this.showModal(this.NOT_LOGGED_TITLE, this.NOT_LOGGED_CONTENT, this.SIGNIN, 'login')
  }

  async showModal(title,message, buttonText, next) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: message,
      buttons: [
        {
          text: this.CANCEL,
          role: 'cancel',
          handler: (blah) => {

          }
        },
        {
          text: buttonText,
          role: 'confirm',
          handler: (blah) => {
            this.navCtrl.navigateRoot( next);
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    //console.log('onDidDismiss resolved with role', role);
  }

  handleData(c,state){
    localStorage.setItem('recent_place',JSON.stringify(c));
    this.navCtrl.navigateRoot(['/tabs']);
    if(state){
      console.log("recent places loaded");
    } else {
      console.log("recent places loaded without GPS");
    }
    return false;
  }

  rad(x) {
    return x * Math.PI / 180;
  }

  distance(p1, p2) {
    let R = 6378137; // Earth’s mean radius in meter
    let dLat = this.rad(p2.lat - p1.lat);
    let dLong = this.rad(p2.lng - p1.lng);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d; // returns the distance in meter
  }

  getCoords(){
    /*Geolocation.getCurrentPosition().then((resp) => {
      //console.log('coordonnées ok');
      this.position={lat:resp.coords.latitude,lng:resp.coords.longitude};
      localStorage.setItem('position',JSON.stringify({lat:resp.coords.latitude,lng:resp.coords.longitude}));
    }).catch((error) => {
      ////console.log('Error getting location', error);
    });*/
  }

  formatCategory(cat){
    let x = '';
    let i = 1;
    cat.forEach(v=>{
      x+=v.category.name;
      i++;
      if(i<=cat.length){
        x+=' / '
      }
    });

    return x;
  }

  avgRating(ratings){
    if(ratings.length==0){
      return 0;
    } else {
      let i=0;
      ratings.forEach(v=>{
        i+=v.rating;
      });
      return i/ratings.length;
    }
  }

  async deleteItem(i, item, state, call) {
    // ask for delete
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: this.DELETE_TITLE,
      buttons: [
        {
          text: this.NO,
          role: 'cancel',
          handler: (blah) => {

          }
        },
        {
          text: this.YES,
          role: 'confirm',
          handler: (blah) => {
            this.showLoading('deleting');
            i.remove().subscribe((a: any) => {
              this.hideLoading();
              let texte = item;
              if (i.name) {
                texte += ' ' + i.name + " " + this.DELETE;
              } else {
                texte += ' ' + i.title + " " + this.DELETE
              }

              if (state) {
                texte += "e"
              }
              this.doToast(texte, 3000);
              call;
            }, q => {
              this.hideLoading();
              this.handleError(q)
            })
          }
        }
      ]
    });
    await alert.present();

  }

  async contact() {
    const alert = await this.alertController.create({
      header: this.TEXT,
      subHeader:this.CONTACT,
      buttons: [
        {
          text: this.CANCEL,
          role: 'cancel',
        }
      ]
    });

    await alert.present();
  }

  encryptAESData(data:any){
    return CryptoJS.AES.encrypt(JSON.stringify(data), KEY, {format: CryptoJSAesJson}).toString();
  }

  decryptAESData(text:string){
    //console.log("text : ",text);
    return JSON.parse(CryptoJS.AES.decrypt(text, KEY, {format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
  }

  public async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });

      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

// Helper function
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  about_dev(){
    this.doToast("Cette application a été developpée par EGOFISANCE S.A.R.L | " +
      "\n Chef de projet : Edward NANDA - edward.nanda@egofisance.com",
      5000,'primary','middle');
  }
}
