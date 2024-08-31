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

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css'
})
export class DrawerComponent implements OnInit{
  opened=false;
  fileOver: boolean=false;
  fileDropped: any;
  upload: any;
  uploadForm: FormGroup = new FormGroup('');
  SERVER_URL = "http://localhost:3000/api/upload";

  constructor(private router: Router, private formBuilder: FormBuilder, private httpClient: HttpClient){}

  //payload
  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  onFileSelect(evt:any) {
    if (evt.target.files.length > 0) {
      const file = evt.target.files[0];
      this.uploadForm.get('profile')!.setValue(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile')!.value);

    this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  files: any[]=[];
  authorName: FormControl = new FormControl('');
  bookName: FormControl = new FormControl('');


  // onFileDropped($event:any){
  //   for(const item of $event) {
  //     this.files.push(item);
  //   }
  // }

  //  //Dragover
  //  @HostListener('dragover',['$event']) public onDragOver(evt:any){
  //   evt.preventDefault();
  //   evt.stopPropagation();
  //   console.log('Drag over');
    
  // }

  // //Dragleave
  // @HostListener('dragleave', ['$event']) public onDragLeave(evt:any){
  //   evt.preventDefault();
  //   evt.stopPropagation();
  //   console.log('Drag leave');
  // }

  // //drop
  // @HostListener('drop', ['$event']) public ondrop(evt:any){
  //   evt.preventDefault();
  //   evt.stopPropagation();
  //   this.fileOver = false;
  //   const files = evt.dataTransfer.files;
  //   if (files.length > 0) {
  //     this.fileDropped.emit(files);
  //     //do some stuff here
  //     console.log(`You Dropped ${files.length} files.`);
  //   }
  // }

onFileDrop(event: any): void {
    event.preventDefault();
    const files = event.dataTransfer.files;
    this.upload(files);
    console.log("dropped");
    
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

}