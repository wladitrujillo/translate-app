import { Injectable } from '@angular/core';
import { Resource } from '../../model/resource';
import { Locale } from '../../model/locale';
import { Translation } from '../../model/translation';

let resources: Resource[] = [
  {
    id: "201520",
    value: "La cuenta no existe",
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
    value: "La cuenta esta bloqueada",
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
    value: "La cuenta no tiene saldo",
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
];

let locales = [
  { id: 'ES-EC', name: 'Español Ecuador' },
  { id: 'ES-PA', name: 'Español Panamá' }
]

let allLocales = [
  { id: 'ES-EC', name: 'Español Ecuador' },
  { id: 'ES-PA', name: 'Español Panamá' },
  { id: 'EN-US', name: 'English US' },
  { id: 'EN-GB', name: 'English UK' },
  { id: 'FR-FR', name: 'French France' },
  { id: 'FR-CA', name: 'French Canada' },
  { id: 'DE-DE', name: 'German Germany' },
  { id: 'ES-CO', name: 'Español Colombia' },
]

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  constructor() { }


  getResources(): Resource[] {
    return resources;
  }

  addResource(resource: Resource): void {
    resources.push(resource); // add resource to the end of the array
  }

  updateResource(resource: Resource): void {
    let index = resources.findIndex((r: Resource) => r.id == resource.id);
    resources[index] = resource; // replace resource at index
  }

  deleteResource(resourceId: string): void {
    let index = resources.findIndex((r: Resource) => r.id == resourceId);
    resources.splice(index, 1); // remove 1 element from index
  }

  updateTranslation(
    resourceId: string,
    translation: Translation): void {
    let resource = resources.find((r: Resource) => r.id == resourceId);
    if (!resource) return;
    let index = resource.translations.findIndex((t: any) => t.locale == translation.locale);
    resource.translations[index] = translation;
  }

  addLocale(locale: Locale): void {
    locales.push(locale);
    resources.forEach((resource: Resource) => {
      resource.translations.push({ locale: locale.id, value: '' });
    });
  }

  getLocales(): Locale[] {
    return locales;
  }

  getAllLocales(): Locale[] {
    return allLocales;
  }


}
