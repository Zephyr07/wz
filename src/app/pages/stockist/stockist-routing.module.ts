import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockistPage } from './stockist.page';

const routes: Routes = [
  {
    path: '',
    component: StockistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockistPageRoutingModule {}
