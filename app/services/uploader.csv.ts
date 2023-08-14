import { RowFileModel } from "@core/model/row-file-model";
import { Locale } from "../model/locale";
import { Project } from "../model/project";
import { Resource } from "../model/resource";
import { ResourceSrv } from "./resource.srv";
import { ProjectSrv } from "./project.srv";

export class UploaderCsv {


    constructor(private projectSrv: ProjectSrv, private resourceSrv: ResourceSrv) {
        console.log('UploaderCsv constructor');
    }


    processCsv(content: string, rowFileModel: RowFileModel, locale: Locale): void {

        let csvRowToResource = (csvRow: string, rowFileModel: RowFileModel, locale: Locale) => {

            let row = csvRow.split(',');
            let resource = {} as Resource;
            resource.translations = [];

            resource.id = row[rowFileModel.key];
            resource.translations.push({ locale: locale.id, value: row[rowFileModel.translation]?.trim() });

            return resource;
        }

        let rows = content.split('\n');

        let resources: Resource[] = this.resourceSrv.getResourcesFromDisk();

        let project: Project = this.projectSrv.getProjectFromDisk();

        for (let row of rows) {

            let resource = csvRowToResource(row, rowFileModel, locale);

            if (!resource.id) continue;

            let resourceIndex = resources.findIndex(r => r.id == resource.id);

            if (resourceIndex == -1) {
                this.newResource(resources, resource, project);
            } else {
                this.updateResource(resources, resource, resourceIndex, locale);
            }


        }

        this.resourceSrv.saveResourcesToDisk(resources);

    }

    private newResource(resources: Resource[], resource: Resource, project: Project) {
        let isBaseLocale: boolean = resource.translations[0].locale == project.baseLocale;
        let newResource = {} as Resource;
        newResource.id = resource.id;
        newResource.translations = [];
        for (let locale of project.locales) {
            if (locale.id == resource.translations[0].locale) {
                newResource.translations.push(resource.translations[0]);
            } else {
                newResource.translations.push({ locale: locale.id, value: isBaseLocale ? resource.translations[0].value : '' });
            }
        }
        resources.push(newResource);
    }

    private updateResource(resources: Resource[], resource: Resource, resourceIndex: number, locale: Locale) {
        let translationsIndex = resources[resourceIndex].translations.findIndex(t => t.locale == locale.id);
        resources[resourceIndex].translations[translationsIndex] = resource.translations[0];
    }

    get appDataPath(): string {
        return '\\AppData';
    }

    get basePath() {
        return '';
    }

}