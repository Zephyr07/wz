import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.egofisance.wz',
  appName: 'WarZone',
  webDir: 'www',
  /*server: {
    androidScheme: 'https'
  }*/
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 10,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    PushNotifications:{
      "presentationOptions":["badge","sound","alert"]
    }
  }
};

export default config;
