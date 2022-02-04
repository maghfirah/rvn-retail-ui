import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MerchantProductComponent} from './merchant-product/merchant-product.component';
import {RouterModule, Routes} from "@angular/router";
import {
    NgbAccordionModule,
    NgbCarouselModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTooltipModule
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {MerchantCheckoutComponent} from './merchant-checkout/merchant-checkout.component';
import {NavigationConstant} from "../../shared/constant/navigation.constant";
import {MerchantProductNotFoundComponent} from './merchant-product-not-found/merchant-product-not-found.component';

const routes: Routes = [
  {
    path:'',
    component: MerchantProductComponent,
    pathMatch: 'full'
  },
  {
    path:NavigationConstant.ROUTING_MERCHANT_PRODUCT_NOT_FOUND,
    component: MerchantProductNotFoundComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [MerchantProductComponent, MerchantCheckoutComponent, MerchantProductNotFoundComponent],
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
export class MerchantModule { }
