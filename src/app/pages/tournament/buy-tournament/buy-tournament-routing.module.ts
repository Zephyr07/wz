import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyTournamentPage } from './buy-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: BuyTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyTournamentPageRoutingModule {}
