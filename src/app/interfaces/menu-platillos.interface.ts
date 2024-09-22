export interface Platillo {
    id: string,
    nombre: string,
    descripcion?: string,
    img: string,
    recomendado: boolean
}

export interface PlatilloAsignacion {
    idAsignacion: string,
    diaIndex: number,
    precio: string,
    platillo: Platillo
}


export interface PlatilloAAsignar{
  indice_dia: number,
  id: string
}
export interface PlatilloAsignado {
  num_semana: string,
  platillos: Array<PlatilloAAsignar>
}
