import { Translation } from "./translation";

export class Resource {
    id!: string;
    value!: string;
    translations !: Translation[]
}
