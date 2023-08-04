import { Component } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {

  onFileSelected(event: any) {
    console.log(event);
    console.log(event.target.files[0]);
  }
}
