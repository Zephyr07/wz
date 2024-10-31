import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProblemPageRoutingModule } from './problem-routing.module';

import { ProblemPage } from './problem.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProblemPageRoutingModule,
    PipeModule,
    TranslateModule,
  ],
  declarations: [ProblemPage]
})
export class ProblemPageModule {}
