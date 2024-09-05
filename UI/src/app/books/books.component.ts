import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { error } from 'console';
import { Table } from '../../models/Table';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {

  public getJsonValue: any;
  public displayColumn: string[]=['num','bookName','authorName','pages'];
  public dataSource: any =[];

    // Method to update books list from another component
    updateBooksList(newBook: any) {
      this.dataSource.push(newBook);
    }
  
  constructor(
    private http: HttpClient,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,) {

   }

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild('matDrawer', { static: true }) matDrawer?: MatDrawer;

  drawerMode: 'side' | 'over' = 'over';

  ngOnInit(): void {

    this.getMethod();
    // this.postMethod();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public getMethod() {
    this.http.get('http://localhost:3000/api/products/').subscribe((data) => {
      console.log(data);
      this.getJsonValue = data;
      this.dataSource = data;
    });
  }

  openDrawer(): void {
    this._router.navigate(['./add'], {
      relativeTo: this._activatedRoute,
    });
    // Mark for check
    this._changeDetectorRef.markForCheck();

    this.matDrawer?.open();
  }

}