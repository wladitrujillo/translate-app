import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Locale } from 'src/app/core/model/locale';
import { ElectronService } from 'src/app/core/service/electron/electron.service';

@Component({
  selector: 'app-dialog-add-culture',
  templateUrl: './dialog-add-culture.component.html',
  styleUrls: ['./dialog-add-culture.component.scss']
})
export class DialogAddCultureComponent implements OnInit {

  availableLocales: Locale[] = [];

  selectedLocale: FormControl = new FormControl();

  constructor(
    private dialogRef: MatDialogRef<DialogAddCultureComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private service: ElectronService) { }

  ngOnInit(): void {
    let selectedLocales = this.data.locales;
    let allLocales = this.getAllLocales();
    this.availableLocales =
      this.getAvailableLocales(allLocales, selectedLocales);
  }

  onSubmit(locale:Locale) {
    this.service.addLocale(locale);
    this.dialogRef.close();
  }

  getAllLocales(): Locale[] {
    return this.service.getAllLocales();
  }

  getAvailableLocales(allLocales: Locale[], selectedLocales: Locale[]): Locale[] {
    return allLocales
      .filter((locale: Locale) => {
        return !selectedLocales.some((l: Locale) => l.id == locale.id);
      });
  }


}
