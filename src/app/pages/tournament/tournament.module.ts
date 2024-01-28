import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TournamentPageRoutingModule } from './tournament-routing.module';

import { TournamentPage } from './tournament.page';
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../pipe/pipe.module";
import {OupsInfoModule} from "../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TournamentPageRoutingModule,
    TranslateModule,
    PipeModule,
    OupsInfoModule
  ],
  declarations: [TournamentPage]
})
export class TournamentPageModule {}
