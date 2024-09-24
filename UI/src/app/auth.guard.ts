// import { CanActivateFn, Router } from '@angular/router';
// import { Injectable } from '@angular/core';
// import { AuthService } from './core/services/auth.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service'; // AuthService should have login logic

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Allow access to the route
    } else {
      this.router.navigate(['']); // Redirect to the login page
      return false; // Prevent access to the route
    }
  }
}