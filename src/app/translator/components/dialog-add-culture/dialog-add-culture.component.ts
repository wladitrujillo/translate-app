import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Locale } from 'src/app/core/model/locale';

@Component({
  selector: 'app-dialog-add-culture',
  templateUrl: './dialog-add-culture.component.html',
  styleUrls: ['./dialog-add-culture.component.scss']
})
export class DialogAddCultureComponent implements OnInit {

  locales: Locale[] =
    [{ id: 'ES-EC', name: 'Español Ecuador' },
    { id: 'ES-PA', name: 'Español Panamá' }];

  constructor(
    private dialogRef: MatDialogRef<DialogAddCultureComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
  }

  onSave() {
    this.dialogRef.close();
  }


}
