import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GreenThursdayPage } from './green-thursday.page';

const routes: Routes = [
  {
    path: '',
    component: GreenThursdayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreenThursdayPageRoutingModule {}
