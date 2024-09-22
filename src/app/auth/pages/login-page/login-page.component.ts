import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [
  ]
})
export class LoginPageComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private firebaseService: FirebaseService
  ){
  }

  ngOnInit(): void {
    this.init();
  }

  async init(){

    const redirectResult = await this.firebaseService.getRedirectResult();
    if (redirectResult !== null) { // Usuario se ha logueado. 
      /* Guardar información de sesión. */
      this.authService.setSession(redirectResult.user, redirectResult.credential);
      this.router.navigate(['/asignar-platillos'])
      
    }else if(this.authService.loggedInUser()){
      console.log('redireccionar, ya esta logueado.');  
      this.router.navigate(['/asignar-platillos'])
    }else{
      console.log('Requiere login');
    }

  }
    
  async clickLogin(){
    await this.firebaseService.signout()
      .then(so => { console.log(so);
      })
      .catch(error => {console.log(error);});
    await this.firebaseService.signInGoogleWithRedirect();
  }

}
