import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChapterDetailPageRoutingModule } from './chapter-detail-routing.module';

import { ChapterDetailPage } from './chapter-detail.page';
import {PipeModule} from "../../../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChapterDetailPageRoutingModule,
    PipeModule,
    TranslateModule
  ],
  declarations: [ChapterDetailPage]
})
export class ChapterDetailPageModule {}
