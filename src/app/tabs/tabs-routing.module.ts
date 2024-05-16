import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'game',
        loadChildren: () => import('../pages/game/game.module').then(m => m.GamePageModule)
      },
      {
        path: 'store',
        loadChildren: () => import('../pages/store/store.module').then(m => m.StorePageModule)
      },
      {
        path: 'tournament',
        loadChildren: () => import('../pages/tournament/tournament.module').then(m => m.TournamentPageModule)
      },
      {
        path: 'schedule',
        loadChildren: () => import('../pages/schedule/schedule.module').then(m => m.SchedulePageModule)
      },
      {
        path: 'tombola',
        loadChildren: () => import('../pages/tombola/tombola.module').then(m => m.TombolaPageModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('../pages/menu/menu.module').then(m => m.MenuPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
