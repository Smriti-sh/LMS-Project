import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { DndDirective } from './shared/directives/dnd.directive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DataService } from './services/data.service';
import { UsersDataSource } from './services/Users.dataSource';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { LoaderComponent, SharedModule } from './shared';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import {
  LoginComponent,
  GeneratorComponent,
  BooksComponent,
  DrawerComponent,
} from './components';

@NgModule({
  //metadata for the module

  //array of components, directives, and pipes
  declarations: [
    DndDirective,
    AppComponent,
    BooksComponent,
    GeneratorComponent,
    DrawerComponent,
    LoaderComponent,
    LoginComponent,
  ],

  // array contains modules that your module is dependent on
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule
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
  bootstrap: [AppComponent],
})
export class AppModule {}
