import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalAddRankComponent} from "../../../components/modal-add-rank/modal-add-rank.component";
import {ApiProvider} from "../../../providers/api/api";
import {UtilProvider} from "../../../providers/util/util";
import {AlertController, IonInfiniteScroll, IonModal, ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {ModalAddTestimonialComponent} from "../../../components/modal-add-testimonial/modal-add-testimonial.component";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  @ViewChild('modalRank') modalRank: IonModal;
  @ViewChild('modalTestimonial') modalTestimonial: IonModal;

  id=0;
  title="";
  product:any={
    image:{},
    prices:[],
    ratings:{}
  };
  isLoadingMap = true;
  testimonials:any=[];
  comments:any=[];
  show_pointer=false;
  current_slide = 1;
  note = 0;
  isLoadingOffer=true;
  isLoadingPrice=true;
  isLoadingCompany=true;
  offer_id:number;
  tabID="company";
  name="";
  content="";
  distance="";
  ranks:any=[];
  isOwner = false;
  isLoadingRank = true;
  information:any={};

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  isLoading=true;
  per_page = 20;
  page = 1;
  last_page = 10000000;
  max_length = 0;
  old_max_length = 0;

  per_page_testimonial = 20;
  page_testimonial = 1;
  last_page_testimonial = 10000000;
  max_length_testimonial = 0;
  old_max_length_testimonial = 0;

  map: any;

  slideOpts = {
    autoplay:{delay:7000},
    pager:false,
    scrollbar:true,
    speed: 1000,
    loop:true
  };
  isLogged = false;

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
      // @ts-ignore
      this.title= this.router.getCurrentNavigation().extras.state.name;
    } else {
      //console.log("pas d'id");
      this.id=10;
      this.getProduct(this.id);
    }
  }

  ngOnInit() {
  }

  getProduct(id){
    this.id=id;
    const opt = {
      _includes:"images,prices.country"
    };

    this.api.get('products',id,opt).then(d=>{
      this.product = d;
      //console.log(this.product);
      this.getCommentPlace();
      this.getTestimonials();
      this.isLoading=false;
    },q=>{
      this.util.handleError(q);
    })
  }

  addRank(){
    if(this.api.checkUser()){
      const user=JSON.parse(localStorage.getItem('user_lr'));
      this.util.showLoading('saving');
      let d:any = {};
      d.content = this.content;
      d.star = this.note;
      d.user_id=user.id;
      d.offer_id=this.offer_id;
      d.type='product';
    } else {
      this.modalRank.setCurrentBreakpoint(0);
      this.util.loginModal();
    }
  }
  ionViewWillEnter(){

  }

  backToPreviousPage(){
    document.getElementById('backButton').click();
  }

  
  showRank(){
    document.getElementById('open-modal-rank').click();
  }

  async newRank(o?:any){
    if(this.api.checkUser()){
      o=this.product;
      o.target = 'product';
      const modal = await this.modalController.create({
        component: ModalAddRankComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'objet': o
        }
      });
      return await modal.present();
    } else {
      this.modalRank.setCurrentBreakpoint(0);
      this.util.loginModal();
    }

  }

  showTestimonial(){
    document.getElementById('open-modal-testimonial').click();
  }

  async newTestimonial(o?:any){
    if(this.api.checkUser()){
      o=this.product;
      const modal = await this.modalController.create({
        component: ModalAddTestimonialComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'objet': o
        }
      });
      return await modal.present();
    } else {
      this.modalTestimonial.setCurrentBreakpoint(0);
      this.util.loginModal();
    }

  }

  doRefresh(event) {

    this.page=1;
    this.max_length = 0;
    this.old_max_length = 0;
    this.last_page= 9999999;
    this.comments=[];
    this.page_testimonial=1;
    this.max_length_testimonial = 0;
    this.old_max_length_testimonial = 0;
    this.last_page_testimonial= 9999999;
    this.testimonials=[];
    this.getProduct(this.id);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }


  getCommentPlace(){

    const opt = {
      ratingable_type:'App\\Models\\Product',
      ratingable_id:this.id,
      should_paginate:true,
      _includes:'user.partner',
      _sort:'created_at',
      _sortDir:'desc',
      per_page:this.per_page,
      page:this.page
    };

    this.api.getList('ratings',opt).then((r:any)=>{
      if(r.length>0){
        this.last_page = r.metadata.last_page;
        this.max_length = r.metadata.total;
        this.old_max_length = this.max_length;
        r.forEach(v=>{
          //v.created_at = moment(v.created_at).format("DD MMM YYYY");
          if(v.user.partner.image.split('product_poster').length>0){
            // pas d'image
            // attribution image par defaut
            v.user.partner.image="../../../../assets/icon/lr.png"
          }
          this.comments.push(v);
        });
        if(this.page==1){
          this.isLoadingRank=false;
        }
        this.page++;
      } else {
        this.isLoadingRank=false;
        //this.util.hideLoading();

      }
    }, q=>{
      this.util.handleError(q);
    })
  }


  getTestimonials(){
    const opt = {
      _sort:'created_at',
      _sortDir:'desc',
      _includes:'user.partner',
      should_paginate:true,
      status:'enable',
      per_page:this.per_page_testimonial,
      page:this.page_testimonial,
      product_id:this.id
    };

    this.api.getList('testimonials',opt).then((r:any)=>{
      if(r.length>0){
        this.last_page_testimonial = r.metadata.last_page;
        this.max_length_testimonial = r.metadata.total;
        this.old_max_length_testimonial = this.max_length_testimonial;
        r.forEach(v=>{
          //v.created_at = moment(v.created_at).format("DD MMM YYYY");
          if(v.user.partner.image.split('product_poster').length>0){
            // pas d'image
            // attribution image par defaut
            v.user.partner.image="../../../../assets/icon/lr.png"
          }
          this.testimonials.push(v);
        });
        if(this.page_testimonial==1){
          this.isLoadingRank=false;
        }
        this.page_testimonial++;
      } else {
        this.isLoadingRank=false;
        //this.util.hideLoading();

      }
    }, q=>{
      this.util.handleError(q);
    })
  }
}
