import { Injectable } from '@angular/core';
import { Table } from '../core/models/Table';
import { DataSource } from '@angular/cdk/collections';  // meant to serve as a place to encapsulate any sorting, filtering, pagination, and data retrieval logic specific to the application.
import { BehaviorSubject, Observable } from 'rxjs';
import { connect } from 'http2';
import { of } from 'rxjs';
import { DataService } from './data.service';
import { AuthService } from '../core/services/auth.service';
// import { FormGroup,FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class UsersDataSource extends DataSource<Table> {

  users$ = new BehaviorSubject<Table[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);
  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private dataService: DataService, private authService: AuthService){
    super();

    this.setLoggedIn(this.authService.isLoggedIn());
  }


  connect():Observable<Table[]>{
    return this.users$.asObservable();
  }

  disconnect(): void{
    this.users$.complete();
  }

  loadUsers():void{
    this.isLoading$.next(true);
    this.dataService.getBooks().subscribe((users)=>{
      this.users$.next(users);
      this.isLoading$.next(false);
    });
  }

  setLoggedIn(value:boolean){
    this.isLoggedIn.next(value);
  }

  getLoggedIn(){
    return this.isLoggedIn;
  }
}
