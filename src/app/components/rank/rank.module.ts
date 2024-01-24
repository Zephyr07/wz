import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RankComponent } from './rank.component';
import {PipeModule} from "../../pipe/pipe.module";

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, PipeModule],
  declarations: [RankComponent],
  exports: [RankComponent]
})
export class RankComponentModule {}
