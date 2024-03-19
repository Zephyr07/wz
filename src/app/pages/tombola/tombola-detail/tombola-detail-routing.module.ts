import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TombolaDetailPage } from './tombola-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TombolaDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TombolaDetailPageRoutingModule {}
