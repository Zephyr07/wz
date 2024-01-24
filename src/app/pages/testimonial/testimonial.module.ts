import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestimonialPageRoutingModule } from './testimonial-routing.module';

import { TestimonialPage } from './testimonial.page';
import {PipeModule} from "../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestimonialPageRoutingModule,
    PipeModule,
    TranslateModule
  ],
  declarations: [TestimonialPage]
})
export class TestimonialPageModule {}
