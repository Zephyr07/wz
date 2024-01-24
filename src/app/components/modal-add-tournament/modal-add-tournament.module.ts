import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ModalAddTournamentComponent} from "./modal-add-tournament.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    ],
  declarations: [ModalAddTournamentComponent],
  exports: [ModalAddTournamentComponent]
})
export class ModalAddTournamentModule {}
