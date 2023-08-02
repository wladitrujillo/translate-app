import { Injectable } from '@angular/core';
import { Resource } from '../../model/resource';

let resources: Resource[] = [
  {
    id: "201520",
    value: "La cuenta no existe",
    translations: [
      {
        locale: 'ES-EC',
        value: 'La cuenta no existe'
      },
      {
        locale: 'ES-PA',
        value: 'La operacion no existe'
      }
    ]
  },
  {
    id: "201521",
    value: "La cuenta esta bloqueada",
    translations: [
      {
        locale: 'ES-EC',
        value: 'La cuenta esta bloqueada'
      },
      {
        locale: 'ES-PA',
        value: 'La operacion esta bloqueada'
      }
    ]
  },
  {
    id: "201522",
    value: "La cuenta no tiene saldo",
    translations: [
      {
        locale: 'ES-EC',
        value: 'La cuenta no tiene saldo'
      },
      {
        locale: 'ES-PA',
        value: 'La operacion no tiene saldo'
      }
    ]
  }
]

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  constructor() { }


  getResources(): Resource[] {
    return resources;
  }


}
