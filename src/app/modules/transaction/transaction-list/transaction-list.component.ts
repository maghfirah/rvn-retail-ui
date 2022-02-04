import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {User} from "../../../shared/models/user.model";
import {ResponseApi} from "../../../shared/models/response-api.model";
import {APIConstant} from "../../../shared/constant/api.constant";
import {ErrorCodeConstant} from "../../../shared/constant/error-code.constant";
import {MerchantOrder} from "../../../shared/models/merchant-order.model";
import {OrderStatus} from "../../../shared/enum/order-status.enum";
import {PaymentStatus} from "../../../shared/enum/payment-status.enum";
import {ApiErrorCode} from "../../../shared/constant/api-error-code.constant";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionStatus } from 'src/app/shared/enum/transaction-status';


@Component({
  selector: 'app-list-transaction',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  formGroupTransaction: FormGroup;
  transactionStatusCheck: TransactionStatus[] = [];
  seracthStringFilter: string = null;
  isCheckWaitingForPayment: boolean = false;
  isCheckNewOrder: boolean = false;
  isCheckProccessed: boolean = false;
  isCheckSent: boolean = false;
  isCheckFinished: boolean = false;
  isCheckExpired: boolean = false;
  orderStatusChecked: OrderStatus[] = [];
  paymentStatusChecked: PaymentStatus[] = [];

  constructor(
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      private alertService: AlertService,
      private errorService: ErrorService,
      private modalService: NgbModal,
      private readonly formBuilder: FormBuilder,
      private router: Router,
      private activatedRoute: ActivatedRoute
  ) { 
    this.formInit();
  }
  formInit(){
    this.formGroupTransaction = this.formBuilder.group({
      searchInput: [null,  [Validators.pattern]],
      checkWaitingForPayment: [false],
      checkNewOrder: [false],
      checkProccessed: [false],
      checkSent: [false],
      checkFinished: [false],
      checkExpired: [false]
  });

  
  }
  async ngOnInit() {
    let statusTransaction = TransactionStatus
    const status = this.activatedRoute.snapshot.queryParamMap.get('status');
    this.transactionStatusCheck = [];
    this.orderStatusChecked = [];
    this.paymentStatusChecked = [];
    this.seracthStringFilter = '';
    let paymentStatus : PaymentStatus;
    let orderStatus : OrderStatus;
    if(status===statusTransaction.checkWaitingForPayment){
      this.formGroupTransaction.controls['checkWaitingForPayment'].setValue(true);
      paymentStatus = PaymentStatus.Unpaid;
      this.paymentStatusChecked.push(paymentStatus);
    }else if(status===statusTransaction.checkExpired){
      this.formGroupTransaction.controls['checkExpired'].setValue(true);
      paymentStatus = PaymentStatus.Expired;
      this.paymentStatusChecked.push(paymentStatus);
    }else if(status===statusTransaction.checkFinished){
      this.formGroupTransaction.controls['checkFinished'].setValue(true);
      paymentStatus = PaymentStatus.Paid;
      this.paymentStatusChecked.push(paymentStatus);
      orderStatus = OrderStatus.Done;
      this.orderStatusChecked.push(orderStatus);
    }else if(status===statusTransaction.checkNewOrder){
      this.formGroupTransaction.controls['checkNewOrder'].setValue(true);
      paymentStatus = PaymentStatus.Paid;
      this.paymentStatusChecked.push(paymentStatus);
      orderStatus = OrderStatus.Confirmed;
      this.orderStatusChecked.push(orderStatus);
    }else if(status===statusTransaction.checkProccessed){
      this.formGroupTransaction.controls['checkProccessed'].setValue(true);
      paymentStatus = PaymentStatus.Paid;
      this.paymentStatusChecked.push(paymentStatus);
      orderStatus = OrderStatus.Processing;
      this.orderStatusChecked.push(orderStatus);
    }else if(status===statusTransaction.checkSent){
      this.formGroupTransaction.controls['checkSent'].setValue(true);
      paymentStatus = PaymentStatus.Paid;
      this.paymentStatusChecked.push(paymentStatus);
      orderStatus = OrderStatus.Sending;
      this.orderStatusChecked.push(orderStatus);
      orderStatus = OrderStatus.Delivered;
      this.orderStatusChecked.push(orderStatus);
    }
   
    await this.initLoad();
  }
  
  //loading component
  loading = true;

  //table pagination
  page = 1;
  pageSize = 5;

  user = new User();
  responseApi = new ResponseApi();
  merchantOrderList = new MerchantOrder();
  orderStatus = OrderStatus;
  paymentStatus = PaymentStatus;
  rootUrl = environment.envUrl + '/' + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_TRANSACTION;

  async initLoad(){
    this.getListMerchantOrder(this.page, this.pageSize, 'DESC', this.seracthStringFilter, this.paymentStatusChecked, this.orderStatusChecked);
  }

  getListMerchantOrder(page: number, pageSize: number, sort: string, stringSearch: string, paymentStatusCheck: PaymentStatus[], orderStatuseCheck: OrderStatus[]) {
    let apiMerchantGetOrder = environment.apiUrl + APIConstant.MERCHANT_ORDER;
    let requestParam = new Map();
    requestParam.set('page', page-1);
    requestParam.set('size', pageSize);
    requestParam.set('sort', sort);
    
    if(stringSearch !== null && stringSearch !== ''){
      requestParam.set('search', stringSearch);
    }
    if(paymentStatusCheck !== [] && paymentStatusCheck?.length > 0){
      requestParam.set('paymentStatuses', paymentStatusCheck);
    }
    if(orderStatuseCheck !== [] && orderStatuseCheck?.length > 0){
      requestParam.set('orderStatuses', orderStatuseCheck);
    }

    this.requestService.get(apiMerchantGetOrder, requestParam).subscribe(
        (response) => {
          this.merchantOrderList = this.apiModelTranslatorService.snakeToCamelCase(response);
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

  onPageChange(page, pageSize: number) {
    this.getListMerchantOrder(page, pageSize, 'DESC', this.seracthStringFilter, this.paymentStatusChecked, this.orderStatusChecked);
  }

  decodeURI(param: string){
    return decodeURI(param);
  }

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.alertService.setProps("Transaction Link is already copied", false);
  }

  findTransaction(){
    this.loading = true;
    this.transactionStatusCheck = [];
    this.orderStatusChecked = [];
    this.paymentStatusChecked = [];
    this.seracthStringFilter = '';
    let paymentStatus : PaymentStatus;
    let orderStatus : OrderStatus;

    //transaction status checkWaitingForPayment
    if(this.formGroupTransaction.get('checkWaitingForPayment').value === true){
        paymentStatus = PaymentStatus.Unpaid;
        this.paymentStatusChecked.push(paymentStatus);
    }

    //transaction status checkExpired
    if(this.formGroupTransaction.get('checkExpired').value === true){
      paymentStatus = PaymentStatus.Expired;
      this.paymentStatusChecked.push(paymentStatus);
    }

     //transaction status checkFinished
     if(this.formGroupTransaction.get('checkFinished').value === true){
        paymentStatus = PaymentStatus.Paid;
        this.paymentStatusChecked.push(paymentStatus);
        orderStatus = OrderStatus.Done;
        this.orderStatusChecked.push(orderStatus);
    }

        //transaction status checkNewOrder
        if(this.formGroupTransaction.get('checkNewOrder').value === true){
          paymentStatus = PaymentStatus.Paid;
          this.paymentStatusChecked.push(paymentStatus);
          orderStatus = OrderStatus.Confirmed;
          this.orderStatusChecked.push(orderStatus);
        }
    
      //transaction status checkNewOrder
      if(this.formGroupTransaction.get('checkProccessed').value === true){
        paymentStatus = PaymentStatus.Paid;
        this.paymentStatusChecked.push(paymentStatus);
        orderStatus = OrderStatus.Processing;
        this.orderStatusChecked.push(orderStatus);
      }

      //transaction status checkNewOrder
      if(this.formGroupTransaction.get('checkSent').value === true){
        paymentStatus = PaymentStatus.Paid;
        this.paymentStatusChecked.push(paymentStatus);
        orderStatus = OrderStatus.Sending;
        this.orderStatusChecked.push(orderStatus);
        orderStatus = OrderStatus.Delivered;
        this.orderStatusChecked.push(orderStatus);
      }
    


    //search filter
    if(this.formGroupTransaction.get('searchInput').value !== null && this.formGroupTransaction.get('searchInput').value !== ""){
        this.seracthStringFilter = this.formGroupTransaction.get('searchInput').value;
    }
    this. paymentStatusChecked = [...new Set(this.paymentStatusChecked)];

    this.getListMerchantOrder(this.page, this.pageSize, 'DESC', this.seracthStringFilter, this.paymentStatusChecked, this.orderStatusChecked);
  }
  clearFilter(){
    this.loading = true;
    this.formInit();
    this.transactionStatusCheck = [];
    this.paymentStatusChecked = [];
    this.orderStatusChecked = [];
    this.seracthStringFilter = '';
    this.getListMerchantOrder(this.page, this.pageSize, 'DESC', this.seracthStringFilter, this.paymentStatusChecked, this.orderStatusChecked);
}


}
