import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';

//casadeanaslw.com/
export const routes: Routes = [
  {
    path:'login',
    loadChildren: () => import('./auth/auth.routes')
  },
  {
    path:'',
    loadChildren: () => import ('./platillos/platillos.module').then(m=>m.PlatillosModule),
  },
  {
    path:'404',
    component: NotFoundPageComponent
  },
  {
    path:'**',
    redirectTo: '404'
  }
];

