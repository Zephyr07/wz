import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameListPageRoutingModule } from './game-list-routing.module';

import { GameListPage } from './game-list.page';

import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../../pipe/pipe.module";
import {OupsInfoModule} from "../../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameListPageRoutingModule,
    TranslateModule,
    PipeModule,
    OupsInfoModule
  ],
  declarations: [GameListPage]
})
export class GameListPageModule {}
