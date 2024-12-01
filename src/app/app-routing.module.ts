import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InputComponent } from './input/input.component';
import { ToDoComponent } from './to-do/to-do.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  {
    component:HomeComponent, path: ''
  },
  {
    component: ContactComponent, path:'contact'
  },
  {
    component:ToDoComponent, path:'to-do'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
