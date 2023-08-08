# TranslateApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.6.

# Project structure

| Resource                  | Description                   |
|---------------------------|-------------------------------|
| app                       | Electron source               |
| src                       | Angular source                |
| angular.json              | Angular build config          |
| electron-builder.json     | Electron buil config          |
| tsconfig.json             | Angular TS config             |
| tsconfig.electron.json    | Electron TS config            |
| package.json              | Dependendences and scripts    |

# Angular modules

| Name          | Description                           |
|---------------|---------------------------------------|
| core          | Module with electron events           |
| material      | Angular Material modules              |
| shared        | Commons and utils                     |
| transalor     | editor, config, generator, uploader   |

## Development server

Run `npm start` for a dev server. It will open a new electron window. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build Angular
Run `npm run web:build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Build electron app

Run `npm run electron:build` to build the electron app. The build artifacts will be stored in `release/` directory.
