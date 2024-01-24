import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyTrainingPageRoutingModule } from './my-training-routing.module';

import { MyTrainingPage } from './my-training.page';
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../../pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyTrainingPageRoutingModule,
    TranslateModule,
    PipeModule
  ],
  declarations: [MyTrainingPage]
})
export class MyTrainingPageModule {}
