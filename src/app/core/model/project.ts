import { Locale } from "./locale";

export interface Project {
    name: string;
    locales: Locale[];
    baseLocale: Locale;
}
