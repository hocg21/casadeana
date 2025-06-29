import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuSemanalService } from 'src/app/services/menu-semanal.service';

@Component({
  selector: 'app-borrar-platillo-dialog',
  templateUrl: './borrar-platillo-dialog.component.html',
  styleUrls: ['./borrar-platillo-dialog.component.css']
})
export class BorrarPlatilloDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<BorrarPlatilloDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private menuSemanalService: MenuSemanalService
    ){
      this.data = data;
    }

    cerrarModal(){
      this.dialogRef.close();
    }

    async eliminarPlatillo(id: string, imageRef: string){
      await this.menuSemanalService.borrarPlatillo(id, imageRef);
      this.dialogRef.close();
    }

}
