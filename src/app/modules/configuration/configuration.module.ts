import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigurationStoreLocationComponent} from './configuration-store-location/configuration-store-location.component';
import {RouterModule, Routes} from "@angular/router";
import {NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";

const routes: Routes = [
  {
    path:'',
    component: ConfigurationStoreLocationComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [ConfigurationStoreLocationComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbPaginationModule,
        FormsModule,
        NgbDropdownModule,
        NgSelectModule,
        ReactiveFormsModule,
        NgbNavModule,
        NgbTooltipModule
    ]
})
export class ConfigurationModule { }
