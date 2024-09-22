import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { Platillo, PlatilloAsignacion } from 'src/app/interfaces/menu-platillos.interface';
import { MenuSemanalService } from 'src/app/services/menu-semanal.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnDestroy, OnInit {
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

  panelOpenState = false

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnInit(): void {
    const semana = this.getWeekNumber();
    const anio = this.getYear()
    this.getPlatillosPorSemana(semana,anio)
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


  getPlatillosPorSemana(semana: string, anio:string){
    this.platillosService.obtenerMenuDeSemana(semana, anio)
      .then((data:PlatilloAsignacion[] )=>{
        this.platillosSemana = data;
        console.log(data)
      })
  }


  getRelativeDayInWeek = (dy:number):Date  =>  {
    const d = new Date();
    const offset = d.getDay() - dy;
    const d2 = new Date(d);
    d.setDate(d.getDate()-offset)
    return  d
  }

  getPlatillosPorDia(dia: number){
    this.platillosAsignados = this.platillosSemana.filter((platillo: PlatilloAsignacion ) => platillo.diaIndex === dia ).map(e=>e.platillo)

    return this.platillosAsignados;
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
