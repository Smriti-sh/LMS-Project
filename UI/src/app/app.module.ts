import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { DndDirective } from './dnd.directive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';
import { BooksComponent } from './books/books.component';
import { GeneratorComponent } from './generator/generator.component';
import { MatTableModule } from '@angular/material/table';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { Table } from '../models/Table';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DataService } from './services/data.service';
import { UsersDataSource } from './services/Users.dataSource';
import { DrawerComponent } from './drawer/drawer.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ReactiveFormsModule } from '@angular/forms';
import { format } from 'path';
import { ApiInterceptor } from './api.interceptor';
import { LoaderComponent } from './loader/loader.component';
import { LoginComponent } from './login/login.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@NgModule({   //metadata for the module

  //array of components, directives, and pipes
  declarations: [
    DndDirective,
    AppComponent,
    BooksComponent,
    GeneratorComponent,
    DrawerComponent,
    LoaderComponent,
    LoginComponent
  ],

  // array contains modules that your module is dependent on
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatGridListModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    BrowserAnimationsModule,
    SharedModule,
    MatTableModule,
    HttpClientModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    UsersDataSource,
    DataService,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
