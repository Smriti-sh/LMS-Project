import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWQ3MzRjNmJlZjJmMmJmZjBmZDIwYyIsImlhdCI6MTcyNjgzNzU4MCwiZXhwIjoxNzI2ODQxMTgwfQ.oya9fWXx1-zXgGGSrTOU_LO3c0kHi48jQe8vS6hgNB0';
    this.loaderService.show();  // Show loader when API call starts
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      finalize(() => this.loaderService.hide())  // Hide loader after response is received
    );
  }
}
