import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameListPage } from './game-list.page';

const routes: Routes = [
  {
    path: '',
    component: GameListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameListPageRoutingModule {}
