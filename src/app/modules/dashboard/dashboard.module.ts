import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardIndexComponent } from './dashboard-index/dashboard-index.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InventoryModule } from "../inventory/inventory.module";

const routes: Routes = [
  {
    path:'',
    component: DashboardIndexComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    DashboardIndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    NgbTooltipModule,
  ]
})
export class DashboardModule { }
