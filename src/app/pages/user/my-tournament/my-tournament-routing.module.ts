import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyTournamentPage } from './my-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: MyTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTournamentPageRoutingModule {}
