import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './components/container/container.component';
import { EditorComponent } from './components/editor/editor.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { SharedModule } from '../shared/shared.module';
import { TranslatorRoutingModule } from './translator.routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogAddCultureComponent } from './components/dialog-add-culture/dialog-add-culture.component';
import { DialogAddResourceComponent } from './components/dialog-add-resource/dialog-add-resource.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [
    ContainerComponent,
    EditorComponent,
    UploaderComponent,
    GeneratorComponent,
    DialogAddCultureComponent,
    DialogAddResourceComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    TranslatorRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class TranslatorModule { }
