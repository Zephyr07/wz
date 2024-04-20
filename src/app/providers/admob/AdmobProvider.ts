import {Injectable} from '@angular/core';
import {
  AdMob, AdMobRewardItem,
  AdOptions,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  RewardAdOptions, RewardAdPluginEvents
} from '@capacitor-community/admob';


@Injectable()
export class AdmobProvider {
  constructor(
    
  ) {
    this.initialize();
  }

  async initialize(){

    const {status} = await AdMob.trackingAuthorizationStatus();
    if(status === 'notDetermined'){
      console.log("Display information before ads load first time")
    }

    AdMob.initialize({
      requestTrackingAuthorization:true,
      testingDevices:[''],
      initializeForTesting:true
    })
  }

  async showBanner(position,margin){
    if(position=='top'){
      position = BannerAdPosition.TOP_CENTER
    } else {
      position = BannerAdPosition.BOTTOM_CENTER
    }
    const adIds = 'ca-app-pub-2538027924721849/4445411732';
    const adId = 'ca-app-pub-3940256099942544/6300978111';
    const options : BannerAdOptions = {
      adId,
      adSize:BannerAdSize.BANNER,
      position,
      margin,
      //isTesting:true
    };

    await AdMob.showBanner(options).then(d=>{
      //console.log("Banner Ad Show");
    }).catch(e=>{
      console.log(e);
      console.log(e.message);
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
      adId:'ca-app-pub-2538027924721849/2426920344',
      //isTesting:true ca-app-pub-2538027924721849/2426920344 3940256099942544/1033173712
    };

    await AdMob.prepareInterstitial(opt).then(d=>{
      //console.log("Prepare");
    }).catch(e=>{
      console.log(e);
      console.log(e.message);
    });
  }

  async showInterstitial(){
    await AdMob.showInterstitial().then(d=>{
      //console.log("Show");
    }).catch(e=> {
      console.log(e);
      console.log(e.message);
    })
  }


  async showRewardVideo(){
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
