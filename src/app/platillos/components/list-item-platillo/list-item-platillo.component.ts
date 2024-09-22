import { Component, Input, OnInit } from '@angular/core';
import { Platillo } from 'src/app/interfaces/menu-platillos.interface';
import { BorrarPlatilloDialogComponent } from '../borrar-platillo-dialog/borrar-platillo-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'list-item-platillo',
  templateUrl: './list-item-platillo.component.html',
  styleUrls: ['./list-item-platillo.component.css']
})
export class ListItemPlatilloComponent implements OnInit {

  @Input()
  public platillos: Platillo[] = [];

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
