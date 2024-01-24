import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravelPageRoutingModule } from './travel-routing.module';

import { TravelPage } from './travel.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelPageRoutingModule,
    PipeModule,
    TranslateModule
  ],
  declarations: [TravelPage]
})
export class TravelPageModule {}
