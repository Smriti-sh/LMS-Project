import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator,MatPaginatorModule,PageEvent } from '@angular/material/paginator';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Table } from '../../core/models/Table';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Enable OnPush strategy for better performance
})
export class BooksComponent implements OnInit,AfterViewInit, OnDestroy {

  displayColumn: string[] = ['num', 'bookName', 'authorName', 'pages'];
  dataSource = new MatTableDataSource<Table>([]);

  page: number = 0;
  limit:number =10;
  skip: number = 0;
  // sortNum: string = 'asc';

  private unsubscribe$ = new Subject<void>();   // To manage unsubscriptions

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild('matDrawer', { static: true }) matDrawer?: MatDrawer;

  isDataAvailable:boolean=false;
  drawerMode: 'side' | 'over' = 'over';

  constructor(
    private http: HttpClient,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getMethod();
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  //Placeholder method that logs pagination events when triggered (e.g., when the user clicks "Next" or "Previous"). This is where logic for handling pagination events can be implemented.
  public handlePageEvent(event: any){
    console.log(event, "event", this.paginator );
    const {pageSize, pageIndex,}=event;
    this.limit = pageSize;
    this.page = pageIndex;
    this.skip = (this.page*this.limit);
    this.getMethod();
  }

  getMethod = async () => {
    try {
      const resp = await this.bookService.getBooks(this.skip, this.limit).toPromise();
      if (resp && resp.totalCount) {
        this.dataSource = resp.products;
        this.isDataAvailable = true;
        setTimeout(() => {
          if (this.paginator) {
            this.paginator.length = resp.totalCount;
            this.dataSource.paginator = this.paginator;
          }
          this.changeDetectorRef.markForCheck(); // Mark for change detection
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  openDrawer(): void {
    this.router.navigate(['./add'], {
      relativeTo: this.activatedRoute,
    });
    this.matDrawer?.open();
    this.changeDetectorRef.markForCheck(); // Ensure the view is updated
  }

}
