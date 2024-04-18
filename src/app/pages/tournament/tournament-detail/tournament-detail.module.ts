import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TournamentDetailPageRoutingModule } from './tournament-detail-routing.module';

import { TournamentDetailPage } from './tournament-detail.page';
import {PipeModule} from "../../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {ModalAddTournamentModule} from "../../../components/modal-add-tournament/modal-add-tournament.module";
import {ModalTournamentParticipantModule} from "../../../components/modal-tournament-participant/modal-tournament-participant.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TournamentDetailPageRoutingModule,
    ModalAddTournamentModule,
    TranslateModule,
    ModalTournamentParticipantModule,
    PipeModule
  ],
  declarations: [TournamentDetailPage]
})
export class TournamentDetailPageModule {}
