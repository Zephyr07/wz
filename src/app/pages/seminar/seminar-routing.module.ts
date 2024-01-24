import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeminarPage } from './seminar.page';

const routes: Routes = [
  {
    path: '',
    component: SeminarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeminarPageRoutingModule {}
