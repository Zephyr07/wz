import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqPageRoutingModule } from './faq-routing.module';

import { FaqPage } from './faq.page';
import {PipeModule} from "../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {ModalAddQuestionModule} from "../../components/modal-add-question/modal-add-question.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqPageRoutingModule,
    PipeModule,
    TranslateModule,
    ModalAddQuestionModule
  ],
  declarations: [FaqPage]
})
export class FaqPageModule {}
