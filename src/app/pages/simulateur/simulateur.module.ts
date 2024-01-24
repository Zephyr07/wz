import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimulateurPageRoutingModule } from './simulateur-routing.module';

import { SimulateurPage } from './simulateur.page';
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimulateurPageRoutingModule,
    TranslateModule,
    PipeModule
  ],
  declarations: [SimulateurPage]
})
export class SimulateurPageModule {}
