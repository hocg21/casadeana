import { PublicGuard } from './auth/guards/public.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';

//casadeanaslw.com/
const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import ('./auth/auth.module').then(m=>m.AuthModule),
    canActivate: [PublicGuard],
    canMatch: [PublicGuard]
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
    path:'',
    redirectTo: 'platillos',
    pathMatch: 'full'
  },
  {
    path:'**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
