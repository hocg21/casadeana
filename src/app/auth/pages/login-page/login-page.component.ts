import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [
  ],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,  ReactiveFormsModule ],
})
export class LoginPageComponent implements OnInit, OnDestroy{


  authservice = inject(AuthService);

  private aver?:Subscription;
  ngOnDestroy(): void {
    if(this.aver)
      this.aver.unsubscribe();
  }

  ngOnInit(): void
  {
    this.aver = this.authservice.algosofisticado.subscribe((session)=>{

      if(session){
        this.router.navigate(['/asignar-platillos'])
      }
    })

  }

  hide = signal(true);

  showPass(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.preventDefault();
    event.stopPropagation();
  }


  router = inject(Router)

  formbuiler = inject(FormBuilder);
  hasError = signal(false);

  loginForm = this.formbuiler.group({
    email: ['', [Validators.required, Validators.email], ],
    password: ['', [Validators.required]]
  });

  onSubmit(){

    let {email = '', password = ''} = this.loginForm.value;

    this.authservice.authLogin(email!, password!).then((isauthenticated)=>{

      if(isauthenticated)
      {
        this.router.navigate(['/asignar-platillos'])
      }
      else{
        alert('Error al iniciar sesion')
      }

    })

  }

}
