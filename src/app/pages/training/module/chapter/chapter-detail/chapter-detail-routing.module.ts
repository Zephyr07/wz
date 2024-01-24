import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChapterDetailPage } from './chapter-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ChapterDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChapterDetailPageRoutingModule {}
