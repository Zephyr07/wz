import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.page.html',
  styleUrls: ['./my-order.page.scss'],
})
export class MyOrderPage implements OnInit {

  orders=[];
  old_orders=[];
  search="";
  title="";
  user:any;
  is_loading=true;

  constructor(
    private api:ApiProvider,
    private router:Router
  ) {

  }

  ngOnInit() {
    if (this.api.checkUser()) {
      this.user = JSON.parse(localStorage.getItem('user_wz'));
      this.getOrder(this.user.id);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getOrder(id){
    this.is_loading=true;
    const opt = {
      should_paginate:false,
      _sort:'created_at',
      _sortDir:'desc',
      user_id:id,
      _includes:'product'
    };
    this.api.getList('orders',opt).then((d:any)=>{
      this.is_loading=false;
      this.old_orders=d;
      this.orders=d;
    })
  }

  goToProduct(p){
    const navigationExtra : NavigationExtras = {state: {name:p.name, id:p.id}};
    this.router.navigateByUrl('product/product-detail',navigationExtra);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.orders = this.old_orders;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.orders = this.orders.filter((item) => {
        return (item.product.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.getOrder(this.user.id);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
