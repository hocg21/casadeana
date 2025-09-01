import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Breakpoints} from '@angular/cdk/layout';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'
import { Platillo, PlatilloAsignacion } from 'src/app/interfaces/menu-platillos.interface';
import { MenuSemanalService } from 'src/app/services/menu-semanal.service';
import { AsignarPlatillosDragDialogComponent } from '../../components/asignar-platillos-drag-dialog/asignar-platillos-drag-dialog.component';
import { CrearPlatilloDialogComponent } from '../../components/crear-platillo-dialog/crear-platillo-dialog.component';
import * as moment from 'moment';
import { BorrarPlatilloDialogComponent } from '../../components/borrar-platillo-dialog/borrar-platillo-dialog.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatilloImagenPipe } from '../../pipes/platillo-imagen.pipe';
import { ListItemPlatilloComponent } from '../../components/list-item-platillo/list-item-platillo.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-asignar-platillos',
    templateUrl: './asignar-platillos.component.html',
    styleUrls: ['./asignar-platillos.component.css'],
    standalone:true,
    imports: [MatFormFieldModule, MatNativeDateModule, MatDatepickerModule, FormsModule, ReactiveFormsModule,  MatGridListModule,
       MatButtonModule, MatListModule, MatProgressSpinnerModule, MatIconModule, MatDividerModule,
       ListItemPlatilloComponent,  PlatilloImagenPipe, AsyncPipe]
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
    private platillosService: MenuSemanalService,
    private router: Router,
  ) {

  }


  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private route = inject(ActivatedRoute);


  public loading: boolean = true;

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe((params)=>{
      this.aver(params.get('week')!);
    })


    this.platillosService.catalogoDePlatillos()
    .then((data : Platillo[])=>{
      // console.log(data)
      this.platillos = JSON.parse(JSON.stringify(data));;
      this.platillosAAsignar = JSON.parse(JSON.stringify(data));

      this.loading = false;
    });
  }

  async aver(week: string){
    this.week_number = week;

    if(this.week_number !== null)
    {
      const w = parseInt(this.week_number.split('_')[0]);
      const y = parseInt(this.week_number.split('_')[1]);

      const date = new Date(y, 0, (1 + (w -1) * 7 ));
      date.setDate(date.getDate() + (1 - date.getDay()));

      const dia_lunes = new Date(date).getDate();
      const mes_lunes = new Date(date).getMonth()+1;

      const dia_viernes = new Date(date).getDate()+4;
      const mes_viernes = new Date(date).getMonth()+1;

      const start = `${mes_lunes}/${dia_lunes}/${y}`;
      const end = `${mes_viernes}/${dia_viernes}/${y}`;


      this.semanaForm.setValue({
        start: new Date( start ),
        end : new Date(end)
      })
      await this.getWeekNumber2(start, end);

    }
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

  public selectedWeek: boolean = false;

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
        semana: this.week_number,
        platillosAsignados: this.getPlatillosPorDia(dia.diaIndex),
        platillos: this.getPlatillosAAsignar(this.platillosAAsignar, this.platillosTest),
        idsAsignacion: this.getIdsAsignacioPorDia(dia.diaIndex),
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
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

  public week_number = "";
  public current_year = "";
  async getWeekNumber2 (start: any, end: any)
  {

    let date1 = new Date(start)

    if(end !== null)
    {
      let onejan = new Date(date1.getFullYear(), 0, 1);
      let week = Math.ceil((((date1.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);

      this.getPlatillosPorSemana(week.toString(),this.getYear())

      this.week_number = week.toString();
      this.current_year = date1.getFullYear().toString();

      this.getDaysOfWeek(start, end);

      this.selectedWeek = true;
    }

  }

  getWeekNumberFromHTML(start: HTMLInputElement , end: HTMLInputElement)
  {
    this.getWeekNumber2(start.value, end.value).then(()=>{
      this.router.navigateByUrl(`/asignar-platillos/${this.week_number}_${this.current_year}`).then(()=>{
          window.location.reload()
      })
    });
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
    const current_year = "2025" //moment().format('YYYY');
    return current_year;
  }

}

