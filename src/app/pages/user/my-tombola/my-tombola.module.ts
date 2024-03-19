import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyTombolaPageRoutingModule } from './my-tombola-routing.module';

import { MyTombolaPage } from './my-tombola.page';
import {TranslateModule} from "@ngx-translate/core";
import {OupsInfoModule} from "../../../components/oups-info/oups-info.module";
import {PipeModule} from "../../../pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyTombolaPageRoutingModule,
    TranslateModule,
    OupsInfoModule,
    PipeModule
  ],
  declarations: [MyTombolaPage]
})
export class MyTombolaPageModule {}
