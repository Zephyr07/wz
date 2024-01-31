import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MySchedulePageRoutingModule } from './my-schedule-routing.module';

import { MySchedulePage } from './my-schedule.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MySchedulePageRoutingModule,
    TranslateModule,
    PipeModule
  ],
  declarations: [MySchedulePage]
})
export class MySchedulePageModule {}
