import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { OAuthCredential, UserInfo } from 'firebase/auth';
import { User as FBUser } from 'src/app/auth/interfaces/user.interface';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environment.baseUrl;
  private user?: UserInfo;
  private _user: FBUser | null;
  private _credential: OAuthCredential | null;

  constructor(private http: HttpClient) { 

    // Load session 
    const __u = sessionStorage.getItem('user');
    const __c = sessionStorage.getItem('credential');

    if (__u === null || __c === null) {
      this._user = null;
      this._credential = null;
    }else{
      this._user = JSON.parse(__u);
      this._credential = JSON.parse(__c);
    }
  }

  /**
   * Establece información de una nueva sesión de usuario. 
   * 
   * @author JHSS 2024-09-21 21:41:39
   * @param user 
   * @param credential 
   */
  public setSession( user: any, credential: any ){
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('credential', JSON.stringify(credential));
    this._user = user;
    this._credential = credential;
  }

  /**
   * Indica si hay sesión de usuario. 
   * 
   * @author JHSS 2024-09-21 21:46:48
   * @returns 
   */
  public loggedInUser():boolean{
    return this._user !== null;
  }


  // currentUser(): User | undefined {

  //   if (!this.user )
  //     return undefined;

  //   return structuredClone(this.user);

  // }

  // login (username: string, password: string): Observable<User>{
  //   // http.post('login', {username, passowrd})
  //   return this.http.get<User>(`${this.baseUrl}/users/1`)
  //     .pipe (
  //       tap( user =>  this.user = user ),
  //       tap( user => localStorage.setItem('token', 'asdasfASasdfasdf') ),
  //     );
  // }

  // checkAuthentication(): Observable<boolean>  {

  //   if( !localStorage.getItem('token')) return of(false);

  //   const token = localStorage.getItem('token');

  //   return this.http.get<User>(`${this.baseUrl}/users/1`)
  //    .pipe(
  //     tap( user => this.user = user ),
  //     map( user=> !!user ),
  //     catchError( erro => of(false) )
  //    )
  // }

  // logout(){
  //   this.user = undefined;
  //   localStorage.clear();
  // }

}
