import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { TranslatorRoutingModule } from './translator/translator.routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'container',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    TranslatorRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
