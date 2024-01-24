import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailPageRoutingModule } from './product-detail-routing.module';

import { ProductDetailPage } from './product-detail.page';
import {TranslateModule} from "@ngx-translate/core";
import {RankComponentModule} from "../../../components/rank/rank.module";
import {ModalAddRankModule} from "../../../components/modal-add-rank/modal-add-rank.module";
import {PipeModule} from "../../../pipe/pipe.module";
import {ModalAddTestimonialModule} from "../../../components/modal-add-testimonial/modal-add-testimonial.module";

@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailPageRoutingModule,
    TranslateModule,
    RankComponentModule,
    ModalAddRankModule,
    ModalAddTestimonialModule,
    PipeModule
  ],
  declarations: [ProductDetailPage]
})
export class ProductDetailPageModule {}
