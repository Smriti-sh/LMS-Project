import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table } from '../core/models/Table';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  // addBook(book: Table): Observable<Table> {
  //   return this.http.post<Table>(this.apiUrl, book);
  // }

  getBooks(): Observable<Table[]> {
    return this.http.get<Table[]>('http://localhost:3000/api/products');
  }
}



