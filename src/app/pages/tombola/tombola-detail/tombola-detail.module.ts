import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TombolaDetailPageRoutingModule } from './tombola-detail-routing.module';

import { TombolaDetailPage } from './tombola-detail.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {ModalTombolaModule} from "../../../components/modal-tombola/modal-tombola.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TombolaDetailPageRoutingModule,
    TranslateModule,
    PipeModule,
    ModalTombolaModule,
  ],
  declarations: [TombolaDetailPage]
})
export class TombolaDetailPageModule {}
