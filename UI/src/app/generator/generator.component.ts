import { Component, OnInit , ElementRef,ViewChild} from '@angular/core';
import { Format } from '../../models/Format';
// import { Route } from '@angular/router';
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

  queryText: string = '';
  queryForm: FormGroup = new FormGroup({
    query: new FormControl('', [Validators.required, Validators.minLength(3), NameValidator.noExtraSpaces]),
    queNum: new FormControl('', []),
    bookName: new FormControl('', []),
    answerFormat: new FormControl('', []),
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
      'value': 'Bullets'
    },
    {
      'id': 3,
      'value': 'Questions'
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
        // trim leading/trailing spaces and capitalize the first letter of each sentence
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
      this.response = {
        "status": true,
        "query": "animal?",
        "answer": "Based on the context provided, an \"animal\" is a convenient category that we use to study organisms. It is a taxa that represents a group of living organisms with certain characteristics."
    };

  //   {
  //     "status": true,
  //     "query": "Generate 5 multiple choice questions on different uses of light and mention the correct answer and complexity of the question",
  //     "answer": "1. What is a common source of light that can be used for activities with mirrors and reflections?\n   A) Laser torch\n   B) Colored glass pieces\n   C) Sunlight\n   D) Candle\n   Correct Answer: C) Sunlight\n   Complexity: Easy\n\n2. Which feature of an image formed by a plane mirror allows it to be obtained on a screen?\n   A) Erect image\n   B) Upside down image\n   C) Same size as the object\n   D) Image distance same as object distance\n   Correct Answer: D) Image distance same as object distance\n   Complexity: Medium\n\n3. Why was Gurmit advised not to use a laser torch for Activity 16.8?\n   A) Laser torches are too expensive\n   B) Laser torches are not effective in forming reflections\n   C) Lasers can be harmful to the eyes\n   D) Gurmit did not have access to a laser torch\n   Correct Answer: C) Lasers can be harmful to the eyes\n   Complexity: Hard\n\n4. How many images of a candle will be formed if it is placed between two parallel plane mirrors separated by 40 cm?\n   A) One image\n   B) Two images\n   C) Three images\n   D) Four images\n   Correct Answer: B) Two images\n   Complexity: Medium\n\n5. Which of the following surfaces will result in regular reflection when a beam of light strikes it?\n   A) Chalk powder\n   B) Cardboard surface\n   C) Marble floor with water spread over it\n   D) Polished wooden table\n   Correct Answer: D) Polished wooden table\n   Complexity: Easy"
  // }
  //     this.http.post('http://localhost:3000/api/llm/query', queryData).subscribe(
  //       (res:any) => {
  //         if (res && res.answer) {
  //           this.response = res;
  //         } else{
  //           this.response = {};
  //         }
  //         console.log('Query entered succesfully', res);
  //         this.resetForm();
  //       },
  //       error => {
  //         console.error('Error processing query', error);
  //         this.toastr.error('There was an error!');
  //       },
  //       () => this.isApiCalling = false
  //     );
  //   } else {
  //     this.toastr.error('Form is invalid or no file selected.');
    }
  }

  onFormatChange(event:any){
    const selectedFormat = event.value;
    if (selectedFormat === "Questions") {
      this.showQue =true;
    }
    else{
      this.showQue = false;
    }
  }
}

