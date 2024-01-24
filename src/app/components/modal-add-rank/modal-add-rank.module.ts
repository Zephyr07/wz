import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ModalAddRankComponent} from "./modal-add-rank.component";
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    PipeModule,
    TranslateModule
    ],
  declarations: [ModalAddRankComponent],
  exports: [ModalAddRankComponent]
})
export class ModalAddRankModule {}
