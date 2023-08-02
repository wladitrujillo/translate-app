import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-resource',
  templateUrl: './dialog-add-resource.component.html',
  styleUrls: ['./dialog-add-resource.component.scss']
})
export class DialogAddResourceComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogAddResourceComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [this.data?.id, [Validators.required]],
      value: [this.data?.value]
    });
  }

  onSubmit() {
    this.dialogRef.close();
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }


}
