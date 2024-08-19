export interface Platillo {
    id: string,
    nombre: string,
    img: string,
    recomendado: boolean, 
}

export interface PlatilloAsignacion {
    idAsignacion: string,
    diaIndex: number, 
    precio: string,
    platillo: Platillo 
}


