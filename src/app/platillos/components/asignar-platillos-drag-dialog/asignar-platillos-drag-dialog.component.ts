import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Platillo, PlatilloAAsignar, PlatilloAsignado } from 'src/app/interfaces/menu-platillos.interface';
import { MenuSemanalService } from '../../../services/menu-semanal.service';

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
  public idsAsignados: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AsignarPlatillosDragDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private menuSemanalService: MenuSemanalService
  ){
    this.data = data;
    this.platillos = data.platillos;
    this.platillosAsignados = data.platillosAsignados;
    this.idsAsignados = data.idsAsignacion;
    console.log(data)

  }


  public platillosPorAsignar: PlatilloAsignado = {num_semana: '', platillos: []};
  public platillosAAsignar : PlatilloAAsignar[] = [];

  drop(event: CdkDragDrop<Platillo[]>){

    if (event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else
    {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.platillosAAsignar = [];

    console.log(event.container.data)

    event.container.data.forEach(platillo => {
      this.platillosAAsignar.push({
        id: platillo.id,
        indice_dia: this.data.indiceDia
      })
    });

  }

  myf(d:any){
    this.data = d;
  }


  onNoClick():void {
    this.dialogRef.close(false);
  }

  cerrarModal():void{
    this.dialogRef.close();
  }


  async guardarPlatillos():Promise<void> {

    // console.log(this.platillosAsignados)
    this.platillosPorAsignar.platillos = [];
    this.platillosPorAsignar.num_semana = this.data.semana+'_'+this.data.anio;
    this.platillosPorAsignar.platillos = this.platillosAAsignar

    // console.log(this.platillosPorAsignar)

    await this.menuSemanalService.borrarPlatillosAsignados(this.platillosPorAsignar.num_semana, this.idsAsignados);
    if(this.platillosAsignados.length > 0){
      await this.menuSemanalService.asignarPlatillos(this.platillosPorAsignar).then((aver) =>
        {
          console.log(aver)
        }
      );
    }
    this.dialogRef.close();


  }



}
