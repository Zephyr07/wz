import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorePageRoutingModule } from './store-routing.module';

import { StorePage } from './store.page';
import {PipeModule} from "../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorePageRoutingModule,
    TranslateModule,
    PipeModule
  ],
  declarations: [StorePage]
})
export class StorePageModule {}
