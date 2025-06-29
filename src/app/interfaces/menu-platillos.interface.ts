import { Observable } from "rxjs"

export interface Platillo {
    id: string,
    nombre: string,
    descripcion?: string,
    precio?: number,
    img: string,
    url?: Observable <any>,
    recomendado: boolean
}

export interface PlatilloAsignacion {
    idAsignacion: string,
    diaIndex: number,
    platillo: Platillo,
    posicion: number
}


export interface PlatilloAAsignar{
  indice_dia: number,
  id: string
}
export interface PlatilloAsignado {
  num_semana: string,
  platillos: Array<PlatilloAAsignar>
}
