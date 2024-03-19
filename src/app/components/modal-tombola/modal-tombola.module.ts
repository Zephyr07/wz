import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ModalTombolaComponent} from "./modal-tombola.component";
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PipeModule
    ],
  declarations: [ModalTombolaComponent],
  exports: [ModalTombolaComponent]
})
export class ModalTombolaModule {}
