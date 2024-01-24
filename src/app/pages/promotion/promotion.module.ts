import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromotionPageRoutingModule } from './promotion-routing.module';

import { PromotionPage } from './promotion.page';
import {PipeModule} from "../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {ModalAddPromotionModule} from "../../components/modal-add-promotion/modal-add-promotion.module";
import {OupsInfoModule} from "../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromotionPageRoutingModule,
    PipeModule,
    TranslateModule,
    ModalAddPromotionModule,
    OupsInfoModule
  ],
  declarations: [PromotionPage]
})
export class PromotionPageModule {}
