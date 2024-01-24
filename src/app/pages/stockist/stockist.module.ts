import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockistPageRoutingModule } from './stockist-routing.module';

import { StockistPage } from './stockist.page';
import {TranslateModule} from "@ngx-translate/core";
import {OupsInfoModule} from "../../components/oups-info/oups-info.module";
import {PipeModule} from "../../pipe/pipe.module";
import {ModalAddStockistModule} from "../../components/modal-add-stockist/modal-add-stockist.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockistPageRoutingModule,
    TranslateModule,
    OupsInfoModule,
    PipeModule,
    ModalAddStockistModule
  ],
  declarations: [StockistPage]
})
export class StockistPageModule {}
