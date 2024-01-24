import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestPageRoutingModule } from './test-routing.module';
import {TranslateModule} from "@ngx-translate/core";
import { TestPage } from './test.page';
import {PipeModule} from "../../pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestPageRoutingModule,
    TranslateModule,
    PipeModule
  ],
  declarations: [TestPage]
})
export class TestPageModule {}
