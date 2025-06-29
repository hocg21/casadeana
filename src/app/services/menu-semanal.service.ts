import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Platillo, PlatilloAsignacion, PlatilloAsignado } from '../interfaces/menu-platillos.interface';
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
      precio: data['precio'],
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
    const platillosPath = `${this.coleccionMenuSemanal}/${semana}_${anio}/comidas_semana`;
    const documents = await this.firebaseService.getDocumentsCollection(platillosPath);

    const aux: {
      idAsignacion:string,
      diaIndex: number,
      precio: string,
      platillo: DocumentReference,
      posicion: number
    }[] = [];

    /* Procesar documentos. */
    documents.forEach( async doc => {

      const idAsignacion = doc.id
      const data = doc.data();

      aux.push({
        idAsignacion,
        diaIndex: data['dia'],
        precio: data['precio'],
        platillo: data['platilloRef'],
        posicion: data['posicion']
      });
    });

    /* Ordenar por indice del dia de la semana. */
    aux.sort((a,b) => (a.diaIndex - b.diaIndex));
    const p: PlatilloAsignacion[] = await Promise.all(
      aux.map( async(e) => {
        const { idAsignacion, diaIndex, precio, platillo: any, posicion,  } = e;
        const platillo = await this.firebaseService.getDocumentByReference(e.platillo);
        const dataPlatillo = platillo.data();
        const _aux_ = {
          id: platillo.id,
          nombre: dataPlatillo && dataPlatillo['nombre'] ? dataPlatillo['nombre'] : '',
          descripcion: dataPlatillo && dataPlatillo['descripcion'] ? dataPlatillo['descripcion'] : '',
          recomendado: dataPlatillo && dataPlatillo['recomendado'] ? dataPlatillo['recomendado'] : false,
          img: dataPlatillo && dataPlatillo['img'] ? dataPlatillo['img'] : '',
          precio: dataPlatillo && dataPlatillo['precio'] ? dataPlatillo['precio'] : ''
        }
        return {
          idAsignacion, diaIndex, precio, platillo: _aux_, posicion
        }
      })
    );

    return p;
  }

  public agregarPlatillo(platillo: any){
    return this.firebaseService.addDocument(this.coleccionPlatillos, platillo);
  }

  public async asignarPlatillos(data:PlatilloAsignado )
  {
    /*
      primero es chechar si existe el documento de menu_semanal (30_2024)
      si no pues crearlo, una vez creado hay que recorrer los platillos y ageragr 1 por 1 en
      menu_semal/30_2024/comidas_semana/
    */
    // const semana_path = `${this.coleccionMenuSemanal}/${data.num_semana}/comidas_semana`;
    const semana_path = `${this.coleccionMenuSemanal}`;
    const comidas_semana_path = `${semana_path}/${data.num_semana}/comidas_semana`;

    const platillos_semana = await this.firebaseService.getDocumentsCollection(comidas_semana_path);

    for (const key in data.platillos) {
      const element = data.platillos[key];

      const platillo_a_asignar = {
        dia : element.indice_dia,
        posicion : parseInt(key, 10), //,10 es para que este en base 10
        platilloRef :  await this.firebaseService.getDocumentReference(this.coleccionPlatillos, element.id)
      };
      console.log(platillo_a_asignar)
      this.firebaseService.addDocument(comidas_semana_path, platillo_a_asignar);

    }
    this.firebaseService.addDocument(semana_path, {'fechaActualizacion': new Date()}, data.num_semana );

  }

  public async borrarPlatillosAsignados(num_semana:string, ids: string[])
  {
    ///menu_semanal/43_2024/comidas_semana/'
    const collectionName = `${this.coleccionMenuSemanal}/${num_semana}/comidas_semana/`;

    ids.forEach(id =>{
      this.firebaseService.deleteDocument(collectionName, id);
    })

  }

  public async borrarPlatillo(id: string, imageRef: string)
  {
    const collectionName = `${this.coleccionPlatillos}/`

    this.firebaseService.deleteDocument(collectionName, id);
    this.firebaseService.deleteImage(imageRef);

  }

  public cargarImagen(imagen: any){
    const aver =  this.firebaseService.uploadImage(imagen);
    return aver;
  }

  public elimiarImagen(imageRef: string){
    this.firebaseService.deleteImage(imageRef);
  }


}
