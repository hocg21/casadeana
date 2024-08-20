import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatillosRoutingModule } from './platillos-routing.module';
import { PlatilloPageComponent } from './pages/platillo-page/platillo-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    PlatilloPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    NewPageComponent,
    SearchPageComponent
  ],
  imports: [
    CommonModule,
    PlatillosRoutingModule,
    MaterialModule
  ]
})
export class PlatillosModule { }
