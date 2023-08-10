import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogNewComponent } from '../dialog-new/dialog-new.component';
import { ElectronService } from '@core/service/electron/electron.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private electronService: ElectronService) { }

  onClickNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(DialogNewComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe(result => {
        if (!result) return;
        this.router.navigate(['/container']);
      });
  }


  onClickOpen() {
    this.electronService.showOpenDialog()
      .subscribe({
        next: (result) => { this.router.navigate(['/container']); },
        error: (error) => { },
      });
  }


}
