import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-borrar-platillo-dialog',
  templateUrl: './borrar-platillo-dialog.component.html',
  styleUrls: ['./borrar-platillo-dialog.component.css']
})
export class BorrarPlatilloDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<BorrarPlatilloDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ){
      this.data = data;

      console.log(data)
    }

    cerrarModal(){
      this.dialogRef.close();
    }

    eliminarPlatillo(id: string){
      console.log(id)
    }

}
