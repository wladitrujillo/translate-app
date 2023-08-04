import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProjectService } from '@core/service/translator/project.service';
import { Locale } from 'src/app/core/model/locale';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {

  panelOpenState = false;
  fileFormat: FormControl = new FormControl('mysql');
  selectedLocales: FormControl = new FormControl([]);

  locales: Locale[] = [];

  formats: { value: string, description: string }[] = [];

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.locales = this.projectService.getLocales();
    this.formats = [
      { value: 'mysql', description: 'MySQL (.sql)' },
      { value: 'sqlserver', description: 'SQL Server (.sql)' },
      { value: 'json', description: 'Json (.json)' },
    ]
  }

  generate() {

    let locales: Locale[] = this.selectedLocales.value;

    if (locales.length == 0) {
      alert('Debe seleccionar al menos una cultura');
      return;
    }

    let fileFormat: string = this.fileFormat.value;

    if (fileFormat == 'sql') {
      // this.service.exportToSql(locales);
    } else if (fileFormat == 'json') {
      // this.service.exportToJson(locales);
    } else if (fileFormat == 'xml') {
      // this.service.exportToXml(locales);
    } else if (fileFormat == 'csv') {
      // this.service.exportToCsv(locales);
    }
  }

  compareLocales(locale1: Locale, locale2: Locale): boolean {
    return locale1 && locale2 ?
      locale1.id === locale2.id : locale1 === locale2;
  }
}
