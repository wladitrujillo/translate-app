import { Locale } from "../model/locale";
import { Project } from "../model/project";
import { Resource } from "../model/resource";
import { Translation } from "../model/translation";
import { Constants } from "../util/constants";
import * as fs from 'fs';
import { ResourceSrv } from "./resource.srv";

const allLocales = [
    { id: 'ES', name: 'Español' },
    { id: 'ES-EC', name: 'Español Ecuador' },
    { id: 'ES-PA', name: 'Español Panamá' },
    { id: 'ES-CO', name: 'Español Colombia' },
    { id: 'ES-MX', name: 'Español México' },
    { id: 'ES-ES', name: 'Español España' },
    { id: 'ES-BO', name: 'Español Bolivia' },
    { id: 'ES-AR', name: 'Español Argentina' },
    { id: 'EN', name: 'Inglés' },
    { id: 'EN-US', name: 'Inglés US' },
    { id: 'EN-GB', name: 'Inglés UK' },
    { id: 'FR-FR', name: 'Frances France' },
    { id: 'FR-CA', name: 'Frances Canada' },
]

export class ProjectSrv {

    project: Project = {} as Project;

    constructor(private resourceSrv: ResourceSrv) {
    }


    addLocaleToAllResources(locale: Locale): void {

        let resources = this.resourceSrv.getResourcesFromDisk();

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
        this.resourceSrv.saveResourcesToDisk(resources);
        this.saveProjectToDisk(this.project);
    }

    removeLocaleFromAllResources(locale: Locale): void {

        if (locale.id == this.project.baseLocale) {
            throw new Error('No puede eliminar la cultura base');
        }

        let resources = this.resourceSrv.getResourcesFromDisk();
        resources.forEach((resource: Resource) => {
            let index = resource.translations.findIndex((t: Translation) => t.locale == locale.id);
            resource.translations.splice(index, 1);
        });
        let index = this.project.locales.findIndex((l: Locale) => l.id == locale.id);
        this.project.locales.splice(index, 1);
        this.resourceSrv.saveResourcesToDisk(resources);
        this.saveProjectToDisk(this.project);
    }

    createProject(path: string, project: Project, resources: Resource[]): void {
        this.saveProjectToDisk(project);
        //create folder AppData
        this.createFolder(path + '\\AppData');
        this.resourceSrv.saveResourcesToDisk(resources);
    }

    getProject(): Project {
        this.project = this.getProjectFromDisk();
        return this.project;
    }

    updateProject(project: Project): void {
        this.project = project;
        this.saveProjectToDisk(project);
    }

    getAllLocales(): Locale[] {
        return allLocales;
    }

    saveProjectToDisk = (data: Project) => {
        fs.writeFileSync(`\\${Constants.PROJECT_FILE_NAME}`,
            JSON.stringify(data, null, 4),
            {
                encoding: "utf8",
                flag: "w",
                mode: 0o666
            });
    }

    getProjectFromDisk = () => {
        let data = fs.readFileSync(`\\${Constants.PROJECT_FILE_NAME}`, 'utf8');
        return JSON.parse(data);
        return {};
    }


    createFolder = (path: string) => {

        if (fs.existsSync(path)) {
            return;
        }
        fs.mkdirSync(path, { recursive: true });

    }

}
