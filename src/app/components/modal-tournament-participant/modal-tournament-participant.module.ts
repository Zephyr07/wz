import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ModalTournamentParticipantComponent} from "./modal-tournament-participant.component";
import {TranslateModule} from "@ngx-translate/core";
import {OupsInfoModule} from "../oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    OupsInfoModule
    ],
  declarations: [ModalTournamentParticipantComponent],
  exports: [ModalTournamentParticipantComponent]
})
export class ModalTournamentParticipantModule {}
