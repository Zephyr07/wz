import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimulateurPage } from './simulateur.page';

const routes: Routes = [
  {
    path: '',
    component: SimulateurPage
  },
  {
    path: 'green-thursday',
    loadChildren: () => import('./green-thursday/green-thursday.module').then( m => m.GreenThursdayPageModule)
  },
  {
    path: 'car',
    loadChildren: () => import('./car/car.module').then( m => m.CarPageModule)
  },
  {
    path: 'travel',
    loadChildren: () => import('./travel/travel.module').then( m => m.TravelPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulateurPageRoutingModule {}
