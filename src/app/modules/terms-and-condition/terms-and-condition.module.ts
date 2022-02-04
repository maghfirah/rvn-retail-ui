import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {TncCustomerComponent} from './tnc-customer/tnc-customer.component';

const routes: Routes = [
  {
    path:'',
    component: TncCustomerComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [TncCustomerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class TermsAndConditionModule { }
