import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProblemAddPage } from './problem-add.page';

const routes: Routes = [
  {
    path: '',
    component: ProblemAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProblemAddPageRoutingModule {}
