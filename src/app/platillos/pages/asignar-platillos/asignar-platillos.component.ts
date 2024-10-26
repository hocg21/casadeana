import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog'
import { Platillo, PlatilloAsignacion } from 'src/app/interfaces/menu-platillos.interface';
import { MenuSemanalService } from 'src/app/services/menu-semanal.service';
import { AsignarPlatillosDragDialogComponent } from '../../components/asignar-platillos-drag-dialog/asignar-platillos-drag-dialog.component';
import { CrearPlatilloDialogComponent } from '../../components/crear-platillo-dialog/crear-platillo-dialog.component';
import * as moment from 'moment';
import { BorrarPlatilloDialogComponent } from '../../components/borrar-platillo-dialog/borrar-platillo-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-asignar-platillos',
  templateUrl: './asignar-platillos.component.html',
  styleUrls: ['./asignar-platillos.component.css']
})
export class AsignarPlatillosComponent  implements OnDestroy, OnInit {
  destroyed = new Subject<void>();
  currentScreenSize: string = "";
  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'xsm'],
    [Breakpoints.Small, 'sm'],
    [Breakpoints.Medium, 'md'],
    [Breakpoints.Large, 'l'],
    [Breakpoints.XLarge, 'xl'],
  ]);

   constructor(
    private dialog: MatDialog,
    private platillosService: MenuSemanalService
  ) {
    inject(BreakpointObserver)
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }


  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnInit(): void {

    this.platillosService.catalogoDePlatillos()
      .then((data : Platillo[])=>{
        // console.log(data)
        this.platillos = JSON.parse(JSON.stringify(data));;
        this.platillosAAsignar = JSON.parse(JSON.stringify(data));
    })


  }

  public dias = [
    {
      'diaIndex': 0,
      'nombre' : 'Lunes'
    },
    {
      'diaIndex': 1,
      'nombre' : 'Martes'
    },
    {
      'diaIndex': 2,
      'nombre' : 'Miercoles'
    },
    {
      'diaIndex': 3,
      'nombre' : 'Jueves'
    },
    {
      'diaIndex': 4,
      'nombre' : 'Viernes'
    },
  ]

  public semanaForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  public platillosSemana : PlatilloAsignacion[] = [];
  public platillosAsignados: Platillo [] = [];

  public platillosTest: Platillo [] = [];

  public platillos: Platillo[] = [];
  public platillosAAsignar: Platillo[] = [];

  public idsAsignacion: String[] = [];

  getPlatillosPorSemana(semana: string, anio:string){

    this.platillosService.obtenerMenuDeSemana(semana, anio)
    .then((data:PlatilloAsignacion[] )=>{

        this.platillosSemana = JSON.parse(JSON.stringify(data));

        data.forEach(platillo_asignado =>{
          this.idsAsignacion.push(platillo_asignado.idAsignacion)
          this.platillosTest.push(platillo_asignado.platillo)
        })

      })
  }

  getPlatillosPorDia(dia: number){
    this.platillosAsignados = this.platillosSemana.filter((platillo: PlatilloAsignacion ) => platillo.diaIndex === dia )
    .sort((a,b)=> (a.posicion - b.posicion))
    .map(e=>e.platillo)
    return this.platillosAsignados;
  }

  getPlatillosAAsignar(platillosAAsignar: Platillo[], platillosTest: Platillo[] ){
    let platillos_a_asignar: Platillo [] = [];
    let platillos_asignados: any = [];

    platillos_asignados = platillosTest.map((platillo) => {
      return platillo.id
    });

    platillos_a_asignar = platillosAAsignar.filter(platillo =>  platillos_asignados.indexOf(platillo.id) < 0);

    return  platillos_a_asignar;
  }

  getIdsAsignacioPorDia(dia:number){

    let idsComidasAsignadas = this.platillosSemana.filter((platillo: PlatilloAsignacion)  => platillo.diaIndex === dia )
    const ids: String[] = []
    idsComidasAsignadas.forEach((platillo) => {
      ids.push(platillo.idAsignacion)
    })

    return ids;
  }

  asignarPlatillos(dia:any) : void {
    const dialogRef = this.dialog.open(AsignarPlatillosDragDialogComponent,{
      disableClose: true,
      data: {
        fecha: dia.fecha,
        dia: dia.diaIndex + 1,
        indiceDia: dia.diaIndex,
        anio: this.getYear(),
        semana: this.getWeekNumber(),
        platillosAsignados: this.getPlatillosPorDia(dia.diaIndex),
        platillos: this.getPlatillosAAsignar(this.platillosAAsignar, this.platillosTest),
        idsAsignacion: this.getIdsAsignacioPorDia(dia.diaIndex)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });

  }

  abrirCrearPlatillo() : void {
    const crear_platillo_popup = this.dialog.open(CrearPlatilloDialogComponent, {
      disableClose: true,
      data:{}
    });
  }

  abirBorrarPlatillo(platillo: Platillo):void{
    console.log(platillo)
    const borrar_platillo_popup = this.dialog.open(BorrarPlatilloDialogComponent,{
      data: platillo
    })
  }

  getRelativeDayInWeek = (dy:number):Date  =>  {
    const d = new Date();
    const offset = d.getDay() - dy;
    const d2 = new Date(d);
    d.setDate(d.getDate()-offset)
    return  d
  }

  getWeekNumber = ():string =>{
    const now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    let week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return week.toString();
  }

  public week_number = "";
  getWeekNumber2 = (start: HTMLInputElement, end: HTMLInputElement) =>{

    let date1 = new Date(start.value)

    if(start.value !== null)
    {
      let onejan = new Date(date1.getFullYear(), 0, 1);
      let week = Math.ceil((((date1.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);

      this.getPlatillosPorSemana(week.toString(),this.getYear())

      this.week_number = week.toString()

      this.getDaysOfWeek(start.value, end.value)
    }

  }

  public week_days:any = [];
  getDaysOfWeek = (start: string , end: string)=>{
    this.week_days = [];

    const date = new Date(start);

    this.dias.forEach(dias => {
      let dia:any = {};
      dia['nombre'] = dias.nombre;
      dia['diaIndex'] = dias.diaIndex;

      let newDate = new Date();
      let day = new Date(newDate.setDate(date.getDate()+ dias.diaIndex ))
      dia['fecha'] = day;

      this.week_days.push(dia)
    })

  }

  getYear = (): string => {
    const current_year = moment().format('YYYY');
    return current_year;
  }

}

