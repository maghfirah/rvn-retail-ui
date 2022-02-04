import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderReceiveComponent} from './order-receive/order-receive.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    component: OrderReceiveComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [OrderReceiveComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SimulatorModule { }
