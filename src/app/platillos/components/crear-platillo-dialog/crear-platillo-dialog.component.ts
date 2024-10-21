import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Platillo } from '../../../interfaces/menu-platillos.interface';
import { MenuSemanalService } from '../../../services/menu-semanal.service';

@Component({
  selector: 'app-crear-platillo-dialog',
  templateUrl: './crear-platillo-dialog.component.html',
  styleUrls: ['./crear-platillo-dialog.component.css'],
  
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
    nombre: new FormControl<string>('', Validators.required),
    descripcion: new FormControl<string>('', Validators.required),
    img: new FormControl<string>(''),
    recomendado: new FormControl<boolean>(false),
    precio: new FormControl<any>('', Validators.required)
  });

  get currentPlatillo(): Platillo {
    const platillo = this.platilloForm.value as Platillo;

    return platillo;
  }


  cerrarModal():void{
    this.dialogRef.close()
  }



  async guardarPlatillo(){

    if (!this.platilloForm.valid) { // Formulario invalido. 
      return;
    }

    const {nombre, descripcion, recomendado, precio } = this.platilloForm.value;
    const datos = {
      nombre, descripcion, precio, recomendado: Boolean(recomendado), img: ''
    }

    const platillo = await this.menuSemanalService.agregarPlatillo(datos).catch( error => {
      console.log(error);
      alert(error)
      return null;
      
    });

    if (platillo !== null) {
      console.log(platillo.id);
      this.cerrarModal();
    }

  }

  public fileToUpload: any;
  public imageUrl: any = './assets/images/no_image.png';

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
