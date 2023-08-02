import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { Locale } from 'src/app/core/model/locale';
import { Resource } from 'src/app/core/model/resource';
import { Translation } from 'src/app/core/model/translation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddCultureComponent } from '../dialog-add-culture/dialog-add-culture.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput') matInput!: ElementRef;

  locales: Locale[] =
    [{ id: 'ES-EC', name: 'Español Ecuador' },
    { id: 'ES-PA', name: 'Español Panamá' }];

  selectedLocales: FormControl = new FormControl(this.locales);
  selectedTranslation: Translation | null = null;


  resourcesFromService: Resource[] = [
    {
      id: "201520",
      translations: [
        {
          locale: 'ES-EC',
          value: 'La cuenta no existe'
        },
        {
          locale: 'ES-PA',
          value: 'La operacion no existe'
        }
      ]
    },
    {
      id: "201521",
      translations: [
        {
          locale: 'ES-EC',
          value: 'La cuenta esta bloqueada'
        },
        {
          locale: 'ES-PA',
          value: 'La operacion esta bloqueada'
        }
      ]
    },
    {
      id: "201522",
      translations: [
        {
          locale: 'ES-EC',
          value: 'La cuenta no tiene saldo'
        },
        {
          locale: 'ES-PA',
          value: 'La operacion no tiene saldo'
        }
      ]
    }
  ]

  resources: Resource[] = [];



  constructor(private dialog: MatDialog) { }

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
        this.resources = this.filterResources(this.matInput.nativeElement.value);
      });
  }

  ngOnInit(): void {

    this.resources = this.resourcesFromService;
  }

  isLocaleSelected(text: string): boolean {
    return this.selectedLocales.value.some((locale: Locale) => locale.id == text);
  }

  openEditor(translation: Translation): void {
    console.log(translation);
  }

  clearSearch(): void {
    this.matInput.nativeElement.value = '';
    this.resources = this.resourcesFromService;
  }

  openAddCulture($event: Event): void {
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

  private filterResources(text: string) {
    if (!text) {
      return this.resourcesFromService;
    }
    return this.resourcesFromService
      .filter((resource) => {
        return resource.id.includes(text) || resource.translations.some((translation) => {
          return translation.value.includes(text);
        });
      });
  }
}
