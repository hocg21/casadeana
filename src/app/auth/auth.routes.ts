import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

export const routes: Routes = [
   {
    path:'',
    component: AuthLayoutComponent,
    children :[
      {
        path: '',
        component: LoginPageComponent
      },
      {
        path:'**',
        redirectTo: 'login'
      }
    ]
  }
]
export default routes;
