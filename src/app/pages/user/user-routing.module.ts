import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPage } from './user.page';

const routes: Routes = [
  {
    path: '',
    component: UserPage
  },  {
    path: 'subscription',
    loadChildren: () => import('./subscription/subscription.module').then( m => m.SubscriptionPageModule)
  },
  {
    path: 'pack',
    loadChildren: () => import('./pack/pack.module').then( m => m.PackPageModule)
  },
  {
    path: 'demand',
    loadChildren: () => import('./demand/demand.module').then( m => m.DemandPageModule)
  },
  {
    path: 'my-training',
    loadChildren: () => import('./my-training/my-training.module').then( m => m.MyTrainingPageModule)
  },
  {
    path: 'referral',
    loadChildren: () => import('./referral/referral.module').then( m => m.ReferralPageModule)
  },
  {
    path: 'my-tournament',
    loadChildren: () => import('./my-tournament/my-tournament.module').then( m => m.MyTournamentPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
