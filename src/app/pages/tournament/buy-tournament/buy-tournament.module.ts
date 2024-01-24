import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyTournamentPageRoutingModule } from './buy-tournament-routing.module';

import { BuyTournamentPage } from './buy-tournament.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyTournamentPageRoutingModule
  ],
  declarations: [BuyTournamentPage]
})
export class BuyTournamentPageModule {}
