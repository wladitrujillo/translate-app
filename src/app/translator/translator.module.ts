import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './components/container/container.component';
import { EditorComponent } from './components/editor/editor.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { SharedModule } from '../shared/shared.module';
import { TranslatorRoutingModule } from './translator.routing';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogAddCultureComponent } from './components/dialog-add-culture/dialog-add-culture.component';
import { DialogAddResourceComponent } from './components/dialog-add-resource/dialog-add-resource.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CoreModule } from '../core/core.module';
import { DialogProcessFileComponent } from './components/dialog-process-file/dialog-process-file.component';



@NgModule({
  declarations: [
    ContainerComponent,
    EditorComponent,
    UploaderComponent,
    GeneratorComponent,
    DialogAddCultureComponent,
    DialogAddResourceComponent,
    SettingsComponent,
    DialogProcessFileComponent
  ],
  imports: [
    CommonModule,
    TranslatorRoutingModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class TranslatorModule { }
