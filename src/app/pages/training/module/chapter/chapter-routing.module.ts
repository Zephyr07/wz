import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChapterPage } from './chapter.page';

const routes: Routes = [
  {
    path: '',
    component: ChapterPage
  },
  {
    path: 'chapter-detail',
    loadChildren: () => import('./chapter-detail/chapter-detail.module').then( m => m.ChapterDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChapterPageRoutingModule {}
