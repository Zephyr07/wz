import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TombolaPageRoutingModule } from './tombola-routing.module';

import { TombolaPage } from './tombola.page';
import {PipeModule} from "../../pipe/pipe.module";
import {OupsInfoModule} from "../../components/oups-info/oups-info.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TombolaPageRoutingModule,
    TranslateModule,
    PipeModule,
    OupsInfoModule
  ],
  declarations: [TombolaPage]
})
export class TombolaPageModule {}
