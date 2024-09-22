import { Component, Inject, NgModule, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Platillo, PlatilloAAsignar, PlatilloAsignado } from 'src/app/interfaces/menu-platillos.interface';
import { MenuSemanalService } from '../../../services/menu-semanal.service';
import {NgFor} from '@angular/common';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-asignar-platillos-drag-dialog',
  templateUrl: './asignar-platillos-drag-dialog.component.html',
  styleUrls: ['./asignar-platillos-drag-dialog.component.css']
})
export class AsignarPlatillosDragDialogComponent {


  public platillos: Platillo [] = [];
  public platillosAsignados: Platillo [] = [];

  constructor(
    public dialogRef: MatDialogRef<AsignarPlatillosDragDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private menuSemanalService: MenuSemanalService
  ){
    this.data = data;
    this.platillos = data.platillos;
    this.platillosAsignados = data.platillosAsignados;
    console.log(data)
  }

  public platillosSeleccionados :any = [];

  drop(event: CdkDragDrop<Platillo[]>){

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


  onNoClick():void {
    this.dialogRef.close(false);
  }

  cerrarModal():void{
    this.dialogRef.close()
  }

  public platillosPorAsignar: PlatilloAsignado = {num_semana: '', platillos: []};
  public platillosAAsignar : PlatilloAAsignar[] = [];

  guardarPlatillos():void{
    /*
    {
      num_semana: 23_2024,
      platillos: [
        {
          indice_dia: 0
          id: aasdasdfasd,
        },
         {
          indice_dia: 0,
          id:qwerqwerqwre,
        }
      ]
    }
    */
   console.log(this.data)
    this.platillosAsignados.forEach(platillo => {
      this.platillosAAsignar.push({
        id: platillo.id,
        indice_dia: 0
      })
    });

    this.platillosPorAsignar.num_semana = this.data.semana+'_'+this.data.anio;
    this.platillosPorAsignar.platillos = this.platillosAAsignar

    console.log(this.platillosPorAsignar)

    //this.menuSemanalService
    this.menuSemanalService.agregarPlatillo(this.platillosPorAsignar);


  }

}
