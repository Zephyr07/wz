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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TournamentPageRoutingModule {}
