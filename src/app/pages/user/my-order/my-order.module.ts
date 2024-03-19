import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyOrderPageRoutingModule } from './my-order-routing.module';

import { MyOrderPage } from './my-order.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {OupsInfoModule} from "../../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyOrderPageRoutingModule,
    TranslateModule,
    PipeModule,
    OupsInfoModule
  ],
  declarations: [MyOrderPage]
})
export class MyOrderPageModule {}
