import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MySchedulePageRoutingModule } from './my-schedule-routing.module';

import { MySchedulePage } from './my-schedule.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {OupsInfoModule} from "../../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MySchedulePageRoutingModule,
    TranslateModule,
    PipeModule,
    OupsInfoModule
  ],
  declarations: [MySchedulePage]
})
export class MySchedulePageModule {}
