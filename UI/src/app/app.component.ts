import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UsersDataSource } from './services/Users.dataSource';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  opened = false;
  title = 'LMS';
  pageTitle = 'AI Generator';
  isLoggedIn:boolean = false;

  pathTitles:{[key:string]:string}={
    'login': 'Home',
    'generator': 'Ask Question',
    'books': 'Book Records'
  }

  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService,
    private $UsersDataSource: UsersDataSource
  ) {
    this.$UsersDataSource.getLoggedIn().subscribe(val=>{
      console.log(val);
      this.isLoggedIn = val;
    })
  }

  updateRoute(route: string) {

    if (((route === 'generator' || route === 'books') && this.authService.isLoggedIn()) || (route === 'login' && !this.authService.isLoggedIn())) {
      this.pageTitle = this.pathTitles[route];
      // this.pageTitle = route === 'generator' ? 'Ask Questions': 'Book Records' ;
      this.router.navigate(['', route], {
        relativeTo: this._activatedRoute
      });
    }
   }

   logout():void{
    this.authService.logout();
    this.isLoggedIn=false;
    this.router.navigate(['']);
    this.toastr.success('You have been logged out successfully.');
    }

}
