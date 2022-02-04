import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InventoryListComponent} from './inventory-list/inventory-list.component';
import {RouterModule, Routes} from "@angular/router";
import {NgbDropdownModule, NgbPaginationModule, NgbPopoverModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InventoryAddComponent} from './inventory-add/inventory-add.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {InventoryEditComponent} from './inventory-edit/inventory-edit.component';

const routes: Routes = [
  {
    path:'',
    component: InventoryListComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [InventoryListComponent, InventoryAddComponent, InventoryEditComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbPaginationModule,
        FormsModule,
        NgbDropdownModule,
        NgSelectModule,
        ReactiveFormsModule,
        NgbPopoverModule
    ]
})
export class InventoryModule { }
