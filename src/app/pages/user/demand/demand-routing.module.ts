import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemandPage } from './demand.page';

const routes: Routes = [
  {
    path: '',
    component: DemandPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemandPageRoutingModule {}
