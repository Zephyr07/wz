import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RechargeAccountPage } from './recharge-account.page';

const routes: Routes = [
  {
    path: '',
    component: RechargeAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechargeAccountPageRoutingModule {}
