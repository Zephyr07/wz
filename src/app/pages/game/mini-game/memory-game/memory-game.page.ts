import { Component, OnInit } from '@angular/core';
import {AlertController, NavController} from "@ionic/angular";
import {ApiProvider} from "../../../../providers/api/api";
import * as _ from "lodash";
import {UtilProvider} from "../../../../providers/util/util";

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.page.html',
  styleUrls: ['./memory-game.page.scss'],
})
export class MemoryGamePage implements OnInit {
  public positions:any=[];
  public size=2;
  choice=0;
  is_user=false;
  is_subscription=false;
  first_choice = 0;
  second_choice = 0;
  count = 18;
  time=60;
  progress=60;

  private user:any={};

  constructor(
    private navCtrl : NavController,
    private alertController : AlertController,
    private util : UtilProvider,
    private api : ApiProvider
  ) { }

  ngOnInit() {
    this.play();
  }

  ionViewWillEnter(){
    /*if(this.api.checkUser()){
      this.is_user=true;
      this.user=JSON.parse(localStorage.getItem('user_wz'));
      this.api.getList('auth/me',{id:this.user.id}).then((a:any)=>{
        this.user = a.data.user;
        this.is_subscription = this.api.checkSubscription(this.user.subscription).is_actived;
        localStorage.setItem('user_wz',JSON.stringify(this.user));
      });
    } else {
      this.is_user=false;
    }*/
  }

  startGame(){
    this.first_choice=0;
    this.second_choice=0;
    this.time=60;
    this.progress = this.time;
    this.count=18;
    this.positions = this.setTiles(36);
    this.startTime();
  }

  showTile(p){
    if(this.time>0){
      p.show=true;
      if(this.first_choice==0){
        this.first_choice = p.id;
      } else {
        this.second_choice = p.id;
      }

      if(this.first_choice!=0 && this.second_choice!=0){
        // les deux chois on été fait
        if(p.id%2==0){
          // verification si p et p-1 ont été cliqué
          if(this.first_choice==this.second_choice-1){
            // ok, faire disparaitre les tule et augmenter le chronos de X secondes
            this.goodChoice(this.first_choice,this.second_choice);
          } else {
            //echec
            this.badChoice(this.first_choice,this.second_choice);
          }
        } else {
          // verification si p et p-1 ont été cliqué
          if(this.second_choice==this.first_choice-1){
            // ok, faire disparaitre les tule et augmenter le chronos de X secondes
            this.goodChoice(this.first_choice,this.second_choice);
          } else {
            //echec
            this.badChoice(this.first_choice,this.second_choice);
          }
        }
        this.first_choice=0;
        this.second_choice=0;
      } else {
        // on attend le second choix
      }
    }
  }

  async play(){
    if(this.is_user){
      if(!this.is_subscription){
        const alert = await this.alertController.create({
          header: 'Vous n\'êtes pas membre de la salle',
          message: 'Devenez membre pour pouvoir jouer à ce jeu',
          buttons: [
            {
              text: 'Fermer',
              role: 'cancel',
              handler: () => {
                this.close();
              },
            },
            {
              text: 'Devenir membre',
              role: 'confirm',
              handler: () => {
                console.log('Alert canceled');
                this.becomeMember();
              },
            }
          ],
        });

        await alert.present();
      } else {
        this.startGame();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Vous n\'êtes pas connecté',
        message: 'Connectez-vous pour pouvoir jouer à ce jeu',
        buttons: [
          {
            text: 'Fermer',
            role: 'cancel',
            handler: () => {
              this.close();
            },
          },
          {
            text: 'Se connecter',
            role: 'confirm',
            handler: () => {
              console.log('Alert canceled');
              this.login();
            },
          }
        ],
      });

      await alert.present();
    }
  }

  close(){
    this.navCtrl.navigateRoot('/tabs/game/mini-game');
  }

  becomeMember(){
    this.navCtrl.navigateRoot('/tabs/store');
  }

  login(){
    this.navCtrl.navigateRoot('/login');
  }

  goodChoice(a,b){
    this.time+=2;
    this.count-=1;
    // ok, faire disparaitre les tule et augmenter le chronos de X secondes
    setTimeout(()=>{
      _.find(this.positions,{id:a}).find=true;
      _.find(this.positions,{id:b}).find=true;
    },300)

    if(this.count==0){
      this.win();
    }
  }

  badChoice(a,b){
    setTimeout(()=>{
      _.find(this.positions,{id:a}).show=false;
      _.find(this.positions,{id:b}).show=false;
    },500)
  }

  // creation du tableau d'ojet tile
  setTiles(m){
    let t = [];
    for(let i=0; i<m;i++){
      t.push({
        id:i+1,
        show:false,
        find:false
      })
    }
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }

    return t;
  }

  async win(){
    const alert = await this.alertController.create({
      header: 'VOUS AVEZ GAGNEZ',
      subHeader:"Toutes nos félicitations",
      message: 'Vous avez gagné une heure de jeu gratuit à WarZone',
      buttons: [
        {
          text: 'Confirmer',
          role: 'confirm',
          handler: () => {
            const opt = {
              user_id:this.user.id,
              game_name:"Memory",
              status:'not-use'
            };

            this.api.post('winners',opt).then(d=>{
              this.util.doToast('Vous pouvez passer à la salle du mardi à dimanche de 10h à 21h pour profiter de votre temps de jeu.', 5000)
            }, q=>{
              this.util.handleError(q)
            })
          },
        }
      ],
    });

    await alert.present();
  }

  async loose(){
    const alert = await this.alertController.create({
      header: 'Vous avez perdu',
      buttons: [
        {
          text: 'Fermer',
          role: 'cancel',
          handler: () => {
            //this.close();
          },
        }
      ],
    });

    await alert.present();
  }

  startTime(){
    let interval = setInterval(() => {
      this.time -=1;
      this.progress=this.time/60;
      if (this.time == 0) {
        clearInterval(interval);
        if(this.count>0){
          this.loose();
        }
      }
    }, 1000);

  }

}
