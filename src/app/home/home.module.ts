import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from '../material/material.module';
import { DialogNewComponent } from './components/dialog-new/dialog-new.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home.routing';

@NgModule({
  declarations: [
    HomeComponent,
    DialogNewComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
