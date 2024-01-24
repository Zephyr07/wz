import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ModalAddSeminarComponent} from "./modal-add-seminar.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    ],
  declarations: [ModalAddSeminarComponent],
  exports: [ModalAddSeminarComponent]
})
export class ModalAddSeminarModule {}
