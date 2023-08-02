import { Translation } from "./translation";

export interface Resource {
    id: string;
    value: string;
    translations: Translation[]
}
