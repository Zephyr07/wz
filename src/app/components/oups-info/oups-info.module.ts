import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {OupsInfoComponent} from "./oups-info.component";
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PipeModule,
    TranslateModule
    ],
  declarations: [OupsInfoComponent],
  exports: [OupsInfoComponent]
})
export class OupsInfoModule {}
