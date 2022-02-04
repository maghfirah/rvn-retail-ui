import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InternalListComponent} from './internal-list/internal-list.component';
import {RouterModule, Routes} from "@angular/router";
import {NgbDropdownModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {NavigationConstant} from "../../shared/constant/navigation.constant";
import {InternalDetailComponent} from './internal-detail/internal-detail.component';

const routes: Routes = [
  {
    path:NavigationConstant.ROUTING_INTERNAL_LIST,
    component: InternalListComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [InternalListComponent, InternalDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbPaginationModule,
    FormsModule,
    NgbDropdownModule,
    NgSelectModule,
    ReactiveFormsModule
  ]
})
export class InternalModule { }
