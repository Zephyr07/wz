import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiniGamePage } from './mini-game.page';

const routes: Routes = [
  {
    path: '',
    component: MiniGamePage
  },
  {
    path: 'triple-choice',
    loadChildren: () => import('./triple-choice/triple-choice.module').then( m => m.TripleChoicePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiniGamePageRoutingModule {}
