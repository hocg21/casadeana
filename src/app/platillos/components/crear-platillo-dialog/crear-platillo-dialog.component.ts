import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Platillo } from '../../../interfaces/menu-platillos.interface';
import { MenuSemanalService } from '../../../services/menu-semanal.service';

@Component({
  selector: 'app-crear-platillo-dialog',
  templateUrl: './crear-platillo-dialog.component.html',
  styleUrls: ['./crear-platillo-dialog.component.css']
})
export class CrearPlatilloDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CrearPlatilloDialogComponent>,
    private menuSemanalService: MenuSemanalService
  ){}


  public platilloForm = new FormGroup({
    nombre: new FormControl<string>(''),
    descripcion: new FormControl<string>(''),
    precio: new FormControl<number>(0),
    img: new FormControl<string>(''),
    recomendado: new FormControl<boolean>(false)
  });

  get currentPlatillo(): Platillo {
    const platillo = this.platilloForm.value as Platillo;

    return platillo;
  }


  cerrarModal():void{
    this.dialogRef.close()
  }



  guardarPlatillo():void{
    console.log({
      formIsValid: this.platilloForm.valid,
      value: this.platilloForm.value

    });

    const nuevo_platillo = this.menuSemanalService.agregarPlatillo(this.platilloForm.value);

    nuevo_platillo.then((p)=>{
      this.dialogRef.close();
    });

    this.dialogRef.afterClosed().subscribe(()=>{
      window.location.reload();
    })

  }

}
