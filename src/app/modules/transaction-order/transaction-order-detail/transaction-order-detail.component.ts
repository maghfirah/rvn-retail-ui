import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {ErrorService} from "../../../shared/service/error.service";
import {AlertService} from "../../../shared/service/alert.service";
import {OrderDetail} from "../../../shared/models/order-detail.model";
import {environment} from "../../../../environments/environment";
import {APIConstant} from "../../../shared/constant/api.constant";
import {Order} from "../../../shared/models/order.model";
import {PaymentStatus} from "../../../shared/enum/payment-status.enum";
import {formatDate} from "@angular/common";
import Swal from "sweetalert2";
import {PropConstant} from "../../../shared/constant/prop.constant";

@Component({
  selector: 'app-transaction-order-detail',
  templateUrl: './transaction-order-detail.component.html',
  styleUrls: ['./transaction-order-detail.component.css']
})
export class TransactionOrderDetailComponent implements OnInit {


  constructor(
      private activatedRoute: ActivatedRoute,
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      private errorService: ErrorService,
      private alertService: AlertService,
  ) {
  }

  async ngOnInit() {
    await this.activatedRoute.params.subscribe((params: Params) => {
      this.uiIdInvoice = params['uiIdInvoice'];
      this.businessName = params['businessName'];
    });
    await this.initLoad();
  }

  async initLoad() {
    await this.checkOrder();
  }

  //loading component
  loading = true;

  //image
  fileData: any;
  imageToUpload1:any;
  previewImageProduct1: any;

  uiIdInvoice: string;
  businessName: string;
  orderDetail : OrderDetail = new OrderDetail();
  envUrl = environment.envUrl;
  envSimulatorNotExist = PropConstant.ENV_SIMULATOR_NOT_EXIST;
  totalProduct: number = 0;

  async checkOrder() {
    let apiGetOrder = environment.apiUrl + APIConstant.ORDER;

    let requestParam = new Map();
    requestParam.set('uiId', this.uiIdInvoice);
    let order: Order = await this.requestService.get(apiGetOrder, requestParam).toPromise().then(
        (response) => {
          return this.apiModelTranslatorService.snakeToCamelCase(response);
        },
        (error) => {
          this.errorService.getErrorApi(error);
        });

    //validate status payment
    if (order.paymentStatus === PaymentStatus.Paid) {
      this.loading = false;
      await this.getDetailOrder();
    } else {
      //validate have redirect url or not
      if (order.redirectUrl !== "" || order.redirectUrl !== null) {
        window.location.href = order.redirectUrl;
      } else {
        this.alertService.setProps("Mohon maaf terjadi kesalahan, mohon coba kembali", true);
      }
    }

  }

  async getDetailOrder(){
    let apiGetOrderMerchant = environment.apiUrl + APIConstant.MERCHANT_ORDER + '/' + this.uiIdInvoice + APIConstant.MERCHANT_ORDER_DETAIL;

    await this.requestService.get(apiGetOrderMerchant, null).toPromise().then(
        (response) => {
          this.orderDetail = this.apiModelTranslatorService.snakeToCamelCase(response);
          //sort based on order milestone
          this.orderDetail.milestones = this.orderDetail.milestones.sort((a, b) => a.order - b.order);
          this.totalProduct = this.orderDetail.products.reduce((total, product) => {
            let total_item = product.items.reduce((total2, item) => {
              return total2 + item.quantity;
            }, 0);
            return total + total_item;
          }, 0);
          return this.orderDetail;
        },
        (error) => {
          this.errorService.getErrorApi(error);
        });
  }

  detailPesanan() {

  }

  addDate(minDays: number, maxDays: number, createdDate: string) : string{
    let date;

    if(createdDate === undefined){
      date = new Date();
    }else{
      date = new Date(createdDate);
    }

    const formatDateMinMax = 'dd';
    const formatMonthMinMax = 'MMMM';
    const locale = 'id';
    // const locale = 'id-ID';
    let minDate = date.setDate(date.getDate() + minDays);
    let maxDate = date.setDate(date.getDate() + maxDays);
    const formattedMinDate = formatDate(minDate, formatDateMinMax, locale);
    const formattedMaxDate = formatDate(maxDate, formatDateMinMax, locale);
    const formattedMinMonth = formatDate(minDate, formatMonthMinMax, locale);
    const formattedMaxMonth = formatDate(minDate, formatMonthMinMax, locale);

    if(formattedMinMonth === formattedMaxMonth){
      return formattedMinDate + ' - ' + formattedMaxDate + ' ' + formattedMaxMonth;
    }else{
      return formattedMinDate + ' ' + formattedMinMonth + ' - ' + formattedMaxDate + ' ' + formattedMaxMonth;
    }
  }

  //Upload image
  fileProgress(fileInput: any, name:string) {
    this.fileData = <File>fileInput.target.files[0];
    if(this.fileData !== undefined){
      this.preview(name);
    }
  }

  preview(name:string) {
    // Show image preview
    let mimeType = this.fileData?.type;
    if (mimeType.match('image.*') === null) {
      this.alertService.setProps("Failed Upload Type", true);
      return;
    }

    //validation > 1 mb
    if(this.fileData.size > 1000000){
      this.alertService.setProps("Size more than 1 MB", true);
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(this.fileData);

    reader.onload = (_event) => {

      let img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const height = img.naturalHeight;
        const width = img.naturalWidth;
        //validation < 300px x 300px
        if(height < 300 || width < 300){
          this.alertService.setProps("Minimum width and height 300", true);
        }else{
          this.previewImageProduct1 = reader.result;
          this.imageToUpload1 = this.fileData;
        }
      };

    }
  }

  prosesPesanan(){
    let apiOrderProcess = environment.apiUrl + APIConstant.MERCHANT_ORDER + '/' + this.uiIdInvoice + APIConstant.MERCHANT_ORDER_PROCESS;

    Swal.fire({
      title: 'Proses Pesanan?',
      text: 'Setelah klik proses pesanan, silahkan segera siapkan dan kemas pesanan Anda',
      showCancelButton: true,
      cancelButtonText: 'BATAL',
      cancelButtonColor: '#666666',
      reverseButtons: true,
      confirmButtonColor: '#E1251B',
      confirmButtonText: 'PROSES',
      showLoaderOnConfirm: true,
      customClass: {
        title: 'swal2-title-modal-medium'
      },
      preConfirm: async () => {
        await this.requestService.post(apiOrderProcess, null, null).toPromise().then(
            async (response) => {
              await this.getDetailOrder();
            },
            (error) => {
              this.errorService.getErrorApi(error);
            });
      }
    });

  }


  kirimPesanan(){
    let apiOrderSend = environment.apiUrl + APIConstant.MERCHANT_ORDER + '/' + this.uiIdInvoice + APIConstant.MERCHANT_ORDER_SEND;

    Swal.fire({
      title: 'Kirim Pesanan - Dijemput Kurir',
      text: 'Mohon pastikan No. HP dan alamat toko yang telah Anda atur pada pengaturan Retail sudah benar dan akurat',
      showCancelButton: true,
      cancelButtonText: 'BATAL',
      cancelButtonColor: '#666666',
      reverseButtons: true,
      confirmButtonColor: '#E1251B',
      confirmButtonText: 'AJUKAN PENJEMPUTAN',
      showLoaderOnConfirm: true,
      customClass: {
        title: 'swal2-title-modal-medium'
      },
      preConfirm: async () => {
        await this.requestService.post(apiOrderSend, null, null).toPromise().then(
            async (response) => {
              await this.getDetailOrder();
            },
            (error) => {
              this.errorService.getErrorApi(error);
            });
      }
    });

  }


}
