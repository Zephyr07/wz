import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionPageRoutingModule } from './subscription-routing.module';

import { SubscriptionPage } from './subscription.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {OupsInfoModule} from "../../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PipeModule,
    SubscriptionPageRoutingModule,
    OupsInfoModule
  ],
  declarations: [SubscriptionPage]
})
export class SubscriptionPageModule {}
