import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {NavigationConstant} from './shared/constant/navigation.constant';
import {APP_BASE_HREF, registerLocaleData} from '@angular/common';
import {ErrorService} from './shared/service/error.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertComponent} from './modules/alert/alert.component';
import {CookieService} from 'ngx-cookie-service';
import {NgbAlertModule, NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {ErrorCustomComponent} from "./modules/error/error-custom/error-custom.component";
import {ErrorGeneralComponent} from "./modules/error/error-general/error-general.component";
import {NgSelectModule} from "@ng-select/ng-select";
import localeId from '@angular/common/locales/id';

registerLocaleData(localeId, 'id');

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    ErrorCustomComponent,
    ErrorGeneralComponent,
    AlertComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgbPaginationModule,
    NgbAlertModule
  ],
  providers: [
    NavigationConstant, CookieService,
    {provide: APP_BASE_HREF, useValue: NavigationConstant.ROUTING_BASE_HREF},
    {provide: ErrorHandler, useClass: ErrorService},
    { provide: LOCALE_ID, useValue: "id-ID" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
