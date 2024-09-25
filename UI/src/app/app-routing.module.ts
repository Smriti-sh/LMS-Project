import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './components/books/books.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'books',component: BooksComponent,  canActivate: [AuthGuard],
    children: [{path: 'add',component: DrawerComponent
    }]
  },
  {
    path: 'generator',component: GeneratorComponent, canActivate: [AuthGuard] },
  {
    path: '',component: LoginComponent
  },
  {
    path: 'login', pathMatch: 'full', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
