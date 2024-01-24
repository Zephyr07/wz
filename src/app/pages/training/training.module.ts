import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingPageRoutingModule } from './training-routing.module';

import { TrainingPage } from './training.page';
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../pipe/pipe.module";
import {OupsInfoModule} from "../../components/oups-info/oups-info.module";
import {RankComponentModule} from "../../components/rank/rank.module";
import {ModalAddRankModule} from "../../components/modal-add-rank/modal-add-rank.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingPageRoutingModule,
    TranslateModule,
    PipeModule,
    OupsInfoModule,
    RankComponentModule,
    ModalAddRankModule
  ],
  declarations: [TrainingPage]
})
export class TrainingPageModule {}
