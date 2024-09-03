import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  // bookForm: FormGroup;
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

    // onSubmit() {
    //   const bookData = this.bookForm.value;
    //   this.dataService.addBook(bookData).subscribe(response => {
    //     console.log('Book added:', response);
    //   });
    // }

  ngOnInit(): void {
    this.booksComponent?.matDrawer?.open();
    //payload
    // this.uploadForm = this.formBuilder.group({
    //   profile: ['']
    // });
  }

  resetForm() {
    this.bookForm.reset();
    // this.isFileDropped = false;
    // this.fileName = '';
  }

  // Method to handle form submission
  onSubmit() {
    if (this.bookForm.valid) {
      const formData = this.bookForm.value;
      
      this.http.post('http://localhost:3000/api/products/', formData).subscribe(
        res => {
          console.log('Book added successfully', res);
          this.resetForm();
          console.log(this.bookForm.value);
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
    // const file = event.currentTarget.files[0];
    // const formObj = new FormData();
    // formObj.append('file',file);

    // this.httpClient.post(this.SERVER_URL,formObj).subscribe((res:any)=>{
    //   debugger;
    // this.uploadedFileName.push(res);
    // })
  }


  // onSubmit() {
  //   const formData = new FormData();
  //   formData.append('file', this.uploadForm.get('profile')!.value);

  //   this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
  //     (res) => console.log(res),
  //     (err) => console.log(err)
  //   );
  // }

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
  //   if (files.length > 0) {
  //     const file = files[0]; // Assuming single file upload
  //     this.upload(file); // Pass the actual file to the upload function
  //     console.log("Dropped PDF file");
  // } 
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
