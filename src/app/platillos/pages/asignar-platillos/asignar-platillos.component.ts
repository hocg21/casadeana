import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog'
import { AsignarPlatillosDialogComponent } from '../../components/asignar-platillos-dialog/asignar-platillos-dialog.component';
import { Platillo, PlatilloAsignacion } from 'src/app/interfaces/menu-platillos.interface';
import { MenuSemanalService } from 'src/app/services/menu-semanal.service';
import { AsignarPlatillosDragDialogComponent } from '../../components/asignar-platillos-drag-dialog/asignar-platillos-drag-dialog.component';
import { CrearPlatilloDialogComponent } from '../../components/crear-platillo-dialog/crear-platillo-dialog.component';
import * as moment from 'moment';
import { BorrarPlatilloDialogComponent } from '../../components/borrar-platillo-dialog/borrar-platillo-dialog.component';


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
        console.log(data)
        this.platillos = data;
        this.platillosAAsignar = JSON.parse(JSON.stringify(data));
    })
    this.getPlatillosPorSemana(this.getWeekNumber(),this.getYear())
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

  public platillosSemana : PlatilloAsignacion[] = [];
  public platillosAsignados: Platillo [] = [];

  public platillos: Platillo[] = [];
  public platillosAAsignar: Platillo[] = [];

  getPlatillosPorSemana(semana: string, anio:string){
    this.platillosService.obtenerMenuDeSemana(semana, anio)
      .then((data:PlatilloAsignacion[] )=>{
        this.platillosSemana = data;
      })
  }

  getPlatillosPorDia(dia: number){
    this.platillosAsignados = this.platillosSemana.filter((platillo: PlatilloAsignacion ) => platillo.diaIndex === dia ).map(e=>e.platillo)
    return this.platillosAsignados;
  }

  getPlatillosAAsignar(platillosAAsignar: Platillo[], platillosAsignados: Platillo[] ){
    let platillos_a_asignar: Platillo [] = [];
    let platillos_asignados:any = [];

    platillos_asignados = platillosAsignados.map(platillo => platillo.id )
    console.log(platillos_asignados)

    platillos_a_asignar = platillosAAsignar.filter(platillo => platillos_asignados.indexOf(platillo.id))
    console.log(platillos_a_asignar)

    return  platillos_a_asignar;
  }
  asignarPlatillos(diaSemana:number) : void {
    const dialogRef = this.dialog.open(AsignarPlatillosDragDialogComponent,{
      disableClose: true,
      data: {
        fecha: this.getRelativeDayInWeek(diaSemana),
        dia: diaSemana,
        anio: this.getYear(),
        semana: this.getWeekNumber(),
        platillosAsignados: this.getPlatillosPorDia(diaSemana -1 ),
        platillos: this.getPlatillosAAsignar(this.platillosAAsignar, this.getPlatillosPorDia(diaSemana -1 )),
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

  getYear = (): string => {
    const current_year = moment().format('YYYY');
    return current_year;
  }


}

