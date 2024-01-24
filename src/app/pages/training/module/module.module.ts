import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModulePageRoutingModule } from './module-routing.module';

import { ModulePage } from './module.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {OupsInfoModule} from "../../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModulePageRoutingModule,
    PipeModule,
    TranslateModule,
    OupsInfoModule
  ],
  declarations: [ModulePage]
})
export class ModulePageModule {}
