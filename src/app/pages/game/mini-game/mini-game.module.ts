import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiniGamePageRoutingModule } from './mini-game-routing.module';

import { MiniGamePage } from './mini-game.page';
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../../pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiniGamePageRoutingModule,
    TranslateModule,
    PipeModule,
  ],
  declarations: [MiniGamePage]
})
export class MiniGamePageModule {}
