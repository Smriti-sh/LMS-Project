import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Import environment for base URL

export class BaseApiService {
  protected baseUrl: string;

  constructor(protected http: HttpClient, private model: string) {
    this.baseUrl = `${environment.apiBaseUrl}/${model}`; // Construct the full URL using base URL and model
  }

  // GET: Fetch data from a specific route
  get(route: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${route}`);
  }

  // GET: Fetch all items (or a specific resource if no route is provided)
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // POST: Add data to a specific route
  post(route: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${route}`, data);
  }

  // PUT: Update a resource at a specific route
  put(route: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${route}`, data);
  }

  // DELETE: Remove a resource from a specific route
  delete(route: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${route}`);
  }
}
