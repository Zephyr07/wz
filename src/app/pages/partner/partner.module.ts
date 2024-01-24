import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartnerPageRoutingModule } from './partner-routing.module';

import { PartnerPage } from './partner.page';
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../pipe/pipe.module";

@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartnerPageRoutingModule,
    TranslateModule,
    PipeModule
  ],
  declarations: [PartnerPage]
})
export class PartnerPageModule {}
