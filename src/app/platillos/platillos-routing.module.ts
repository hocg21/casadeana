import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AsignarPlatillosComponent } from './pages/asignar-platillos/asignar-platillos.component';

//loclahost:4200/platillos
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path:'nuevo-platillo', component:NewPageComponent },
      { path:'asignar-platillos', component:AsignarPlatillosComponent,  canActivate: [ AuthGuard ], canMatch: [ AuthGuard ] },
      { path: '', component: ListPageComponent},
      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatillosRoutingModule { }
