import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = 'http://your-api-url/login'; // Your API endpoint

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiURL, { username, password });
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
