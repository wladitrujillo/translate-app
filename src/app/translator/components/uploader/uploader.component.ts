import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Locale } from '@core/model/locale';
import { RowFileModel } from '@core/model/row-file-model';
import { UploaderService } from '@core/service/electron/uploader.service';
import { DialogProcessFileComponent } from '../dialog-process-file/dialog-process-file.component';
import { ProjectService } from '@core/service/translator/project.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  locales: Locale[] = [];

  constructor(
    private uploader: UploaderService,
    private dialog: MatDialog,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.locales = this.projectService.getProject()?.locales || [];
  }

  onFileSelected(event: any) {
    console.log(event.target.files[0]);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.position = { top: '10%' };
    dialogConfig.data = { row: "20152,0,La cuenta esta bloqueada", locales: this.locales }


    const dialogRef = this.dialog.open(DialogProcessFileComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        if(!result) event.target.value = null;

      });
  }



  onProcessFile(file: File, rowFileModel: RowFileModel, locale: Locale) {
    this.uploader.onFileSelected(
      file,
      rowFileModel,
      locale);
  }


}
