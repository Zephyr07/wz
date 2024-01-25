import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../pages/user/user.module').then(m => m.UserPageModule)
      },
      {
        path: 'game',
        loadChildren: () => import('../pages/game/game.module').then(m => m.GamePageModule)
      },
      {
        path: 'tournament',
        loadChildren: () => import('../pages/tournament/tournament.module').then(m => m.TournamentPageModule)
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
