import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Locale } from 'src/app/core/model/locale';
import { TranslatorService } from 'src/app/core/service/translator/translator.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {

  panelOpenState = false;
  fileFormat: FormControl = new FormControl('sql');
  selectedLocales: FormControl = new FormControl([]);

  locales: Locale[] = [];

  constructor(private service: TranslatorService) { }

  ngOnInit(): void {
    this.locales = this.service.getLocales();
  }

  generate() {
  
      let locales: Locale[] = this.selectedLocales.value;
  
      if (locales.length == 0) {
        alert('Debe seleccionar al menos una cultura');
        return;
      }
  
      let fileFormat: string = this.fileFormat.value;
  
      if (fileFormat == 'sql') {
        this.service.exportToSql(locales);
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
