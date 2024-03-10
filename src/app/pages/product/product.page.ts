import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {NavigationExtras, Router} from "@angular/router";
import {UtilProvider} from "../../providers/util/util";

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  products:any=[];
  old_products:any=[];
  search="";

  is_loading=true;

  constructor(
    private api:ApiProvider,
    private router:Router,
    private util:UtilProvider
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts(){
    this.is_loading=true;
    const opt = {
      should_paginate:false,
      _sort:'name',
      _sortDir:'asc',
      "status":"enable"
    };

    this.api.getList('products',opt).then(d=>{
      this.old_products = d;
      this.products = d;
      this.is_loading=false;
    },q=>{
      this.util.handleError(q);
    })
  }

  goTo(p){
    const navigationExtra : NavigationExtras = {state: {name:p.name, id:p.id}};
    this.router.navigateByUrl('product/product-detail',navigationExtra);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.products = this.old_products;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.products = this.products.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.getProducts();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }
}
