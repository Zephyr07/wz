import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TombolaPage } from './tombola.page';

const routes: Routes = [
  {
    path: '',
    component: TombolaPage
  },
  {
    path: 'tombola-detail',
    loadChildren: () => import('./tombola-detail/tombola-detail.module').then( m => m.TombolaDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TombolaPageRoutingModule {}
