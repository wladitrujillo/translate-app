import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  cultures: string[] =
    ['Español Ecuador',
      'Español Panama'];

  items: any[] = [
    {
      id: 201520,
      description: 'La cuenta no existe',
      resources: [
        {
          code: 'ES-EC',
          value: 'La cuenta no existe'
        },
        {
          code: 'ES-PA',
          value: 'La operacion no existe'
        }
      ]
    },
    {
      id: 201521,
      description: 'La cuenta esta bloqueada',
      resources: [
        {
          code: 'ES-EC',
          value: 'La cuenta esta bloqueada'
        },
        {
          code: 'ES-PA',
          value: 'La operacion esta bloqueada'
        }
      ]
    },
    {
      id: 201522,
      description: 'La cuenta no tiene saldo',
      resources: [
        {
          code: 'ES-EC',
          value: 'La cuenta no tiene saldo'
        },
        {
          code: 'ES-PA',
          value: 'La operacion no tiene saldo'
        }
      ]
    }
  ]

  constructor() { }

  ngOnInit(): void {

  }
}
