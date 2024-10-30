import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProblemDetailPage } from './problem-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProblemDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProblemDetailPageRoutingModule {}
