import {Component, ViewChild} from '@angular/core';
import {Network} from "@capacitor/network";
import {Router} from "@angular/router";
import {UtilProvider} from "./providers/util/util";
import OneSignal from 'onesignal-cordova-plugin';
import {isCordovaAvailable} from "./services/utils";
import {ApiProvider} from "./providers/api/api";
import {AuthProvider} from "./providers/auth/auth";
import * as moment from "moment";
import {Device} from "@capacitor/device";
import {TranslateService} from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';
import {NotificationProvider} from "./providers/notification/notification";
import {AlertController, NavController, Platform} from "@ionic/angular";
import {environment} from "../environments/environment";
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import {ONE_SIGNAL_CONF} from "./services/contants";
import {AdmobProvider} from "./providers/admob/AdmobProvider";
// register Swiper custom elements
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(Router) nav: Router;

  is_loading = false;
  constructor(
    private util:UtilProvider,
    private api: ApiProvider,
    private auth:AuthProvider,
    private admob:AdmobProvider,
    private notif: NotificationProvider,
    private alertController: AlertController,
    private translate: TranslateService,
    private platform: Platform,
    private navCtrl:NavController,
  ){

    //this.is_loading=!this.api.checkCredential();
    this.splash();

    if(isCordovaAvailable()){
      // initialisation admob
      this.admob.initialize();
      this.OneSignalInit();
      this.notif.init();
      this.notif.navigationEvent.subscribe(
        data => {
          console.log(data);
        }
      );
    }

    // this language will be used as a fallback when a translation isn't found in the current language
    if(!this.api.checkCredential()){
      Device.getLanguageCode().then(d=>{
        this.translate.use(d.value);
        moment.locale(d.value);
      })
    } else {
      translate.setDefaultLang('fr');
    }

    //this.init();
    //this.util.getCoords();

    /*Network.getStatus().then(f=>{
      if(!f.connected){
        this.is_loading=true;

        this.util.doToast('Aucune connexion internet. Veuillez vous connecter',3000, 'danger');
        let interv = setInterval(()=>{
          //
          Network.getStatus().then(f=>{
            if(f.connected){
              // arret du set interval
              clearInterval(interv);
              // initailiastion
              //this.init();
              this.util.getCoords();
            } else {

              this.util.doToast('Aucune connexion internet. Veuillez vous connecter',3000, 'danger');
            }
          })
        },5000)
      } else {
        // contecté

      }
    },q=>{

    });*/


  }

  async splash(){
    await SplashScreen.show({
      showDuration: 2000,
      fadeInDuration:100,
      fadeOutDuration:100,
      autoHide: true,
    });
  }


  init(){
    //recupération des settings
    this.api.getList('settings').then(d=>{
      if(JSON.parse(d[0].config)[0].maintenance=="true"){
        this.is_loading=false;
        // application en cours de maintenance
        this.navCtrl.navigateRoot(['/maintenance']);
      } else if(JSON.parse(d[0].config)[0].upgrade=="true"){
        this.is_loading=false;
        // mise à jour obligatoire à faire
        this.navCtrl.navigateRoot(['/update']);
      } else {
        let version = JSON.parse(d[0].config)[0].android.version;
        if(this.platform.is('ios')){
          version = JSON.parse(d[0].config)[0].ios.version;
        }

        localStorage.setItem('lv_settings',JSON.stringify(JSON.parse(d[0].config)[0]));
        if(version){
          if(environment.code != version){
            // mise à jour disponible
            if(this.platform.is('ios')){
              // redirection vers app store
              this.presentAlertPrompt(JSON.parse(d[0].config)[0].ios.link);
            } else {
              // redirection vers play store
              this.presentAlertPrompt(JSON.parse(d[0].config)[0].android.link);
            }
          }
        }

        // recuperation de la ville de l'utilisateur
        // verification si l'utilisateur a déjà un compte
        if(this.api.checkCredential()){
          //this.util.showLoading('login');
          // connexion
          const cre = this.util.decryptAESData(JSON.parse(localStorage.getItem('auth_lv')));
          this.auth.login(cre).then((e:any)=>{
            localStorage.setItem('is_user','true');
            //this.navCtrl.navigateRoot(['/tabs']);
            //this.util.hideLoading();
            this.is_loading=false;
            /*if(isCordovaAvailable()){
              //OneSignal.sendTags({'country_id':e.user.country_id});
            }
            // chargement des données
            if(e.user.status=='pending_activation'){
              this.navCtrl.navigateRoot(['/activated-account']);
            } else if(e.user.status=='enable') {
              this.navCtrl.navigateRoot(['/tabs']);
            } else {
              this.util.doToast('Contacter le support au +237 673996540',5000, 'warning');
            }*/
          },q=>{
            //this.util.hideLoading();
            this.auth.logout();
            this.is_loading=false;
            //this.navCtrl.navigateRoot(['/login']);
          })

        } else {
          localStorage.setItem('is_user','false');
          // l'utilisateur n'existe pas
          this.is_loading=false;
          //this.navCtrl.navigateRoot(['/login']);
        }
      }
    },q=>{
      //alert("azeaze");
    });
    if(isCordovaAvailable()){
      this.OneSignalInit();
      this.notif.init();
      this.notif.navigationEvent.subscribe(
        data => {
          console.log(data);
        }
      );
    }
  }

  OneSignalInit(){
    //alert("eaz");
    // Uncomment to set OneSignal device logging to VERBOSE
    OneSignal.Debug.setLogLevel(6);

    // NOTE: Update the setAppId value below with your OneSignal AppId.
    OneSignal.initialize(ONE_SIGNAL_CONF.app_id);
    /*OneSignal.setNotificationOpenedHandler(function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });*/
    OneSignal.Notifications.addEventListener('click', async (e) => {
      let clickData = await e.notification;
      console.log("Notification Clicked : " + clickData);
    })


    // iOS - Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
    OneSignal.Notifications.requestPermission(true).then((success: Boolean) => {
      console.log("Notification permission granted " + success);
    })
  }

  getNetworkStatus(){
    Network.getStatus().then(f=>{
      if(!f.connected){
        this.util.doToast('Aucune connexion internet. Veuillez vous connecter',5000);
      }
    });
  }

  async presentAlertPrompt(url:string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Mise à jour disponible',
      subHeader:"Une mise à jour de votre application est disponible.",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Mettre à jour',
          handler: () => {
            window.location.href=url;
          }
        }
      ]
    });

    await alert.present();
  }
}
