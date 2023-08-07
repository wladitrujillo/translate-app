import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Project } from '@core/model/project';
import { GeneratorService } from '@core/service/electron/generator.service';
import { ProjectService } from '@core/service/translator/project.service';
import { NotificationService } from '@shared/service/notification.service';
import { Locale } from 'src/app/core/model/locale';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {

  panelOpenState = false;
  fileFormat: FormControl = new FormControl('mysql');
  selectedLocales: FormControl = new FormControl([]);

  locales: Locale[] = [];

  project!: Project;

  formats: { value: string, description: string }[] = [];

  constructor(
    private projectService: ProjectService,
    private generator: GeneratorService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.project = this.projectService.getProject();
    this.locales = this.project.locales;
    this.formats = [
      { value: 'mysql', description: 'MySQL (.sql)' },
      { value: 'sqlserver', description: 'SQL Server (.sql)' },
      { value: 'json', description: 'Json (.json)' },
    ]
  }

  generate() {

    let locales: Locale[] = this.selectedLocales.value;
    if (locales.length == 0) {
      this.notification.warning('Debe seleccionar al menos una cultura');
      return;
    }

    let fileFormat: string = this.fileFormat.value;

    if (fileFormat == 'mysql') {
      this.generator.exportToMySql(locales, { id: this.project?.baseLocale || '', name: '' });
      this.notification.success('Se ha generado los scripts SQL');
    } else if (fileFormat == 'sqlserver') {
      this.notification.success('Se ha generado los scripts SQL');
      this.generator.exportToSqlServer(locales, { id: this.project?.baseLocale || '', name: '' });
    } else if (fileFormat == 'json') {
      this.generator.exportToJson(locales);
      this.notification.success('Se ha generado los archivos JSON');
    }
  }

  compareLocales(locale1: Locale, locale2: Locale): boolean {
    return locale1 && locale2 ?
      locale1.id === locale2.id : locale1 === locale2;
  }

  isAllLocalesChecked(): boolean {
    return this.selectedLocales.value?.length === this.locales.length;
  }

  isAllLocalesIndeterminate(): boolean {
    return this.selectedLocales.value?.length > 0 && this.selectedLocales.value?.length < this.locales.length;
  }

  allLocalesSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.selectedLocales.setValue(this.locales);
    } else {
      this.selectedLocales.setValue([]);
    }
  }
}
