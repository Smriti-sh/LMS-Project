import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './components/books/books.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: 'books',
    component: BooksComponent,
    children: [{
      path: 'add',
      component: DrawerComponent
    }]
  },
  {
    path: 'generator',
    component: GeneratorComponent
  },
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
