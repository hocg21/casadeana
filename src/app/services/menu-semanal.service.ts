import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Platillo, PlatilloAsignacion } from '../interfaces/menu-platillos.interface';
import { DocumentData, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MenuSemanalService {
  constructor(private firebaseService: FirebaseService) { }

  /**
   * Nombre de la colección para platillos
   */
  private coleccionPlatillos: string = 'platillos';

  private coleccionMenuSemanal: string = 'menu_semanal';

  /**
   * Obtiene listado de los platillos disponibles.
   *
   * @author JHSS 2024-08-18 18:18:04
   * @returns
   */
  public async catalogoDePlatillos(){
      const documentos = await this.firebaseService.getDocumentsCollection(this.coleccionPlatillos);
      const platillos: Platillo[] = [];

      /* Procesar documentos. */
      documentos.forEach( doc => {
        const p = this.extraerDatosPlatillo(doc);
        platillos.push(p);
      });

      /* Ordenar listado */
      platillos.sort( (a,b) => {
        return a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase());
      });

      return platillos;
  }

  /**
   *
   * @param doc
   * @returns
   */
  private extraerDatosPlatillo(doc: QueryDocumentSnapshot<DocumentData, DocumentData>):Platillo{
    const data = doc.data();
    const id = doc.id;

    return {
      id,
      nombre: data['nombre'],
      descripcion: data['descripcion'],
      recomendado: data['recomendado'],
      img: data['img']
    };
  }

  /**
   * Platillos asignados al menu en la semana.
   *
   * @author JHSS 2024-08-18 22:30:39
   * @param semana Número de semana
   * @param anio Año
   * @returns
   */
  public async obtenerMenuDeSemana(semana:string, anio: string):Promise<PlatilloAsignacion[]>{
    /* Ruta a los platillos asignados.  */
    console.log(`${this.coleccionMenuSemanal}/${semana}_${anio}/platillos`)
    const platillosPath = `${this.coleccionMenuSemanal}/${semana}_${anio}/platillos`;
    const documents = await this.firebaseService.getDocumentsCollection(platillosPath);

    const aux: {
      idAsignacion:string,
      diaIndex: number,
      precio: string,
      platillo: DocumentReference
    }[] = [];
    /* Procesar documentos. */
    documents.forEach( async doc => {
      const idAsignacion = doc.id
      const data = doc.data();
      aux.push({
        idAsignacion,
        diaIndex: data['dia'],
        precio: data['precio'],
        platillo: data['platilloRef']
      });
    });

    /* Ordenar por indice del dia de la semana. */
    aux.sort((a,b) => (a.diaIndex - b.diaIndex));
    const p: PlatilloAsignacion[] = await Promise.all(
      aux.map( async(e) => {
        const { idAsignacion, diaIndex, precio } = e;
        const platillo = await this.firebaseService.getDocumentByReference(e.platillo);
        const dataPlatillo = platillo.data();
        const _aux_ = {
          id: platillo.id,
          nombre: dataPlatillo && dataPlatillo['nombre'] ? dataPlatillo['nombre'] : '',
          recomendado: dataPlatillo && dataPlatillo['recomendado'] ? dataPlatillo['recomendado'] : false,
          img: dataPlatillo && dataPlatillo['img'] ? dataPlatillo['img'] : '',
        }
        return {
          idAsignacion, diaIndex, precio, platillo: _aux_
        }
      })
    );

    return p;
  }

  public async agregarPlatillo(platillo: any)
  {
    //addDocument puede regresar la info del platillo si se manda un tercer parametro siendo el id del platillo
    const new_platillo =  await this.firebaseService.addDocument(this.coleccionPlatillos, platillo)
    return new_platillo;

  }

}
