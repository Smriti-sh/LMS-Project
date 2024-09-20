import { Component, OnInit , ElementRef,ViewChild} from '@angular/core';
import { Format } from '../../models/Format';
import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { format } from 'path';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { NameValidator } from '../  validators/name.validator';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css'
})
export class GeneratorComponent implements OnInit {

  // Use @ViewChild to get a reference to the HTML element (div) with the #textInput template variable
  @ViewChild('textInput') textInput: ElementRef<HTMLDivElement> | undefined;

  formattedAnswer: string = '';
  queryText: string = '';
  queryForm: FormGroup = new FormGroup({
    query: new FormControl('', [Validators.required, Validators.minLength(3), NameValidator.noExtraSpaces]),
    wordLimit: new FormControl('',[]),
    queNum: new FormControl('', []),
    format: new FormControl('', [])
  });
  isApiCalling = false;

  textToCopy: string = '';
  isCopied: boolean = false;

  showQue:boolean = false;
  response:any;
  formats: Format[] = [
    {
      'id': 1,
      'value': 'Paragraph'
    },
    {
      'id': 2,
      'value': 'Bullet points'
    },
    {
      'id': 3,
      'value': 'Question'
    }
  ]

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  //copying a div content
  copyText(): void {
    if (this.textInput && this.textInput.nativeElement) {
      const range = document.createRange();   // Create a range object which will define the area of the page that should be selected
      range.selectNodeContents(this.textInput.nativeElement);   // Set the range to the contents of the div (textInput.nativeElement)
      const selection = window.getSelection();   // Get the current selection object (the user's selected text in the document)

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      try {
        document.execCommand('copy');
        console.log('Text copied successfully!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }

      selection?.removeAllRanges();
    }
  }
  
  // Capitalize the first letter and the letter after every full stop followed by a space
  capitalizeText() {
    if (this.queryText) {
      this.queryText = this.queryText
      .split('. ')  //split the queryText into an array of sentences based on the delimiter '. '
      .map(sentence => {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
      })
      .join('. '); // join the sentences back with period and space
    }
  }

  ngOnInit(): void { }

  resetForm(): void {
    this.queryForm.reset();
  }

  onSubmit(): void {
    if (this.queryForm.valid) {

      const queryData = {
        ...this.queryForm.value};   // all form controls and their values are automatically included in queryData.

      this.isApiCalling = true;
    //   this.response = {
    //     "status": true,
    //     "query": "animal?",
    //     "answer": "Based on the context provided, an \"animal\" is a convenient category that we use to study organisms. It is a taxa that represents a group of living organisms with certain characteristics."
    // };

      this.http.post('http://localhost:3000/api/llm/query', queryData).subscribe(
        (res:any) => {
          if (res && res.answer) {
            this.response = res;
            this.formattedAnswer = this.response.answer.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          } else{
            this.response = {};
            this.formattedAnswer = this.response.answer.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          }
          console.log('Query entered succesfully', res);
          this.resetForm();
        },
        error => {
          console.error('Error processing query', error);
          this.toastr.error('There was an error!');
        },
        () => this.isApiCalling = false
      );
    } else {
      this.toastr.error('Form is invalid or no file selected.');
    }
  }

  onFormatChange(event:any){
    const selectedFormat = event.value;
    if (selectedFormat === "Question") {
      this.showQue =true;
    }
    else{
      this.showQue = false;
    }
  }
}

