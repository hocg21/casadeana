import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Platillo } from 'src/app/interfaces/menu-platillos.interface';
import { MenuSemanalService } from 'src/app/services/menu-semanal.service';

@Component({
  selector: 'app-asignar-platillos-dialog',
  templateUrl: './asignar-platillos-dialog.component.html',
  styleUrls: ['./asignar-platillos-dialog.component.css']
})
export class AsignarPlatillosDialogComponent {


  public platillos: Platillo [] = [];
  public platillosAsignados: Platillo [] = [];

  @ViewChild('plt', {static: true}) plt?:MatSelectionList ;

  constructor(
    public dialogRef: MatDialogRef<AsignarPlatillosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private platillosService:  MenuSemanalService
  ){
    this.data = data;
    this.platillos = data.platillos;
    this.platillosAsignados = data.platillosAsignados;
    console.log(data)
  }

  public platillosSeleccionados :any = [];

  onChange(change: MatSelectionListChange){
    console.log(change.options[0])
    console.log(change.options[0].value)
    this.platillosSeleccionados.push(change.options[0].value)
    this.platillosAsignados[0];
  }

  onNoClick():void {
    this.dialogRef.close(false);
  }

  cerrarModal():void{
    this.dialogRef.close()
  }

  guardarPlatillos():void{
    this.dialogRef.close(this.platillosSeleccionados);
  }


}
