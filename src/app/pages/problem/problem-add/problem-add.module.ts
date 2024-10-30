import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProblemAddPageRoutingModule } from './problem-add-routing.module';

import { ProblemAddPage } from './problem-add.page';
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../../pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProblemAddPageRoutingModule,
    PipeModule,
    TranslateModule,
  ],
  declarations: [ProblemAddPage]
})
export class ProblemAddPageModule {}
