import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProblemPage } from './problem.page';

const routes: Routes = [
  {
    path: '',
    component: ProblemPage
  },
  {
    path: 'problem-detail',
    loadChildren: () => import('./problem-detail/problem-detail.module').then( m => m.ProblemDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProblemPageRoutingModule {}
