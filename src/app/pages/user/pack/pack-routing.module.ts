import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackPage } from './pack.page';

const routes: Routes = [
  {
    path: '',
    component: PackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackPageRoutingModule {}
