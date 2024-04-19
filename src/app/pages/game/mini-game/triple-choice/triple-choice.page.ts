import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AlertController, NavController} from "@ionic/angular";
import {ApiProvider} from "../../../../providers/api/api";
import {UtilProvider} from "../../../../providers/util/util";

@Component({
  selector: 'app-triple-choice',
  templateUrl: './triple-choice.page.html',
  styleUrls: ['./triple-choice.page.scss'],
})
export class TripleChoicePage implements OnInit {
  is_click = false;
  choice=99999;
  answer = 0;
  level=1;
  size=6;
  is_loose = false;
  is_user = false;
  is_subscription = false;
  private user:any={};

  constructor(
    private navCtrl:NavController,
    private alertController : AlertController,
    private util : UtilProvider,
    private api : ApiProvider
  ) { }

  ngOnInit() {
    this.startGame();
  }

  ionViewWillEnter(){
    if(this.api.checkUser()){
      this.is_user=true;
      this.user=JSON.parse(localStorage.getItem('user_wz'));
      this.api.getList('auth/me',{id:this.user.id}).then((a:any)=>{
        this.user = a.data.user;
        this.is_subscription = this.api.checkSubscription(this.user.subscription).is_actived;
        localStorage.setItem('user_wz',JSON.stringify(this.user));
      });
    } else {
      this.is_user=false;
    }
  }

  async startGame(){
    const alert = await this.alertController.create({
      header: 'Bienvenu dans "Bats à 10"',
      subHeader: 'Règles du jeu',
      message: 'A chaque niveau vous devez choisir la bonne case pour avancer. Trouvez les 10 bonnes cases et gagnez une journée de jeu gratuit à la salle. Que la chance soit avec vous!',
      buttons: [
        {
          text: 'Fermer',
          role: 'cancel',
          handler: () => {
            this.close();
          },
        },
        {
          text: 'Jouer',
          role: 'confirm',
          handler: () => {
            console.log('Alert canceled');
            this.play();
          },
        }
      ],
    });

    await alert.present();
  }

  checkChoice(t){
    if(!this.is_loose){
      this.choice = t;
      if(this.answer ==t){
        setTimeout(()=>{
          // win, passage au niveau suivant
          if(this.level==10){
            // win
            this.win();
          } else {
            this.level++;
            this.setAnswer();
            this.choice=0;
          }
        },700)
      } else{
        //this.level=1;
        this.loose();
      }
    }

  }

  setAnswer(){
    if(this.level <4){
      this.answer = Math.floor(Math.random() * 2) + 1;
    } else if(this.level>4 && this.level<8){
      this.answer = Math.floor(Math.random() * 3) + 1;
    } else {
      this.answer = Math.floor(Math.random() * 4) + 1;
    }
  }

  async loose(){
    this.is_loose = true;
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

  async win(){
    const alert = await this.alertController.create({
      header: 'VOUS AVEZ GAGNEZ',
      subHeader:"Toutes nos félicitations",
      message: 'Vous avez gagné une journée de jeu gratuit à WarZone',
      buttons: [
        {
          text: 'Confirmer',
          role: 'confirm',
          handler: () => {
            const opt = {
              user_id:this.user.id,
              game_name:"Bats à 10",
              status:'not-use'
            };

            this.api.post('winners',opt).then(d=>{
              this.util.doToast('Vous pouvez passer à la salle du mardi à dimanche de 10h à 21h pour réserver votre journée de jeu.', 5000)
            }, q=>{
              this.util.handleError(q)
            })
          },
        }
      ],
    });

    await alert.present();
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
        this.level = 1;
        this.choice=99999;
        this.setAnswer();
        this.is_loose=false;
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
}