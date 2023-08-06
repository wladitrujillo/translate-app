import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Locale } from '@core/model/locale';
import { ElectronService } from '@core/service/electron/electron.service';
import { ProjectService } from '@core/service/translator/project.service';

@Component({
  selector: 'app-dialog-new',
  templateUrl: './dialog-new.component.html',
  styleUrls: ['./dialog-new.component.scss']
})
export class DialogNewComponent implements OnInit {

  newForm!: FormGroup;
  //template variables
  selectedLocales: FormControl = new FormControl([]);

  locales: Locale[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService) {

  }

  ngOnInit(): void {

    this.locales = this.projectService.getAllLocales();

    this.newForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', []],
      baseLocale: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onSubmit(): void {

  }
  compareCulture(locale1: Locale, locale2: Locale): boolean {
    return locale1 && locale2 ?
      locale1.id === locale2.id : locale1 === locale2;
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.newForm.controls[controlName].hasError(errorName);
  }

}