import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { Locale } from 'src/app/core/model/locale';
import { Resource } from 'src/app/core/model/resource';
import { Translation } from 'src/app/core/model/translation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddResourceComponent } from '../dialog-add-resource/dialog-add-resource.component';
import { DialogConfirmRemoveComponent } from 'src/app/shared/components/dialog-confirm-remove/dialog-confirm-remove.component';
import { TranslatorService } from 'src/app/core/service/translator/translator.service';

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
  baseLocale: Locale | undefined;

  //template variables
  selectedLocales: FormControl = new FormControl([]);
  selectedTranslation: Translation | null = null;
  resourcesView: Resource[] = [];


  constructor(private dialog: MatDialog,
    private service: TranslatorService) { }

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
        this.resourcesView =
          this.filterResources(this.matInput.nativeElement.value);
      });
  }

  ngOnInit(): void {

    this.loadData();
    this.selectedLocales.setValue([this.baseLocale]);
    this.resourcesView = this.resources;

  }

  isLocaleSelected(localeId: string): boolean {
    if (!Array.isArray(this.selectedLocales.value)) {
      return this.selectedLocales.value.id == localeId;
    }
    return this.selectedLocales.value
      .some((locale: Locale) => locale.id == localeId);
  }

  openEditor(translation: Translation): void {
    console.log(translation);
  }

  clearSearch(): void {
    this.matInput.nativeElement.value = '';
    this.resourcesView = this.filterResources('');
  }



  openDialogAddResource(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog
      .open(DialogAddResourceComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => { console.log(result) });
  }

  onDeleteResource(resource: Resource): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: "Recurso",
      message: `¿Está seguro que desea eliminar 
      el recurso ${resource.id} con todas sus traducciones?`
    };

    const dialogRef = this.dialog
      .open(DialogConfirmRemoveComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe(acceptedDelete => {
        if (acceptedDelete) {
          console.log("Borrando recurso...");
          this.service.deleteResource(resource.id);
        }
      });

  }

  onSubmitTranslation(
    resource: Resource,
    translation: Translation,
    inputValue: string): void {
    translation.value = inputValue;
    this.service.updateTranslation(resource.id, translation);
    this.selectedTranslation = null;
  }

  compareCulture(locale1: Locale, locale2: Locale): boolean {
    return locale1 && locale2 ?
      locale1.id === locale2.id : locale1 === locale2;
  }

  private loadData(): void {
    this.locales = this.service.getLocales();
    this.resources = this.service.getResources();
    this.baseLocale = this.service.getBaseLocale();
  }

  private filterResources(text: string) {
    if (!text) {
      return this.resources;
    }
    return this.resources
      .filter((resource) => {
        return resource.id.includes(text) ||
          resource.translations.some((translation) => {
            return translation.value.includes(text);
          });
      });
  }
}
