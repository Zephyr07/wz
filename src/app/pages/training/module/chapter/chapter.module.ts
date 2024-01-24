import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChapterPageRoutingModule } from './chapter-routing.module';

import { ChapterPage } from './chapter.page';
import {PipeModule} from "../../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {OupsInfoModule} from "../../../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChapterPageRoutingModule,
    PipeModule,
    TranslateModule,
    OupsInfoModule
  ],
  declarations: [ChapterPage]
})
export class ChapterPageModule {}
