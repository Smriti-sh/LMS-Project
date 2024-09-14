import { Component, OnInit } from '@angular/core';
import { Format } from '../../models/Format';
// import { Route } from '@angular/router';
import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css'
})
export class GeneratorComponent implements OnInit{

queryForm: FormGroup = new FormGroup({
    query: new FormControl('', [Validators.required]),
    // num: new FormControl('', [Validators.required]),
    // bookName: new FormControl('', [Validators.required]),
  });
  isApiCalling = false;


  formats: Format[]=[
    {
      'id':1,
      'value':'Paragraph'
    },
    {
      'id':2,
      'value':'Bullets'
    }
  ]

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {}

  resetForm(): void {
    this.queryForm.reset();
  }

  onSubmit(): void {
    if (this.queryForm.valid) {
      const queryData = new FormData();
      queryData.append('query', this.queryForm.get('query')?.value);
      // queryData.append('queNum', this.queryForm.get('num')?.value);
      // queyData.append('bookName', this.queryForm.get('bookName')?.value);
      this.isApiCalling = true;
      this.http.post('http://localhost:3000/api/llm/query', queryData).subscribe(
        res => {
          console.log('Query entered succesfully', res);
          this.resetForm();
        },
        error => {
          console.error('Error processing query', error);
          this.toastr.error('There was an error!');
        },
        () => this.isApiCalling = false
      );
     }else {
      this.toastr.error('Form is invalid or no file selected.');
    }
}

}

