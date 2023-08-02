import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { Locale } from 'src/app/core/model/locale';
import { Resource } from 'src/app/core/model/resource';
import { Translation } from 'src/app/core/model/translation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddCultureComponent } from '../dialog-add-culture/dialog-add-culture.component';
import { DialogAddResourceComponent } from '../dialog-add-resource/dialog-add-resource.component';
import { DialogRemoveComponent } from 'src/app/shared/components/dialog-remove/dialog-remove.component';
import { ElectronService } from 'src/app/core/service/electron/electron.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput') matInput!: ElementRef;

  //from service
  resources: Resource[] = [];
  locales: Locale[] = [];


  //template variables
  selectedLocales: FormControl = new FormControl(this.locales);
  selectedTranslation: Translation | null = null;
  resourcesView: Resource[] = [];


  constructor(private dialog: MatDialog, private service: ElectronService) { }

  ngAfterViewInit(): void {
    fromEvent(this.matInput.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(150),
        distinctUntilChanged(),
        tap((text) => {
          console.log(this.matInput.nativeElement.value)
        })
      )
      .subscribe(() => {
        this.resourcesView = this.filterResources(this.matInput.nativeElement.value);
      });
  }

  ngOnInit(): void {

    this.loadData();

    this.resourcesView = this.resources;

  }

  isLocaleSelected(text: string): boolean {
    if (!Array.isArray(this.selectedLocales.value)) {
      return this.selectedLocales.value.id == text;
    }
    return this.selectedLocales.value.some((locale: Locale) => locale.id == text);
  }

  openEditor(translation: Translation): void {
    console.log(translation);
  }

  clearSearch(): void {
    this.matInput.nativeElement.value = '';
    this.resourcesView = this.filterResources('');
  }

  openDialogAddCulture($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { locales: this.locales };
    dialogConfig.width = '50%';

    const dialogRef = this.dialog.open(DialogAddCultureComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => { console.log(result) });

  }

  openDialogAddResource(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DialogAddResourceComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => { console.log(result) });
  }

  onDeleteResource(resource: Resource): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: "Recurso",
      message: `¿Está seguro que desea eliminar el recurso ${resource.id}?`
    };

    const dialogRef = this.dialog
      .open(DialogRemoveComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe(acceptedDelete => {
        if (acceptedDelete) {
          console.log("Borrando recurso...");
          this.service.deleteResource(resource.id);
        }
      });

  }

  private loadData(): void {
    this.locales = this.service.getLocales();
    this.resources = this.service.getResources();
  }

  private filterResources(text: string) {
    if (!text) {
      return this.resources;
    }
    return this.resources
      .filter((resource) => {
        return resource.id.includes(text) || resource.translations.some((translation) => {
          return translation.value.includes(text);
        });
      });
  }
}
