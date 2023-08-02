import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-remove',
  templateUrl: './dialog-remove.component.html',
  styleUrls: ['./dialog-remove.component.scss']
})
export class DialogRemoveComponent implements OnInit {

  textValidation: string = 'Borrar';

  text: FormControl = new FormControl();

  constructor(
    private dialogRef: MatDialogRef<DialogRemoveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onDelete() {
    this.dialogRef.close(true);
  }

}
