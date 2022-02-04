import { Component, OnInit } from '@angular/core';
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {Router} from "@angular/router";
import { TransactionStatus } from 'src/app/shared/enum/transaction-status';
import { APIConstant } from 'src/app/shared/constant/api.constant';
import { environment } from 'src/environments/environment';
import { RequestService } from 'src/app/shared/service/request.service';
import { ResponseApi } from 'src/app/shared/models/response-api.model';
import { ApiErrorCode } from 'src/app/shared/constant/api-error-code.constant';
import { ErrorCodeConstant } from 'src/app/shared/constant/error-code.constant';
import { ErrorService } from 'src/app/shared/service/error.service';
import {DashboardModel} from 'src/app/shared/models/dashboard.model';
@Component({
  selector: 'app-dashboard-index',
  templateUrl: './dashboard-index.component.html',
  styleUrls: ['./dashboard-index.component.css']
})
export class DashboardIndexComponent implements OnInit {

  transactionStatus : any  = TransactionStatus;
  loading = true;
  pageName : String = "";
  dashboardData : DashboardModel;
  responseApi = new ResponseApi();

  constructor(
      private router: Router,
      private requestService: RequestService,
      private errorService: ErrorService
  ) { }

  async ngOnInit() {
    await this.initLoad();
  }

  async initLoad() {
    this.pageName = 'dashboard';
    this.getDataDashboard();
  }

  goToOrderPage() {
    this.router.navigate(['/' + NavigationConstant.ROUTING_INVENTORY])
  }
  goToTransactionPage(status) {
    this.router.navigate(['/' + NavigationConstant.ROUTING_TRANSACTION],  { queryParams: { status: status } })
  }

  changePage(pageName:string) {
    this.router.navigate(['/' + NavigationConstant.ROUTING_INVENTORY],  { queryParams: { pageName: 'add' }, skipLocationChange: true, replaceUrl: true })
  }

  getDataDashboard(){
    let ENDPOINT_DASHBOARD = environment.apiUrl + APIConstant.MERCHANT_DASHBOARD;
    let requestParam = new Map();
    this.requestService.get(ENDPOINT_DASHBOARD, requestParam).subscribe(
      (response) => {
        this.dashboardData = response;
        this.loading = false;
      }
      ,
      (error) => {
        this.responseApi = error.error;
        if(this.responseApi.error.code === ApiErrorCode.MERCHANT_NOT_FOUND){
          this.router.navigate([NavigationConstant.ERROR_CUSTOM, ErrorCodeConstant.KYB]);
        }
        else if(this.responseApi.error.code === ApiErrorCode.MERCHANT_INACTIVE){
          this.router.navigate([NavigationConstant.ROUTING_CONFIGURATION]);
        }
        else{
          this.errorService.getErrorApi(error);
        }
      }
  )
  }
}
