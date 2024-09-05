import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Route } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { BooksComponent } from '../books/books.component';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormControlName,FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DndDirective } from '../dnd.directive';
import { HostListener } from '@angular/core';
// import { DataService } from '../services/data.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css'
})
export class DrawerComponent implements OnInit{

  @Output() newBookEvent = new EventEmitter<any>(); // Event emitter to send data to parent component

  opened=false;
  fileOver: boolean=false;
  fileDropped: any;
  uploadForm: FormGroup = new FormGroup('');
  SERVER_URL = "http://localhost:3000/api/ ";
  userDetails:any;
  attachment:any;
  isApiCalling: boolean = false;
  uploadedFileName:string[]=[];
  
  fontSize: number = 14;
  fileName = '';
  bookName: FormControl = new FormControl('');
  authorName: FormControl = new FormControl('');
  //  Make create button disable until the book is not uloaded successfully @jatin-sharam
  isCreating: boolean = false;
  isFileDropped: boolean=false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    // private dataService : DataService,
    private http: HttpClient,
    private booksComponent: BooksComponent,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef){}

     // Group the form controls into a FormGroup
  bookForm: FormGroup = new FormGroup({
    bookName: this.bookName,
    authorName: this.authorName,
  });

  ngOnInit(): void {
    this.booksComponent?.matDrawer?.open();
  }

  resetForm() {
    this.bookForm.reset();
  }

  // Method to handle form submission
  onSubmit() {
    if (this.bookForm.valid) {
      const formData = this.bookForm.value;
      console.log(formData);
      if (!formData.bookName || !formData.authorName) {
        alert('Please enter Book and Author name.')
      }
      
      this.http.post('http://localhost:3000/api/products/', formData).subscribe(
        res => {
          console.log('Book added successfully', res);
          this.resetForm();
          console.log(this.bookForm.value);   
          this.newBookEvent.emit(res);
          this.closeDrawer();       
        },
        error => {
          console.error('There was an error!', error);
        }
      )} else {
      console.error('Form is invalid');
    }
  }

  closeDrawer(): Promise<MatDrawerToggleResult> | any {
    this.router.navigate(['../'], {
      relativeTo: this._activatedRoute
    })
    return this.booksComponent?.matDrawer?.close();
  }

  onFileSelect(event:any) {
    console.log('1');
    
    if (event.target.files.length > 0) {
      console.log('2');
      const file = event.target.files[0];
      this.uploadForm.get('profile')!.setValue(file);
      this.fileName = file.name; 
      this.isFileDropped = true;
      console.log('3');
    }
  }

  uploadFile(event:any){
    debugger;

  }

  files: any[]=[];

  upload(pdfFile: File) {
    const formData = new FormData();
    // Append the PDF file to the form data
    formData.append('pdfFile', pdfFile);
    console.log(pdfFile, "pdfFile pdfFile");
  }

  onFileDrop(event: any): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    
    if (file.type === 'application/pdf') {
      this.isFileDropped = true; // hide drop div and show name div
      this.fileName = file.name; 
      console.log("PDF file dropped:", file);
    } else {
      alert('Please drop a PDF file.');
    }
  }
}

// Event handler for drag over
onDragOver(event: any): void {
  event.preventDefault();
    const fileDropELement = document.getElementById('fileDrop');
    if (fileDropELement) {
        // fileDropELement.style.backgroundColor = 'black';
        console.log("drag over");
        let name = document.getElementById('fileDrop') as HTMLElement;
        name?.style.setProperty('background-color', 'grey')
    }
}

// Event handler for drag leave
onDragLeave(event: any): void {
    event.preventDefault();
    const fileDropELement = document.getElementById('fileDrop');
    if (fileDropELement) {
        // fileDropELement.style.backgroundColor = '';
        console.log("Drag leave");
        let name = document.getElementById('fileDrop') as HTMLElement;
        name?.style.setProperty('background-color', '#131c2b')
    }
}

ngOnDestroy(): void {
  this.closeDrawer();
}
}
