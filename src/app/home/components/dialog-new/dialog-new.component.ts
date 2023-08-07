import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Locale } from '@core/model/locale';
import { Project } from '@core/model/project';
import { ElectronService } from '@core/service/electron/electron.service';
import { ProjectService } from '@core/service/translator/project.service';

@Component({
  selector: 'app-dialog-new',
  templateUrl: './dialog-new.component.html',
  styleUrls: ['./dialog-new.component.scss']
})
export class DialogNewComponent implements OnInit {

  newForm!: FormGroup;


  selectedLocales: FormControl = new FormControl([], Validators.required);

  //template variables
  allLocales: Locale[] = [];
  tarjetLocales: Locale[] = [];

  //TO-DO remover only for form control folder
  wasSubmited: boolean = false;

  constructor(
    private matDialogRef: MatDialogRef<DialogNewComponent>,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private electronService: ElectronService,
    private router: Router) {

  }

  ngOnInit(): void {

    this.allLocales = this.projectService.getAllLocales();

    this.newForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', []],
      baseLocale: ['', [Validators.required]],
      folder: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmitCreateProject(): void {
    this.wasSubmited = true;
    if (this.newForm.invalid || this.selectedLocales.invalid) {
      return;
    }

    let project = {} as Project;
    project.name = this.newForm.controls['name'].value;
    project.description = this.newForm.controls['description'].value;
    project.baseLocale = this.newForm.controls['baseLocale'].value;
    project.locales = this.selectedLocales.value;
    project.locales.unshift(this.allLocales.find((locale: Locale) => locale.id == project.baseLocale) as Locale);
    this.projectService.createProject(this.newForm.controls['folder'].value, project, []);
    this.matDialogRef.close();
    this.router.navigate(['/container']);

  }

  compareCulture(locale1: Locale, locale2: Locale): boolean {
    return locale1 && locale2 ?
      locale1.id === locale2.id : locale1 === locale2;
  }

  onSelectFolder(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    this.electronService.showOpenDialogDirectory()
      .subscribe({
        next: (result) => {
          this.newForm.controls['folder'].setValue(result);
        },
        error: (error) => {
          console.error(error);
         },
      });
  }

  baseLocaleChangeAction(event: any) {
    let dropDownData = this.allLocales.filter((data: any) => data.id != event.value);
    this.tarjetLocales = dropDownData;
    this.selectedLocales.setValue([]);
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.newForm.controls[controlName].hasError(errorName)
  }

}
