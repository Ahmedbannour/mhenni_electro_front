import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})


export class Navbar {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}


    onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
