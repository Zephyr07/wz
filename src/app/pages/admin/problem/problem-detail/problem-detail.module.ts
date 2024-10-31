import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProblemDetailPageRoutingModule } from './problem-detail-routing.module';

import { ProblemDetailPage } from './problem-detail.page';
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../../../pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProblemDetailPageRoutingModule,
    PipeModule,
    TranslateModule,
  ],
  declarations: [ProblemDetailPage]
})
export class ProblemDetailPageModule {}
