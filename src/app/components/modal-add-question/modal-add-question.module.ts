import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ModalAddQuestionComponent} from "./modal-add-question.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    ],
  declarations: [ModalAddQuestionComponent],
  exports: [ModalAddQuestionComponent]
})
export class ModalAddQuestionModule {}
