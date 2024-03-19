import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../pipe/pipe.module";
import {ModalCguModule} from "../../components/modal-cgu/modal-cgu.module";
import {ModalCgvModule} from "../../components/modal-cgv/modal-cgv.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    TranslateModule,
    ModalCguModule,
    ModalCgvModule,
    PipeModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
