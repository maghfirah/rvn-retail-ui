import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";


const routes: Routes = [
  {
    path:'',
    component: OrderDetailComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [OrderDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    NgbTooltipModule
  ]
})
export class OrderModule { }
