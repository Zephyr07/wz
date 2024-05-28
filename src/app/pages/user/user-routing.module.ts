import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPage } from './user.page';

const routes: Routes = [
  {
    path: '',
    component: UserPage
  },
  {
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
    path: 'referral',
    loadChildren: () => import('./referral/referral.module').then( m => m.ReferralPageModule)
  },
  {
    path: 'my-tournament',
    loadChildren: () => import('./my-tournament/my-tournament.module').then( m => m.MyTournamentPageModule)
  },
  {
    path: 'my-schedule',
    loadChildren: () => import('./my-schedule/my-schedule.module').then( m => m.MySchedulePageModule)
  },
  {
    path: 'recharge-account',
    loadChildren: () => import('./recharge-account/recharge-account.module').then( m => m.RechargeAccountPageModule)
  },
  {
    path: 'my-order',
    loadChildren: () => import('./my-order/my-order.module').then( m => m.MyOrderPageModule)
  },
  {
    path: 'my-tombola',
    loadChildren: () => import('./my-tombola/my-tombola.module').then( m => m.MyTombolaPageModule)
  },
  {
    path: 'fidelity',
    loadChildren: () => import('./fidelity/fidelity.module').then( m => m.FidelityPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
