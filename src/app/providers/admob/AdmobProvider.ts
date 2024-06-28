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
import {UtilProvider} from "../util/util";


@Injectable()
export class AdmobProvider {
  interstitialId="";
  rewardId="";
  bannerId="";
  openId="";

  constructor(
    private platform :Platform,
    private util:UtilProvider
  ) {
    if(this.platform.is('ios')){
      this.interstitialId="ca-app-pub-2538027924721849/8871542213";
      this.rewardId="ca-app-pub-2538027924721849/8935638317";
      this.bannerId="ca-app-pub-2538027924721849/4851312242";
    } else {
      this.interstitialId="ca-app-pub-2538027924721849/2426920344";
      this.rewardId="ca-app-pub-2538027924721849/6501046662";
      this.bannerId="ca-app-pub-2538027924721849/4445411732";
    }
    this.initialize();
  }

  async initialize(){
    await AdMob.initialize();

    const [trackingInfo, consentInfo] = await Promise.all([
      AdMob.trackingAuthorizationStatus(),
      AdMob.requestConsentInfo(),
    ]);
  }

  async showBanner(position,margin){
    alert("jai")
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
      margin:50,
      //isTesting:true
    };

    await AdMob.showBanner(options).then(d=>{
      //console.log("Banner Ad Show");
    }).catch(e=>{
      console.log(e);
      this.util.doToast(e.message,3000,"warning");
    })
  }

  async hideBanner(){
    await AdMob.hideBanner().then(e=>{
      //console.log("hide")
    });

    await AdMob.removeBanner()
  }

  async loadInterstitial(){
    const opt : AdOptions={
      adId:this.interstitialId,
      //isTesting:true ca-app-pub-2538027924721849/2426920344 3940256099942544/1033173712
    };

    await AdMob.prepareInterstitial(opt).then(d=>{
      //console.log("Prepare");
    }).catch(e=>{
      console.log(e);
      this.util.doToast(e.message,3000,"warning");
    });
  }

  async showInterstitial(){
    await AdMob.showInterstitial().then(d=>{
      //console.log("Show");
    }).catch(e=> {
      console.log(e);
      this.util.doToast(e.message,3000,"warning");
    })
  }


  async showRewardVideo2(){
    AdMob.addListener(RewardAdPluginEvents.Rewarded,(reward:AdMobRewardItem)=>{
      //console.log('Reward: ', reward);
    });

    const options: RewardAdOptions ={
      adId:'ca-app-pub-3940256099942544/5224354917',
      isTesting:true
    }

    await AdMob.prepareRewardVideoAd(options).then(d=>{
      //console.log("Prepare V");
    }).catch(e=> {
      console.log(e);
      this.util.doToast(e.message,3000,"warning");
    });
    await AdMob.showRewardVideoAd().then(d=>{
      //console.log("Show V");
    }).catch(e=> {
      console.log(e);
      this.util.doToast(e.message,3000,"warning");
    });
  }

  async prepareRewardVideo(){
    return new Promise(async (resolve,reject)=>{
      const options: RewardAdOptions = {
        adId: this.rewardId,
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
    })
  }

  async showRewardVideo(){
    await AdMob.showRewardVideoAd();
  }

}
