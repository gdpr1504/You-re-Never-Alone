import { NgModule } from '@angular/core';
import { PreloadAllModules,Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path:'',
    component:TabsPage,
    children:[
  
  {
    path: 'feed',
    loadChildren: () => import('../feed/feed.module').then( m => m.FeedPageModule)
  },
  {
    path: 'uploader',
    loadChildren: () => import('../uploader/uploader.module').then( m => m.UploaderPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
  },
  //{
   // path: '',
    //redirectTo: '/tabs/profile',
  //  pathMatch: 'full'
  //}
]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
