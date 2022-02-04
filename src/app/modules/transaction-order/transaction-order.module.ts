import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionOrderDetailComponent} from './transaction-order-detail/transaction-order-detail.component';
import {RouterModule, Routes} from "@angular/router";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [
  {
    path:'',
    component: TransactionOrderDetailComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [TransactionOrderDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbTooltipModule
  ]
})
export class TransactionOrderModule { }
