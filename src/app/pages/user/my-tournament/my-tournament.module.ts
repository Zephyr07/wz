import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyTournamentPageRoutingModule } from './my-tournament-routing.module';

import { MyTournamentPage } from './my-tournament.page';
import {TranslateModule} from "@ngx-translate/core";
import {PipeModule} from "../../../pipe/pipe.module";
import {OupsInfoModule} from "../../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyTournamentPageRoutingModule,
    TranslateModule,
    OupsInfoModule,
    PipeModule
  ],
  declarations: [MyTournamentPage]
})
export class MyTournamentPageModule {}
