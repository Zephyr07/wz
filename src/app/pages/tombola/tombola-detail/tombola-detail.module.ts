import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TombolaDetailPageRoutingModule } from './tombola-detail-routing.module';

import { TombolaDetailPage } from './tombola-detail.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TombolaDetailPageRoutingModule,
    TranslateModule,
    PipeModule
  ],
  declarations: [TombolaDetailPage]
})
export class TombolaDetailPageModule {}
