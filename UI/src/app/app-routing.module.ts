import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { GeneratorComponent } from './generator/generator.component';
import { DrawerComponent } from './drawer/drawer.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
