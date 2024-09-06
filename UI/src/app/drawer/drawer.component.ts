import { ChangeDetectorRef, Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BooksComponent } from '../books/books.component';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit, OnDestroy {

  @Output() newBookEvent = new EventEmitter<any>();

  opened = false;
  attachment: File | null = null;
  isFileDropped = false;
  fileName = '';
  isApiCalling = false;

  bookForm: FormGroup = new FormGroup({
    bookName: new FormControl('', [Validators.required]),
    authorName: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private http: HttpClient,
    private booksComponent: BooksComponent,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.booksComponent?.matDrawer?.open();
  }

  resetForm(): void {
    this.bookForm.reset();
    this.attachment = null;
    this.isFileDropped = false;
  }

  onSubmit(): void {
    if (this.bookForm.valid && this.attachment) {
      const formData = new FormData();
      formData.append('bookName', this.bookForm.get('bookName')?.value);
      formData.append('authorName', this.bookForm.get('authorName')?.value);
      formData.append('pdf', this.attachment, this.attachment.name);

      this.isApiCalling = true;
      this.http.post('http://localhost:3000/api/products/upload', formData).subscribe(
        res => {
          console.log('Book added successfully', res);
          this.resetForm();
          this.newBookEvent.emit(res);
          this.closeDrawer();
        },
        error => {
          console.error('Error adding book:', error);
          this.toastr.error('There was an error!');
        },
        () => this.isApiCalling = false
      );
    } else {
      this.toastr.error('Form is invalid or no file selected.');
    }
  }

  closeDrawer(): Promise<MatDrawerToggleResult> | void {
    this.newBookEvent.emit({book: 'LMS'});
    this.router.navigate(['../'], {
      relativeTo: this._activatedRoute
    });
    return this.booksComponent?.matDrawer?.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]?.type === 'application/pdf') {
      this.attachment = input.files[0];
      this.fileName = this.attachment.name;
      this.isFileDropped = true;
    } else {
      this.toastr.error('Please select a valid PDF file.');
      this.attachment = null;
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0 && files[0].type === 'application/pdf') {
      this.attachment = files[0];
      this.fileName = this.attachment.name;
      this.isFileDropped = true;
      console.log('PDF file dropped:', files[0]);
    } else {
      this.toastr.error('Please drop a valid PDF file.');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const fileDropElement = document.getElementById('fileDrop');
    if (fileDropElement) {
      fileDropElement.style.backgroundColor = 'grey';
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    const fileDropElement = document.getElementById('fileDrop');
    if (fileDropElement) {
      fileDropElement.style.backgroundColor = '#131c2b';
    }
  }

  ngOnDestroy(): void {
    this.closeDrawer();
  }
}
