import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    //loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./pages/maintenance/maintenance/maintenance.module').then( m => m.MaintenancePageModule)
  },
  {
    path: 'create-account',
    loadChildren: () => import('./pages/auth/create-account/create-account.module').then(m => m.CreateAccountPageModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'stockist',
    loadChildren: () => import('./pages/stockist/stockist.module').then( m => m.StockistPageModule)
  },
  {
    path: 'seminar',
    loadChildren: () => import('./pages/seminar/seminar.module').then( m => m.SeminarPageModule)
  },
  {
    path: 'promotion',
    loadChildren: () => import('./pages/promotion/promotion.module').then( m => m.PromotionPageModule)
  },
  {
    path: 'simulateur',
    loadChildren: () => import('./pages/simulateur/simulateur.module').then( m => m.SimulateurPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'partner',
    loadChildren: () => import('./pages/partner/partner.module').then( m => m.PartnerPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'training',
    loadChildren: () => import('./pages/training/training.module').then( m => m.TrainingPageModule)
  },
  {
    path: 'testimonial',
    loadChildren: () => import('./pages/testimonial/testimonial.module').then( m => m.TestimonialPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/auth/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'tournament',
    loadChildren: () => import('./pages/tournament/tournament.module').then( m => m.TournamentPageModule)
  },
  {
    path: 'game',
    loadChildren: () => import('./pages/game/game.module').then( m => m.GamePageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./pages/schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'store',
    loadChildren: () => import('./pages/store/store.module').then( m => m.StorePageModule)
  },
  {
    path: 'activated-account',
    loadChildren: () => import('./pages/auth/activated-account/activated-account.module').then( m => m.ActivatedAccountPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
