import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TournamentPage } from './tournament.page';

const routes: Routes = [
  {
    path: '',
    component: TournamentPage
  },
  {
    path: 'tournament-detail',
    loadChildren: () => import('./tournament-detail/tournament-detail.module').then( m => m.TournamentDetailPageModule)
  },
  {
    path: 'buy-tournament',
    loadChildren: () => import('./buy-tournament/buy-tournament.module').then( m => m.BuyTournamentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TournamentPageRoutingModule {}
