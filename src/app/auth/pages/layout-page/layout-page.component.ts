import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [
  ]
})
export class LayoutPageComponent {


  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  get user(): User | undefined {
    return ;
    //return this.authService.currentUser();
  }

  onLogout(){
    /* this.authService.logout();
    this.router.navigate(['/']) */
  }

}
