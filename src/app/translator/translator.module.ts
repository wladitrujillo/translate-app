import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { EditorComponent } from './components/editor/editor.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { ConverterComponent } from './components/converter/converter.component';
import { SharedModule } from '../shared/shared.module';
import { TranslatorRoutingModule } from './translator.routing.module';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    HomeComponent,
    EditorComponent,
    UploaderComponent,
    ConverterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    TranslatorRoutingModule
  ],
  exports: [
    HomeComponent,
    EditorComponent,
    UploaderComponent,
    ConverterComponent
  ]
})
export class TranslatorModule { }
