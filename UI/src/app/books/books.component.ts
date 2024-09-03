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
// import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {

  public getJsonValue: any;
  // public postJsonValue: any;
  public displayColumn: string[]=['num','name','author','pages'];
  public dataSource: any =[];
  // public books: Table[]=[];
  // public bookForm: FormGroup;

  constructor(
    // private formBuilder: FormBuilder,
    // private dataService: DataService,
    private http: HttpClient,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,) {

    // this.bookForm = this.formBuilder.group({
    //   bookName: [''],
    //   authorName: ['']
    // });
   }

  //  onSubmit() {
  //   const bookData = this.bookForm.value;
  //   this.dataService.addBook(bookData).subscribe(response => {
  //     console.log('Book added:', response);
  //   });
  // }

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild('matDrawer', { static: true }) matDrawer?: MatDrawer;

  drawerMode: 'side' | 'over' = 'over';

  ngOnInit(): void {
    // this.dataService.getBooks().subscribe(data => {
    //   this.books = data;

      // this.getBooks();
    // });

    this.getMethod();
    // this.postMethod();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Fetching books data
  // private getBooks() {
  //   this.dataService.getBooks().subscribe(data => {
  //     this.books = data;
  //     this.dataSource = data;
  //     if (this.paginator) {
  //       this.dataSource.paginator = this.paginator;
  //     }
  //     if (this.sort) {
  //       this.dataSource.sort = this.sort;
  //     }
  //   });
  // }

  // onSubmit() {
  //   const bookData = this.bookForm.value;
  //   this.dataService.addBook(bookData).subscribe(response => {
  //     console.log('Book added:', response);
  //     this.getBooks(); // Refresh the table data
  //     this.matDrawer?.close(); // Close the drawer after submission
  //   });
  // }

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
