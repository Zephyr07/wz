import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ModalAddPromotionComponent} from "./modal-add-promotion.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    ],
  declarations: [ModalAddPromotionComponent],
  exports: [ModalAddPromotionComponent]
})
export class ModalAddPromotionModule {}
