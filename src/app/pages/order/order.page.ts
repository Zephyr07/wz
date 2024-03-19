import { Component, OnInit } from '@angular/core';
import {DEVISE, NUMBER_RANGE} from "../../services/contants";
import {ApiProvider} from "../../providers/api/api";
import {NavigationExtras, Router} from "@angular/router";
import {UtilProvider} from "../../providers/util/util";
import {AlertController, ModalController} from "@ionic/angular";

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  product:any={
    image:{}
  };
  user:any={};
  id=0;
  quantity=0;
  delivery=0;
  express=0;
  fees=0;
  discount=0;
  total =0;
  phone:number;
  is_subscription=false;
  is_phone=false;
  is_loading=false;
  MIN = NUMBER_RANGE.min;
  MAX = NUMBER_RANGE.max;
  DEVISE = DEVISE;
  constructor(
    private api: ApiProvider,
    private router : Router,
    private util:UtilProvider,
    public modalController: ModalController,
    public alertController: AlertController,
  ) {
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      this.id= this.router.getCurrentNavigation().extras.state.id;
      this.getProduct(this.id);
    } else {
      //console.log("pas d'id");
      this.id=1;
      this.getProduct(this.id);
    } }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.api.checkUser()) {
      this.user = JSON.parse(localStorage.getItem('user_wz'));
      this.api.getList('auth/me',{id:this.user.id}).then((a:any)=>{
        this.user = a.data.user;
        localStorage.setItem('user_wz',JSON.stringify(this.user));
        this.is_subscription = this.api.checkSubscription(this.user.subscription).is_actived;
      });
    }
  }

  getProduct(id){
    this.id=id;
    const opt = {
      _includes:"images"
    };

    this.api.get('products',id,opt).then(d=>{
      this.product = d;
    },q=>{
      this.util.handleError(q);
    })
  }

  order(){
    let price = this.quantity*this.product.price;
    if(this.delivery==1){
      price+=1000;
    }
    if(price==0 || price<=this.user.unit){
      this.util.showLoading("payment");

      let opt ={
        product_id:this.product.id,
        quantity:this.quantity,
        user_id:this.user.id,
        is_delivery:false,
        price_was:price
      };

      if(this.delivery==1){
        opt.is_delivery=true;
      }

      this.api.post('orders',opt).then(d=>{
        this.util.doToast("Merci pour votre commande, nous vous contacterons sur WhatsApp pour plus d'informations",5000);
        const navigationExtra : NavigationExtras = {state: {name:this.product.name, id:this.product.id}};
        this.router.navigateByUrl('product/product-detail',navigationExtra);
        this.util.hideLoading();
      },q=>{
        this.util.hideLoading();
        this.util.handleError(q);
      })

    } else {
      this.api.rechargeAccount(price,this.user.id);
    }
  }

  async askOrder(){
    let price = this.quantity*this.product.price;
    if(this.delivery==1){
      price+=1000;
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Confirmation",
      subHeader:"Confirmez-vous votre commande de "+this.quantity+" "+ this.product.name +"? Cela vous coûtera "+price+"U",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmer',
          handler: (data:any) => {
            this.order();
          }
        }
      ]
    });

    await alert.present();
  }

}
