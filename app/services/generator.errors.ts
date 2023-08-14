
import { Locale } from '../model/locale';
import * as fs from 'fs';
import { format } from 'sql-formatter';



export class GeneratorErrrors {

    constructor() {
        console.log('GeneratorErrrors constructor');
    }

    toMySql(resource: any, locale: string, baseLocale: string): string {

        let baseTranslation = resource
            .translations
            .find((translation: any) => translation.locale == baseLocale);

        let translation = resource
            .translations
            .find((translation: any) => translation.locale == locale);


        if (!translation || !baseTranslation) {
            return '';
        }

        let result = '';

        if (baseTranslation.locale == translation.locale || baseTranslation.value != translation.value) {
            result =
                `select @pc_id := pc_id 
    from cobis.ad_pseudo_catalogo
    where pc_codigo_int = ${resource.id};`;

            result +=
                `if exists (select 1 from cobis.ad_recurso 
        where re_pc_id = @pc_id and re_cultura = '${translation.locale}') 
        then
          update cobis.ad_recurso set re_valor = '${translation.value}'
          where re_pc_id = @pc_id
          and re_cultura = '${translation.locale}';
        else
          insert into cobis.ad_recurso (re_pc_id, re_cultura, re_valor)
          values (@pc_id, '${translation.locale}', '${translation.value}');
        end if;`;
        }

        return result;
    }


    getScriptMySqlForLocales(procedureName: string, locale: string, baseLocale: string): string {

        let header = 'use cobis;\n';
        let cleanProcedureName = procedureName.replace(/-/g, '_');
        header += `DROP PROCEDURE IF EXISTS ${cleanProcedureName};\n`;
        header += 'DELIMITER //\n';
        header += `CREATE PROCEDURE ${cleanProcedureName}()\n`;
        header += 'BEGIN\n';

        const resources = JSON.parse(fs.readFileSync(`${this.appDataPath}\\resources.json`, 'utf8'));
        let body = '';
        resources.forEach((resource: any) => {
            body += this.toMySql(resource, locale, baseLocale);
        });

        body = format(body,
            {
                language: 'mysql',
                tabWidth: 2,
                keywordCase: 'upper',
                linesBetweenQueries: 1,
            });

        let footer = `\nEND//\n`;
        footer += `DELIMITER ;\n`;
        footer += `CALL ${cleanProcedureName}();\n`;
        footer += `DROP PROCEDURE IF EXISTS ${cleanProcedureName};\n`;

        return header + body + footer;
    }

    exportToMySql(locales: Locale[], baseLocale: Locale): void {

        for (let locale of locales) {

            let sql = this.getScriptMySqlForLocales(`COBIS_mysql_${locale.id}`,
                locale.id, baseLocale.id);

            this.createBuildFolder();
            const filePath = `${this.appBuildPath}\\COBIS_mysql_${locale.id}.sql`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            fs.appendFileSync(filePath, sql);

        }


    };

    private createBuildFolder(): void {
        const path = this.appBuildPath;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }


    get appBuildPath(): string {
        return '\\build';
    }

    get appDataPath(): string {
        return '\\AppData';
    }
}
