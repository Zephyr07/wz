import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";
import {NavigationExtras, Router} from "@angular/router";
import {UtilProvider} from "../../../../providers/util/util";

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.page.html',
  styleUrls: ['./chapter.page.scss'],
})
export class ChapterPage implements OnInit {
  id=0;
  chapters=[];
  old_chapters=[];
  search="";
  title="";
  is_loading=true;


  constructor(
    private api:ApiProvider,
    private router:Router,
    private util:UtilProvider
  ) {
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      this.id= this.router.getCurrentNavigation().extras.state.id;
      this.getChapters(this.id);
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.title;
    } else {
      //console.log("pas d'id");
      this.id=1;
      this.getChapters(this.id);
    }
  }

  ngOnInit() {

  }

  goToChapterDetail(m){
    const navigationExtra : NavigationExtras = {state: {title:m.title, id:m.id}};
    this.router.navigateByUrl('training/module/chapter/chapter-detail',navigationExtra);
  }

  getChapters(id){
    this.is_loading=true;
    const opt = {
      should_paginate:false,
      _sort:'order',
      _sortDir:'asc',
      module_id:id,
      status:"enable"
    };

    this.api.getList('chapters',opt).then((d:any)=>{
      this.old_chapters=d;
      this.chapters=d;
      this.is_loading=false;
    },q=>{
      this.util.handleError(q);
    })
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.chapters = this.old_chapters;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.chapters = this.chapters.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // if the value is an empty string don't filter the items

  }

  doRefresh(event) {
    this.getChapters(this.id);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);
  }

}
