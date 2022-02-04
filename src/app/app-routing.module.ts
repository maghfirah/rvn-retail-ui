import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NavigationConstant} from "./shared/constant/navigation.constant";
import {AuthGuard} from "./shared/interceptor/auth.guard";
import {ErrorCustomComponent} from "./modules/error/error-custom/error-custom.component";
import {ErrorGeneralComponent} from "./modules/error/error-general/error-general.component";
import {ErrorCodeConstant} from "./shared/constant/error-code.constant";
import {MerchantNotFoundComponent} from "./modules/merchant-shop/merchant-not-found/merchant-not-found.component"

const routes: Routes = [
  { path: NavigationConstant.ROUTING_INVENTORY, loadChildren: () => import('./modules/inventory/inventory.module').then(value => value.InventoryModule), canActivate: [AuthGuard] },
  { path: NavigationConstant.ROUTING_BO_DASHBOARD, loadChildren: () => import('./modules/dashboard/dashboard.module').then(value => value.DashboardModule), canActivate: [AuthGuard] },
  { path: NavigationConstant.ROUTING_CONFIGURATION, loadChildren: () => import('./modules/configuration/configuration.module').then(value => value.ConfigurationModule), canActivate: [AuthGuard] },
  { path: NavigationConstant.ROUTING_MERCHANT + '/:businessName' + '/:product', loadChildren: () => import('./modules/merchant/merchant.module').then(value => value.MerchantModule)},
  { path: NavigationConstant.ROUTING_MERCHANT + '/:businessName' , loadChildren: () => import('./modules/merchant-shop/merchant-shop.module').then(value => value.MerchantShopModule)},
  { path: NavigationConstant.ROUTING_MERCHANT_NOT_FOUND + '/:businessName' ,component:MerchantNotFoundComponent},
  { path: NavigationConstant.ROUTING_TERMS_CONDITION, loadChildren: () => import('./modules/terms-and-condition/terms-and-condition.module').then(value => value.TermsAndConditionModule)},
  { path: NavigationConstant.ROUTING_MERCHANT_CART, loadChildren: () => import('./modules/merchant-cart/merchant-cart.module').then(value => value.MerchantCartModule)},
  { path: NavigationConstant.ROUTING_ORDER + '/:businessName' + '/:uiIdInvoice', loadChildren: () => import('./modules/order/order.module').then(value => value.OrderModule)},
  { path: NavigationConstant.ROUTING_TRANSACTION, loadChildren: () => import('./modules/transaction/transaction.module').then(value => value.TransactionModule), canActivate: [AuthGuard]},
  { path: NavigationConstant.ROUTING_TRANSACTION + '/:businessName' + '/:uiIdInvoice', loadChildren: () => import('./modules/transaction-order/transaction-order.module').then(value => value.TransactionOrderModule), canActivate: [AuthGuard]},
  { path: NavigationConstant.ROUTING_INTERNAL, loadChildren: () => import('./modules/internal/internal.module').then(value => value.InternalModule), canActivate: [AuthGuard]},
  { path: NavigationConstant.ROUTING_SIMULATOR_ORDER_RECEIVE, loadChildren: () => import('./modules/simulator/simulator.module').then(value => value.SimulatorModule), canActivate: [AuthGuard]},
  { path: NavigationConstant.ROUTING_ERROR_CUSTOM + '/:typeError', component: ErrorCustomComponent},
  { path: NavigationConstant.ROUTING_ERROR_GENERAL + '/:httpStatus', component: ErrorGeneralComponent},
  { path: '**', redirectTo: NavigationConstant.ROUTING_ERROR_GENERAL + '/' + ErrorCodeConstant.NOT_FOUND },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
