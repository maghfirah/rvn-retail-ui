import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {RequestService} from "../../../shared/service/request.service";
import {environment} from "../../../../environments/environment";
import {APIConstant} from "../../../shared/constant/api.constant";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {Router} from "@angular/router";
import {ConfigurationStoreLocation} from "../../../shared/models/configuration-store-location.model";
import {ApiErrorCode} from "../../../shared/constant/api-error-code.constant";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {ErrorCodeConstant} from "../../../shared/constant/error-code.constant";
import {ResponseApi} from "../../../shared/models/response-api.model";

@Component({
  selector: 'app-order-receive',
  templateUrl: './order-receive.component.html',
  styleUrls: ['./order-receive.component.css']
})
export class OrderReceiveComponent implements OnInit {

  constructor(
      private readonly formBuilder: FormBuilder,
      private requestService: RequestService,
      private alertService: AlertService,
      private errorService: ErrorService,
      private router: Router,
  ) { }

  //loading component
  loading = true;

  public receiveOrderForm: FormGroup;
  responseApi = new ResponseApi();

  async ngOnInit() {
    await this.initLoad();
  }

  async initLoad(){
    let configStore : ConfigurationStoreLocation = await this.getConfigurationStoreInfo();
    this.form();
  }

  form() {
    this.receiveOrderForm = this.formBuilder.group({
      nomorPesanan: [null, [Validators.required]],
    });
  }

  async getConfigurationStoreInfo() {
    let apiInfoStore = environment.apiUrl + APIConstant.MERCHANT;
    return this.requestService.get(apiInfoStore, null).toPromise().then(
        (response) => {
          this.loading = false;
        }
        ,
        (error) => {
          this.responseApi = error.error;
          if(this.responseApi.error.code === ApiErrorCode.MERCHANT_NOT_FOUND){
            this.loading = false;
            this.router.navigate([NavigationConstant.ERROR_CUSTOM, ErrorCodeConstant.KYB]);
          }
          else{
            this.errorService.getErrorApi(error);
          }
        }
    )
  }

  submitReceiveOrder() {
    if (this.receiveOrderForm.valid) {

      let invoiceNumber = this.receiveOrderForm.get("nomorPesanan").value;
      let invoiceNumberPath = `/${invoiceNumber}/receive`;
      let apiOrderReceive = environment.apiUrl + APIConstant.MERCHANT_ORDER + invoiceNumberPath;

      Swal.fire({
        title: 'Menerima Pesanan',
        text: 'Apakah anda ingin merubah status pesanan anda menjadi telah diterima?',
        showCancelButton: true,
        cancelButtonText: 'BATAL',
        cancelButtonColor: '#666666',
        reverseButtons: true,
        confirmButtonColor: '#E1251B',
        confirmButtonText: 'DITERIMA',
        showLoaderOnConfirm: true,
        customClass: {
          title: 'swal2-title-modal-medium'
        },
        preConfirm: async () => {
          this.requestService.post(apiOrderReceive, null, null)
              .subscribe((res) => {
                    this.alertService.setProps("Success! Order Received", false);
                  },
                  (error) => {
                    this.errorService.getErrorApi(error);
                  });
        }
      });
    }
  }

}
