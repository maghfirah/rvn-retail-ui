import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MerchantShopProdComponent} from './merchant-shop-prod/merchant-shop-prod.component';
import {RouterModule, Routes} from "@angular/router";
import {NgbDropdownModule, NgbPaginationModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {MerchantNotFoundComponent} from './merchant-not-found/merchant-not-found.component';
import {SearchPipe} from "../../shared/pipe/search.pipe";

const routes: Routes = [
  {
    path:'',
    component: MerchantShopProdComponent,
    pathMatch: 'full'
  },
];


@NgModule({
  declarations: [
    MerchantShopProdComponent,
    MerchantNotFoundComponent,
    SearchPipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbPaginationModule,
    FormsModule,
    NgbDropdownModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbTooltipModule,
  ]
})
export class MerchantShopModule {}
