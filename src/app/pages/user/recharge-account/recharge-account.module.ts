import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RechargeAccountPageRoutingModule } from './recharge-account-routing.module';

import { RechargeAccountPage } from './recharge-account.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RechargeAccountPageRoutingModule,
    PipeModule,
    TranslateModule
  ],
  declarations: [RechargeAccountPage]
})
export class RechargeAccountPageModule {}
