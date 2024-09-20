import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class BookService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http, 'products'); // Pass the specific model route for books
  }

  getBooks(skip: number = 0, limit: number = 10) {
    return this.get(`list?limit=${limit}&skip=${skip}`);
  }
}
