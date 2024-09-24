import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  opened = false;
  title = 'LMS';
  pageTitle = 'AI Generator'; 
  
  pathTitles:{[key:string]:string}={
    'login': 'Home',
    'generator': 'Ask Question',
    'books': 'Book Records'
  }

  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

updateRoute(route:string) {
  
    this.pageTitle = this.pathTitles[route];
    // this.pageTitle = route === 'generator' ? 'Ask Questions': 'Book Records' ;
    this.router.navigate(['', route], {
      relativeTo: this._activatedRoute
    });
   }

   logout():void{

    this.authService.logout();
    this.router.navigate(['']); 
    this.toastr.success('You have been logged out successfully.');
  }

}
