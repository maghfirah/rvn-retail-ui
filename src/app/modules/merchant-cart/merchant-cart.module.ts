import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantCartListComponent } from './merchant-cart-list/merchant-cart-list.component';
import {RouterModule, Routes} from "@angular/router";
import { MerchantCartCheckoutComponent } from './merchant-cart-checkout/merchant-cart-checkout.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  NgbAccordionModule,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbPaginationModule,
  NgbTooltipModule
} from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [
  {
    path:'',
    component: MerchantCartListComponent,
    pathMatch: 'full'
  },
  {
    path:'checkout',
    component: MerchantCartCheckoutComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    MerchantCartListComponent,
    MerchantCartCheckoutComponent
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
    NgbAccordionModule,
    NgbCarouselModule
  ]
})
export class MerchantCartModule { }
