
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private checkAuthStatus() : boolean | Observable<boolean> {
    return true;
    /* return this.authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => {
          if( !isAuthenticated ) this.router.navigate(['./auth/login'])
        })
      ) */

  }


  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean >  {
    return this.checkAuthStatus();
    // console.log('can match')
    // console.log({route, segments})

    // return true;
    // throw new Error('Method not implemented.');
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean > {

    return this.checkAuthStatus();
    // console.log('can activate')
    // console.log({route, state})

    // return true;

    // throw new Error('Method not implemented.');
  }

}
