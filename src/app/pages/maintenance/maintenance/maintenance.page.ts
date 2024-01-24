import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {environment} from "../../../../environments/environment";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.scss'],
})
export class MaintenancePage implements OnInit {
  time=5;
  seconde = 59;
  minute = 4;
  interval:any;
  constructor(
    private api : ApiProvider,
    private navCtrl : NavController,
  ) { }

  ngOnInit() {
    this.interval = setInterval(()=>{
      if(this.seconde==0){
        this.seconde = 59;
        this.minute--;
      }else {
        this.seconde--;
      }
      if(this.minute==0 && this.seconde == 0){
        this.doRefresh();
      }
      // verification si la maintenance est terminée
    }, 1000)
  }

  ionViewWillLeave(){
    clearInterval(this.interval)
  }

  doRefresh() {
    this.api.getList('settings').then(d=>{
      if(JSON.parse(d[0].config)[0].maintenance=="true"){
        // application en cours de maintenance
        this.seconde=59;
        this.minute=4;
      } else if(JSON.parse(d[0].config)[0].upgrade=="true"){
        // mise à jour obligatoire à faire
        this.navCtrl.navigateRoot(['/update']);
      } else {
        let version = JSON.parse(d[0].config)[0].version;
        localStorage.setItem('lr_settings',JSON.stringify(JSON.parse(d[0].config)));
        if(environment.version == version){
          this.navCtrl.navigateRoot(['/tabs']);
        } else {
          this.navCtrl.navigateRoot(['/update']);
        }
      }

    });


    setTimeout(() => {
      console.log('Async operation has ended');
    }, 500);
  }

}
