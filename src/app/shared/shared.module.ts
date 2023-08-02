import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DialogRemoveComponent } from './components/dialog-remove/dialog-remove.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    DialogRemoveComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PageNotFoundComponent,
    DialogRemoveComponent
  ]
})
export class SharedModule { }
