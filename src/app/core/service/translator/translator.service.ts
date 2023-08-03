import { Injectable } from '@angular/core';
import { Resource } from '../../model/resource';
import { Locale } from '../../model/locale';
import { Translation } from '../../model/translation';
import { Project } from '../../model/project';
import { ElectronService } from '../electron/electron.service';


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
export class TranslatorService {

  resources: Resource[] = [];
  project: Project = {} as Project;

  constructor(private electronService: ElectronService) {
    this.project = this.electronService.getProjectFromDisk();
    this.resources = this.electronService.getResourcesFromDisk();
  }

  getResources(): Resource[] {
    return this.resources;
  }

  addResource(resource: Resource): void {
    let found = this.resources.some((r: Resource) => r.id == resource.id);
    if (found) {
      throw new Error('Resource already exists');
    }
    resource.translations = [];
    this.project.locales.forEach((locale: Locale) => {
      resource.translations.push({
        locale: locale.id,
        value: resource.value
      });
    });
    this.resources.push(resource); // add resource to the end of the array
    this.electronService.saveResourcesToDisk(this.resources);
  }


  updateResource(resource: Resource): void {
    let index = this.resources.findIndex((r: Resource) => r.id == resource.id);
    this.resources[index] = resource; // replace resource at index
    this.electronService.saveResourcesToDisk(this.resources);
  }

  deleteResource(resourceId: string): void {
    let index = this.resources.findIndex((r: Resource) => r.id == resourceId);
    this.resources.splice(index, 1); // remove 1 element from index
    this.electronService.saveResourcesToDisk(this.resources);
  }

  updateTranslation(
    resourceId: string,
    translation: Translation): void {
    let resource = this.resources.find((r: Resource) => r.id == resourceId);
    if (!resource) return;
    let index = resource.translations.findIndex((t: any) => t.locale == translation.locale);
    resource.translations[index] = translation;
    this.electronService.saveResourcesToDisk(this.resources);
  }

  addLocaleToAllResources(locale: Locale): void {

    this.resources.forEach((resource: Resource) => {
      let baseTranslation = resource.translations
        .find((t: Translation) =>
          t.locale == this.project.baseLocale);
      resource.translations.push({
        locale: locale.id,
        value: baseTranslation?.value || ''
      });
    });
    this.project.locales.push(locale);
    this.electronService.saveResourcesToDisk(this.resources);
    this.electronService.saveProjectToDisk(this.project);
  }

  removeLocaleFromAllResources(locale: Locale): void {
    this.resources.forEach((resource: Resource) => {
      let index = resource.translations.findIndex((t: Translation) => t.locale == locale.id);
      resource.translations.splice(index, 1);
    });
    let index = this.project.locales.findIndex((l: Locale) => l.id == locale.id);
    this.project.locales.splice(index, 1);
    this.electronService.saveResourcesToDisk(this.resources);
    this.electronService.saveProjectToDisk(this.project);
  }

  getLocales(): Locale[] {
    return this.project.locales;
  }

  getAllLocales(): Locale[] {
    return allLocales;
  }

  getBaseLocale(): Locale | undefined {
    return this.project.locales.find((locale: Locale) => locale.id == this.project.baseLocale);
  }

  getProject(): Project {
    return this.project;
  }

  updateProject(project: Project): void {
    this.electronService.saveProjectToDisk(project);
  }

}
