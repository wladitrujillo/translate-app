import { Component } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {

  onFileSelected(event: any) {
    console.log(event.target.files[0]);
    let file: File = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      console.log(reader.result);
    };
    reader.readAsText(file);
  }
}
