import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environment.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  currentUser(): User | undefined {

    if (!this.user )
      return undefined;

    return structuredClone(this.user);

  }

  login (username: string, password: string): Observable<User>{
    // http.post('login', {username, passowrd})
    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe (
        tap( user =>  this.user = user ),
        tap( user => localStorage.setItem('token', 'asdasfASasdfasdf') ),
      );
  }

  checkAuthentication(): Observable<boolean>  {

    if( !localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
     .pipe(
      tap( user => this.user = user ),
      map( user=> !!user ),
      catchError( erro => of(false) )
     )
  }

  logout(){
    this.user = undefined;
    localStorage.clear();
  }

}
