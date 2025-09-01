import { Component, Input, OnInit } from '@angular/core';
import { Platillo } from 'src/app/interfaces/menu-platillos.interface';
import { BorrarPlatilloDialogComponent } from '../borrar-platillo-dialog/borrar-platillo-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PlatilloImagenPipe } from '../../pipes/platillo-imagen.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'list-item-platillo',
    templateUrl: './list-item-platillo.component.html',
    styleUrls: ['./list-item-platillo.component.css'],
    standalone:true,
    imports: [MatListModule, MatButtonModule, MatIconModule,   PlatilloImagenPipe, AsyncPipe]
})
export class ListItemPlatilloComponent implements OnInit {

  @Input()
  public platillos: Platillo[] = [];


  url: Promise<string> | undefined;

  ngOnInit(): void {
    if(!this.platillos) throw Error('falta platilllo');


  }
  constructor(
    private dialog: MatDialog
  ){}

  abirBorrarPlatillo(platillo: Platillo):void{
    const borrar_platillo_popup = this.dialog.open(BorrarPlatilloDialogComponent,{
      data: platillo
    })
  }

}
