import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  opened = false;
  title = 'LMS';
  pageTitle = 'AI Generator';
  

  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

updateRoute(route:string) {
    this.pageTitle = route === 'generator' ? 'Ask Questions': 'Book Records' ;
    this.router.navigate(['', route], {
      relativeTo: this._activatedRoute
    });
   }
  //readonly APIUrl = "http://localhost:5037/api/LMS/";

}
