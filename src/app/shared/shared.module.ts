import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DialogConfirmRemoveComponent } from './components/dialog-confirm-remove/dialog-confirm-remove.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    DialogConfirmRemoveComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PageNotFoundComponent,
    DialogConfirmRemoveComponent
  ]
})
export class SharedModule { }
