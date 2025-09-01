import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, Subject, catchError, map, of, tap } from 'rxjs';
import { OAuthCredential, UserInfo } from 'firebase/auth';
import { User as FBUser } from 'src/app/auth/interfaces/user.interface';
import { UserSession } from 'src/app/interfaces/user-session';
import { CredentialSession } from 'src/app/interfaces/credential-session';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Injectable({providedIn: 'root'})
export class AuthService {

  // private baseUrl = environment.baseUrl;
  // private user?: UserInfo;
  // private _user: UserSession | null;
  // private _credential: CredentialSession | null;

  // constructor(private http: HttpClient) {

  //   // Load session
  //   const __u: string|null = sessionStorage.getItem('user');
  //   const __c: string|null = sessionStorage.getItem('credential');

  //   if (__u === null || __c === null) {
  //     this._user = null;
  //     this._credential = null;
  //   }else{
  //     this._user = JSON.parse(__u);
  //     this._credential = JSON.parse(__c);
  //   }
  // }

  // /**
  //  * Establece información de una nueva sesión de usuario.
  //  *
  //  * @author JHSS 2024-09-21 21:41:39
  //  * @param user
  //  * @param credential
  //  */
  // public setSession( user: any, credential: any ){
  //   sessionStorage.setItem('user', JSON.stringify(user));
  //   sessionStorage.setItem('credential', JSON.stringify(credential));
  //   this._user = user;
  //   this._credential = credential;
  // }


  constructor(
    private firebaseService: FirebaseService
  ) {

    this.firebaseService.checkSessionStatus().then((user)=>{
      this.algosofisticado.next(user)
    });

  }

  public algosofisticado = new Subject<boolean>();

  router = inject(Router);

  async authLogin(email:string, password:string)
  {

    const session = await this.firebaseService.login(email, password)
    .then((aver)=>{
      return aver
    }).catch((error)=>{
      return undefined;
    });

    return session != undefined;
  }

  logout()
  {
    this.firebaseService.logout();
  }


  private handleAuthError(error: any)
  {
    this.logout();
    return of(false)
  }

}
