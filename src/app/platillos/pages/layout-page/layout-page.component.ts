import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/interfaces/user.interface';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-layout-page',
    templateUrl: './layout-page.component.html',
    styles: [],
    standalone: true,
    imports: [MatToolbarModule, NgIf, MatButtonModule, RouterOutlet]
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
    
    // this.authService.logout();
    // this.router.navigate(['/'])
  }

}
