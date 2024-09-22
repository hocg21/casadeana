import { environment } from "src/environments/environments";
import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { 
  getAuth, Auth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult, 
  getAdditionalUserInfo, 
  signInWithCredential, 
  OAuthCredential, 
  signOut
} from "firebase/auth";
import { 
  addDoc, collection, 
  doc, DocumentReference, 
  Firestore, getDoc, 
  getDocs, getFirestore, 
  setDoc, updateDoc 
} from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp;
  private analytics: Analytics;
  private firestore: Firestore;
  auth: Auth;
  private googleAuthProvider: GoogleAuthProvider;

  constructor() { 
    this.app = initializeApp(environment.firebase);  
    this.analytics = getAnalytics(this.app);
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.googleAuthProvider = new GoogleAuthProvider();
  }

  public currentUser(){
    return this.auth.currentUser;
  }

  /**
   * Redirecciona para login con google.
   *  
   * @author JHSS 2024-08-23 21:27:44
   */
  public signInGoogleWithRedirect():void{
    signInWithRedirect(this.auth, this.googleAuthProvider).
      catch(error => {
        console.log('signInError', error);
        
      })
  }

  /**
   * signout
   */
  public signout() {
    return signOut(this.auth);
  }


  /**
   * Obtiene la información del usuario al ingresar 
   * con google. 
   * 
   * @author JHSS 2024-08-23 21:28:39
   * @returns 
   */
  public async getRedirectResult(){
    try {
      const result = await getRedirectResult(this.auth) 
      if (result !== null) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        return {
          credential, user: result.user
        };     
      }
    } catch (error:any) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log({
        errorCode, errorMessage, email, credential
      });
    }
    return null; 
  }

  /**
   * Inicia sesion en firebase con las credenciales del usuario
   * logeado con google. 
   * 
   * @author JHSS 2024-08-23 21:31:01
   * @param credential 
   */
  public async signInToFirebase(credential: OAuthCredential){
    signInWithCredential(this.auth, credential)
      .then(user => {
        console.log({userCredential: user});
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The credential that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log({
          errorCode, errorMessage, email, credential
        });
        
      });

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
