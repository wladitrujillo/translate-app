import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    const path = localStorage.getItem('path');
    if (!path || path === '' || path === 'null' || path === 'undefined') {
      this.router.navigate(['/home']);
    }
  }



}
