import { Injectable } from '@angular/core';
import { Project } from '@core/model/project';
import { ElectronService } from '../electron/electron.service';
import { Resource } from '@core/model/resource';
import { Locale } from '@core/model/locale';
import { Translation } from '@core/model/translation';

let allLocales = [
  { id: 'ES', name: 'Español' },
  { id: 'ES-EC', name: 'Español Ecuador' },
  { id: 'ES-PA', name: 'Español Panamá' },
  { id: 'ES-CO', name: 'Español Colombia' },
  { id: 'ES-MX', name: 'Español México' },
  { id: 'ES-ES', name: 'Español España' },
  { id: 'EN', name: 'Inglés' },
  { id: 'EN-US', name: 'Inglés US' },
  { id: 'EN-GB', name: 'Inglés UK' },
  { id: 'FR-FR', name: 'Frances France' },
  { id: 'FR-CA', name: 'Frances Canada' },
]


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  project: Project = {} as Project;

  constructor(private electronService: ElectronService) {
    this.project = this.electronService.getProjectFromDisk();
  }

  addLocaleToAllResources(locale: Locale): void {

    let resources = this.electronService.getResourcesFromDisk();

    resources.forEach((resource: Resource) => {
      let baseTranslation = resource.translations
        .find((t: Translation) =>
          t.locale == this.project.baseLocale);
      resource.translations.push({
        locale: locale.id,
        value: baseTranslation?.value || ''
      });
    });
    this.project.locales.push(locale);
    this.electronService.saveResourcesToDisk(resources);
    this.electronService.saveProjectToDisk(this.project);
  }

  removeLocaleFromAllResources(locale: Locale): void {

    if (locale.id == this.project.baseLocale) {
      throw new Error('No puede eliminar la cultura base');
    }

    let resources = this.electronService.getResourcesFromDisk();
    resources.forEach((resource: Resource) => {
      let index = resource.translations.findIndex((t: Translation) => t.locale == locale.id);
      resource.translations.splice(index, 1);
    });
    let index = this.project.locales.findIndex((l: Locale) => l.id == locale.id);
    this.project.locales.splice(index, 1);
    this.electronService.saveResourcesToDisk(resources);
    this.electronService.saveProjectToDisk(this.project);
  }

  getBaseLocale(): Locale | undefined {
    if (!this.project.locales) return undefined;
    return this.project.locales.find((locale: Locale) => locale.id == this.project.baseLocale);
  }

  getProject(): Project {
    return this.project;
  }

  updateProject(project: Project): void {
    this.project = project;
    this.electronService.saveProjectToDisk(project);
  }

  getLocales(): Locale[] {
    return this.project.locales;
  }

  getAllLocales(): Locale[] {
    return allLocales;
  }



}
