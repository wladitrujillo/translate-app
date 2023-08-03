import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatorService } from 'src/app/core/service/translator/translator.service';

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
    private formBuilder: FormBuilder,
    private service: TranslatorService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [this.data?.id, [Validators.required]],
      value: [this.data?.value]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    try {
      this.service.addResource(this.form.value);
      this.dialogRef.close(true);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }


}
