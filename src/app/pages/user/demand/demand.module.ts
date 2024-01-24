import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemandPageRoutingModule } from './demand-routing.module';

import { DemandPage } from './demand.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {OupsInfoModule} from "../../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemandPageRoutingModule,
    PipeModule,
    TranslateModule,
    OupsInfoModule
  ],
  declarations: [DemandPage]
})
export class DemandPageModule {}
