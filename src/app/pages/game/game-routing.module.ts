import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamePage } from './game.page';

const routes: Routes = [
  {
    path: '',
    component: GamePage
  },
  {
    path: 'game-list',
    loadChildren: () => import('./game-list/game-list.module').then( m => m.GameListPageModule)
  },
  {
    path: 'mini-game',
    loadChildren: () => import('./mini-game/mini-game.module').then( m => m.MiniGamePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamePageRoutingModule {}
