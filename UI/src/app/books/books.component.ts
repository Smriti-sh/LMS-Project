import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Table } from '../../models/Table';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Enable OnPush strategy for better performance
})
export class BooksComponent implements OnInit, OnDestroy {

  displayColumn: string[] = ['num', 'bookName', 'authorName', 'pages'];
  dataSource: Table[] = [];

  private unsubscribe$ = new Subject<void>(); // To manage unsubscriptions

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild('matDrawer', { static: true }) matDrawer?: MatDrawer;

  drawerMode: 'side' | 'over' = 'over';

  constructor(
    private http: HttpClient,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getMethod();
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // Method to update books list from another component
  updateBooksList(newBook: Table): void {
    this.dataSource = [...this.dataSource, newBook]; // Use immutability for change detection to work properly
    this.changeDetectorRef.markForCheck(); // Mark for check in case of OnPush strategy
  }

  public getMethod(): void {
    this.http.get<Table[]>('http://localhost:3000/api/products/')
      .pipe(takeUntil(this.unsubscribe$)) // Unsubscribe on component destruction
      .subscribe(data => {
        this.dataSource = data;
        this.changeDetectorRef.markForCheck(); // Mark for change detection
      });
  }

  openDrawer(): void {
    this.router.navigate(['./add'], {
      relativeTo: this.activatedRoute,
    });
    this.matDrawer?.open();
    this.changeDetectorRef.markForCheck(); // Ensure the view is updated
  }

}
