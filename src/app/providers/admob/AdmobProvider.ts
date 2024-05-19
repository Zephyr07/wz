import {Injectable} from '@angular/core';
import {
  AdLoadInfo,
  AdMob, AdmobConsentStatus, AdMobRewardItem,
  AdOptions,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  RewardAdOptions, RewardAdPluginEvents
} from '@capacitor-community/admob';
import {Platform} from "@ionic/angular";
import {ApiProvider} from "../api/api";


@Injectable()
export class AdmobProvider {
  interstitialId="";
  rewardId="";
  bannerId="";

  pub=false;


  private is_testing=true;

  constructor(
    private platform :Platform,
    private api : ApiProvider
  ) {
    /*if(this.platform.is('ios')){
      this.interstitialId="ca-app-pub-2538027924721849/8871542213";
      this.rewardId="ca-app-pub-2538027924721849/8935638317";
      this.bannerId="ca-app-pub-2538027924721849/4851312242";
    } else {
      this.interstitialId="ca-app-pub-2538027924721849/2426920344";
      this.rewardId="ca-app-pub-2538027924721849/6501046662";
      this.bannerId="ca-app-pub-2538027924721849/4445411732";
    }*/
    //this.initialize();
    this.api.getSettings().then((d:any)=>{
      this.pub = d.pub == 'enable';
      if(d.is_testing_ad){
        this.interstitialId="ca-app-pub-3940256099942544/1033173712";
        this.rewardId="ca-app-pub-3940256099942544/5224354917";
        this.bannerId="ca-app-pub-3940256099942544/6300978111";
      } else {
        if(d.pub=='enable'){
          this.is_testing=false;
          if(this.platform.is('ios')){
            this.interstitialId="ca-app-pub-2538027924721849/8871542213";
            this.rewardId="ca-app-pub-2538027924721849/8935638317";
            this.bannerId="ca-app-pub-2538027924721849/4851312242";
          } else {
            this.interstitialId="ca-app-pub-2538027924721849/2426920344";
            this.rewardId="ca-app-pub-2538027924721849/6501046662";
            this.bannerId="ca-app-pub-2538027924721849/4445411732";
          }
        } else {
          this.interstitialId="ca-app-pub-3940256099942544/1033173712";
          this.rewardId="ca-app-pub-3940256099942544/5224354917";
          this.bannerId="ca-app-pub-3940256099942544/6300978111";
        }

      }
    })
  }

  async initialize(){
    await AdMob.initialize();

    const [trackingInfo, consentInfo] = await Promise.all([
      AdMob.trackingAuthorizationStatus(),
      AdMob.requestConsentInfo(),
    ]);

    if (trackingInfo.status === 'notDetermined') {
      /**
       * If you want to explain TrackingAuthorization before showing the iOS dialog,
       * you can show the modal here.
       * ex)
       * const modal = await this.modalCtrl.create({
       *   component: RequestTrackingPage,
       * });
       * await modal.present();
       * await modal.onDidDismiss();  // Wait for close modal
       **/

      await AdMob.requestTrackingAuthorization();
    }

    const authorizationStatus = await AdMob.trackingAuthorizationStatus();
    if (
      authorizationStatus.status === 'authorized' &&
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdmobConsentStatus.REQUIRED
    ) {
      await AdMob.showConsentForm();
    }
  }

  async showBanner(position,margin){
    if(this.pub){
      if(position=='top'){
        position = BannerAdPosition.TOP_CENTER
      } else {
        position = BannerAdPosition.BOTTOM_CENTER
      }
      const adIds = 'ca-app-pub-2538027924721849/4445411732';
      const adId = 'ca-app-pub-3940256099942544/6300978111';
      const options : BannerAdOptions = {
        adId:this.bannerId,
        adSize:BannerAdSize.BANNER,
        position,
        margin,
        isTesting:this.is_testing
      };

      await AdMob.showBanner(options).then(d=>{
        //console.log("Banner Ad Show");
      }).catch(e=>{
        console.log(e);
        console.log(e.message);
      })
    }

  }

  async hideBanner(){
    if(this.pub){
      await AdMob.hideBanner().then(e=>{
        //console.log("hide")
      });
    }
  }

  async removeBanner(){
    if(this.pub){
      await AdMob.removeBanner()
    }

  }

  async loadInterstitial(){
    if(this.pub){

    }
  }

  async showInterstitial(){
    if(this.pub){
      await AdMob.showInterstitial().then(d=>{
        //console.log("Show");
      }).catch(e=> {
        console.log(e);
        console.log(e.message);
      })
    }
  }


  async showRewardVideo2(){
    if(this.pub){
      AdMob.addListener(RewardAdPluginEvents.Rewarded,(reward:AdMobRewardItem)=>{
        //console.log('Reward: ', reward);
      });

      const options: RewardAdOptions ={
        adId:'ca-app-pub-3940256099942544/5224354917',
        isTesting:this.is_testing
      }

      await AdMob.prepareRewardVideoAd(options).then(d=>{
        //console.log("Prepare V");
      }).catch(e=> {
        console.log(e);
        console.log(e.message);
      });
      await AdMob.showRewardVideoAd().then(d=>{
        //console.log("Show V");
      }).catch(e=> {
        console.log(e);
        console.log(e.message);
      });
    }
  }

  async prepareRewardVideo(){
    return new Promise(async (resolve,reject)=>{
      if(this.pub){
        const options: RewardAdOptions = {
          adId: this.rewardId,
          isTesting:this.is_testing
          // isTesting: true
          // npa: true
          // ssv: {
          //   userId: "A user ID to send to your SSV"
          //   customData: JSON.stringify({ ...MyCustomData })
          //}
        };
        await AdMob.prepareRewardVideoAd(options).then(d=>{
          resolve(d);
        }, q=>{
          reject(q);
        });
      } else {
        reject({});
      }
    })
  }

  async showRewardVideo(){
    if(this.pub){
      await AdMob.showRewardVideoAd();
    }
  }
  
}
