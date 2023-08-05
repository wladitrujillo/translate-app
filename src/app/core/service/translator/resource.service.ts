import { Injectable } from '@angular/core';
import { Resource } from '@core/model/resource';
import { ElectronService } from '../electron/electron.service';
import { Translation } from '@core/model/translation';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  resources: Resource[] = [];

  constructor(private electronService: ElectronService) {
    this.resources = this.electronService.getResourcesFromDisk();
  }


  addResource(resource: Resource): void {
    let found = this.resources.some((r: Resource) => r.id == resource.id);
    if (found) {
      throw new Error(`El recurso con identificador ${resource.id} ya existe`);
    }

    this.resources.push(resource); // add resource to the end of the array
    this.electronService.saveResourcesToDisk(this.resources);
  }

  getResources(): Resource[] {
    this.resources = this.electronService.getResourcesFromDisk();
    return this.resources;
  }

  getResourcesFilterByText(text: string): Resource[] {
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


  updateResource(resource: Resource): void {
    let index = this.resources.findIndex((r: Resource) => r.id == resource.id);
    if (index < 0) return;
    this.resources[index] = resource; // replace resource at index
    this.electronService.saveResourcesToDisk(this.resources);
  }

  deleteResource(resourceId: string): void {
    let index = this.resources.findIndex((r: Resource) => r.id == resourceId);
    if (index < 0) return;
    this.resources.splice(index, 1); // remove 1 element from index
    this.electronService.saveResourcesToDisk(this.resources);
  }

  updateTranslation(
    resourceId: string,
    translation: Translation): void {
    let resource = this.resources.find((r: Resource) => r.id == resourceId);
    if (!resource) return;
    let index = resource.translations.findIndex((t: any) => t.locale == translation.locale);
    if (index < 0) return;
    resource.translations[index] = translation;
    this.electronService.saveResourcesToDisk(this.resources);
  }

}
