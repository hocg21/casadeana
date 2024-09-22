import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatillosRoutingModule } from './platillos-routing.module';
import { PlatilloPageComponent } from './pages/platillo-page/platillo-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { MaterialModule } from '../material/material.module';
import { AsignarPlatillosComponent } from './pages/asignar-platillos/asignar-platillos.component';
import { AsignarPlatillosDialogComponent } from './components/asignar-platillos-dialog/asignar-platillos-dialog.component';
import { AsignarPlatillosDragDialogComponent } from './components/asignar-platillos-drag-dialog/asignar-platillos-drag-dialog.component';
import { CrearPlatilloDialogComponent } from './components/crear-platillo-dialog/crear-platillo-dialog.component';
import { PlatilloImagenPipe } from './pipes/platillo-imagen.pipe';
import { ListItemPlatilloComponent } from './components/list-item-platillo/list-item-platillo.component';
import { BorrarPlatilloDialogComponent } from './components/borrar-platillo-dialog/borrar-platillo-dialog.component';
import { PlatilloRecomendadoImagenPipe } from './pipes/platillo-recomendado-image.pipe';

@NgModule({
  declarations: [
    PlatilloPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    NewPageComponent,
    AsignarPlatillosComponent,
    AsignarPlatillosDialogComponent,
    AsignarPlatillosDragDialogComponent,
    CrearPlatilloDialogComponent,
    PlatilloImagenPipe,
    PlatilloRecomendadoImagenPipe,
    ListItemPlatilloComponent,
    BorrarPlatilloDialogComponent
  ],
  imports: [
    CommonModule,
    PlatillosRoutingModule,
    MaterialModule
  ]
})
export class PlatillosModule { }
