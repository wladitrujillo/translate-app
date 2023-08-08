import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Locale } from '@core/model/locale';

@Component({
  selector: 'app-dialog-process-file',
  templateUrl: './dialog-process-file.component.html',
  styleUrls: ['./dialog-process-file.component.scss']
})
export class DialogProcessFileComponent implements OnInit {

  locales: Locale[] = [];
  values: string[] = [];

  rowKeys: any[] = [
    { code: 'key', description: "Clave Principal" },
    { code: 'value', description: "Traducción" },
  ];

  selectedLocale: FormControl = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit(): void {
    this.locales = this.data.locales;
    this.values = this.data.row.split(',');
  }


}
