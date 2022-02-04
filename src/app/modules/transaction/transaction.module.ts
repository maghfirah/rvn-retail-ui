import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionListComponent} from './transaction-list/transaction-list.component';
import {RouterModule, Routes} from "@angular/router";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path:'',
    component: TransactionListComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [TransactionListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbPaginationModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class TransactionModule { }
