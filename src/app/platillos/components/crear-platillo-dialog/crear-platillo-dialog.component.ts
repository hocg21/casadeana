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

  public nuevo_platillo_id = '';
  public agregar_imagen = false;
  public img_link = '';

  public platilloForm = new FormGroup({
    id: new FormControl<string>(''),
    nombre: new FormControl<string>(''),
    descripcion: new FormControl<string>(''),
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
    // console.log({
    //   formIsValid: this.platilloForm.valid,
    //   value: this.platilloForm.value

    // });

    // const nuevo_platillo = this.menuSemanalService.agregarPlatillo(this.platilloForm.value);

    // nuevo_platillo.then((p)=>{
    //   this.nuevo_platillo_id  = p.id;
    //   this.agregar_imagen = true;
    // });

    this.agregar_imagen = true;

  }

  public fileToUpload: any;
  public imageUrl: any;

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.fileToUpload = (target.files as FileList)[0];

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  guardarImagen(){
    console.log(this.nuevo_platillo_id )
  }

}
