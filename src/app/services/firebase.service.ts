import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { addDoc, collection, doc, DocumentReference, Firestore, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp;
  private analytics: Analytics;
  private firestore: Firestore;

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.analytics = getAnalytics();
    this.firestore = getFirestore(this.app);
  }

  /**
   * Obtiene una referencia a la colección.
   *
   * @author JHSS 2024-08-18 17:33:21
   * @param collectionName Nombre/Path de la colección.
   * @returns
   */
  private async getCollectionReference(collectionName: string){
    return collection(this.firestore, collectionName);
  }

  /**
   * Obtiene referencia a un documento en una colección.
   *
   * @author JHSS 2024-08-18 17:27:05
   * @param collectionName Nombre/Path de la colección.
   * @param id Identificador de documento.
   * @returns
   */
  private async getDocumentReference(collectionName: string, id: string){
    return doc(this.firestore, collectionName, id);
  }

  /**
   * Agrega un documento a la colección.
   * Si el documento ya existe reemplaza
   * su contenido con data.
   *
   * @author JHSS 2024-08-18 12:56:47
   * @param collectionName Nombre/Path de la colección
   * @param data Objeto con datos
   * @returns
   */
  public async addDocument(collectionName: string, data: any, documentId:string|undefined = undefined): Promise<DocumentReference>{

    if (documentId) { // Crear o sobreescribir uno existente por id.
      const documentReference = await this.getDocumentReference(collectionName, documentId);
      await setDoc( documentReference, data );
      return doc(this.firestore, collectionName, documentId);
    }else{ // Crear con id automatico.
      const collectionReference = await this.getCollectionReference(collectionName);
      const docRef = await addDoc( collectionReference, data );
      return doc(this.firestore, collectionName, docRef.id);
    }
  }

  /**
   * Actualiza un documento en una colección.
   *
   * @author JHSS 2024-08-18 17:18:02
   * @param collectionName
   * @param documentId
   * @param data
   */
  public async updateDocument(collectionName: string, documentId: string, data:any):Promise<void>{
    const docRef = await this.getDocumentReference(collectionName, documentId);
    await updateDoc(docRef, data);
  }

  /**
   * Obtiene la información de un documento.
   *
   * @author JHSS 2024-08-18 23:30:57
   * @param document Referencia al documento
   * @returns
   */
  public getDocumentByReference(document: DocumentReference){
    return getDoc(document);
  }

  /**
   * Obtiene los documentos de una colección.
   *
   * @author JHSS 2024-08-18 23:30:07
   * @param collectionName Nombre/Path de la colección.
   * @returns
   */
  public async getDocumentsCollection(collectionName: string){
    const collectionReference = await this.getCollectionReference(collectionName);
    return await getDocs( collectionReference );
  }

}
