import {Component, OnInit} from '@angular/core';
import {ApiProvider} from "../../../../../providers/api/api";
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import * as _ from "lodash";
import {UtilProvider} from "../../../../../providers/util/util";

@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.page.html',
  styleUrls: ['./chapter-detail.page.scss'],
})
export class ChapterDetailPage implements OnInit {
  id:any;
  is_loading=true;
  title="";
  chapter:any={
    module:{
      training:{}
    }
  };
  module:any={
    chapters:[]
  };
  index=0;

  next=0;
  previous=0;
  is_next=false;
  is_previous=false;
  videoPlayer: any;

  constructor(
    private api:ApiProvider,
    private sanitizer: DomSanitizer,
    private router : Router,
    private util:UtilProvider
  ){
    if(this.router.getCurrentNavigation().extras.state){
      // @ts-ignore
      this.id= this.router.getCurrentNavigation().extras.state.id;
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.name;
      this.getChapter(this.id);
    } else {
      //console.log("pas d'id");
      this.id=3;
      this.getChapter(this.id);
    }
  }

  ngOnInit(){

  }


  getChapter(id){
    const opt = {
      _includes:'module.training,module.chapters'
    };

    this.api.get('chapters',id,opt).then((d:any)=>{
      this.chapter=d;
      this.module=this.chapter.module;
      this.module.chapters = _.orderBy(this.module.chapters,'order');
      this.chapter.link=this.sanitizer.bypassSecurityTrustResourceUrl(this.chapter.link);
      this.is_loading=false;

      let tmp = _.find(this.module.chapters,{id:this.chapter.id});
      let index = this.module.chapters.indexOf(tmp);

      if(index < this.module.chapters.length-1){
        this.next = this.module.chapters[index+1].id;
        this.is_next=true;
      }

      if(index == 0){
        // pas de retour
        this.is_previous=false;
      }

      if (index >0){
        this.previous = this.module.chapters[index-1].id;
        this.is_previous=true;
      }

      if (index == this.module.chapters.length-1){
        // pas de next
        this.is_next=false;
      }
    },q=>{
      this.util.handleError(q);
    })
  }

  nextChapter(){
    this.is_loading = true;
    this.getChapter(this.next);
  }

  previousChapter(){
    this.is_loading = true;
    this.getChapter(this.previous);
  }
}
