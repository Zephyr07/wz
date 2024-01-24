import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GreenThursdayPageRoutingModule } from './green-thursday-routing.module';

import { GreenThursdayPage } from './green-thursday.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GreenThursdayPageRoutingModule,
    PipeModule,
    TranslateModule
  ],
  declarations: [GreenThursdayPage]
})
export class GreenThursdayPageModule {}
