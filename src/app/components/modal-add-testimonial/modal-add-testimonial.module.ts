import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ModalAddTestimonialComponent} from "./modal-add-testimonial.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    ],
  declarations: [ModalAddTestimonialComponent],
  exports: [ModalAddTestimonialComponent]
})
export class ModalAddTestimonialModule {}
