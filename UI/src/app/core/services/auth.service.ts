import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private loginURL = 'http://localhost:3000/api/user/login';
  private registrationURL = 'http://localhost:3000/api/user/register';
  

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginURL, { email, password });
  }

  register(username:string, email: string, password: string): Observable<any> {
    return this.http.post(this.registrationURL, { username, email, password});
  }

    // Check if the token is present in localStorage
  isLoggedIn(): boolean {
    const token = this.cookieService.get('jwt'); // true if token exists
    return !!token;
   }

  setToken(token: string): void {
    this.cookieService.set('jwt', token); // Storing JWT token in cookies
  }

  getToken(): string {
    return this.cookieService.get('jwt'); // Retrieving JWT token from cookies
  }

  logout(): void {
    this.cookieService.delete('jwt'); // Removing the token on logout
  }
}

