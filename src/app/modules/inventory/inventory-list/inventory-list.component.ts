import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../../../shared/models/user.model";
import {environment} from "../../../../environments/environment";
import {APIConstant} from "../../../shared/constant/api.constant";
import {ResponseApi} from "../../../shared/models/response-api.model";
import {Product} from "../../../shared/models/product.model";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {ErrorCodeConstant} from "../../../shared/constant/error-code.constant";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductStatus} from "../../../shared/enum/product-status.enum";
import {ApiErrorCode} from "../../../shared/constant/api-error-code.constant";

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {

  constructor(
      private readonly formBuilder: FormBuilder,
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      private alertService: AlertService,
      private errorService: ErrorService,
      private modalService: NgbModal,
      private router: Router,
      private activatedRoute:ActivatedRoute
      )
  {}

  async ngOnInit() {
    await this.initLoad();
    // this.initLoad();
    this.user = this.requestService.getUserToken();
    this.productLinkBusiness = await this.getMerchantLink();
    this.productLinkRoot = environment.envUrl + "/" + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_MERCHANT + '/' + this.productLinkBusiness + '/';
  }

  //modal
  @ViewChild('configurationModal') configurationModal:ElementRef;

  //loading component
  loading = true;
  pageName : String = "";

  //table pagination
  page = 1;
  pageSize = 5;
  totalData = 0;
  startData = 0;
  endData = 0;

  user = new User();
  responseApi = new ResponseApi();
  productList = new Array<Product>();
  productStatusEnum = ProductStatus;
  inputSearchProduct : string = null;

  private apiGetProduct = environment.apiUrl + APIConstant.PRODUCT;
  private apiGetMerchatLink = environment.apiUrl + APIConstant.MERCHANT_LINK;
  productLinkBusiness = "";
  modalUiIdProductActivate : string = "";
  productLinkRoot = environment.envUrl + "/" + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_MERCHANT + '/';
  //transfer variable to edit component
  public productUiId = '';

  async initLoad(){
    // await this.kybValidation();
    this.getListInventory(this.page, this.pageSize, 'DESC', this.inputSearchProduct);
    const pageName = this.activatedRoute?.snapshot?.queryParamMap?.get('pageName');
    
    this.pageName = pageName ??'list';
  }

  getListInventory(page: number, pageSize: number, sort: string, name: string) {
    let requestParam = new Map();
    requestParam.set('page', page-1);
    requestParam.set('size', pageSize);
    requestParam.set('sort', sort);
    if(name !== null){
        requestParam.set('name', name);
    }

    this.requestService.get(this.apiGetProduct, requestParam).subscribe(
        (response) => {
          this.productList = this.apiModelTranslatorService.snakeToCamelCase(response.products);
          this.totalData = response.pageable.total_data;
          this.startData = response.pageable.start_data;
          this.endData = response.pageable.end_data;
          this.loading = false;
        }
        ,
        (error) => {
            this.responseApi = error.error;
            if(this.responseApi.error.code === ApiErrorCode.MERCHANT_NOT_FOUND){
                this.router.navigate([NavigationConstant.ERROR_CUSTOM, ErrorCodeConstant.KYB]);
            }
            else if(this.responseApi.error.code === ApiErrorCode.MERCHANT_INACTIVE){
                this.modalService.open(this.configurationModal, {backdrop: 'static', keyboard: false});
            }
            else{
                this.errorService.getErrorApi(error);
            }
        }
    )
  }

  getMerchantLink() {
    return this.requestService.get(this.apiGetMerchatLink,null).toPromise().then(
        (response) => {
            return response.merchant.link;
        }
        ,
        (error) => {
            this.errorService.getErrorApi(error);
        }
    )
  }

  configurationStore(){
      window.parent.postMessage({
          func: 'onNavigation',
          url: '/' + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_CONFIGURATION,
      },"*");
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
    this.alertService.setProps("Product Link is already copied", false);
  }

  changePage(pageName:string, productUiId:string) {
      if(pageName === 'edit'){
          this.productUiId = productUiId;
      }
    this.pageName = pageName;
  }

  onPageChange(page, pageSize: number) {
    this.getListInventory(page, pageSize, 'DESC', this.inputSearchProduct);
  }

  openModalStatusProduct(idModal, productUiId:string){
    this.modalUiIdProductActivate = productUiId;
    this.modalService.open(idModal, {backdrop: 'static', keyboard: false});
  }

  activateProduct(){
    let apiUpdateProductActive = this.apiGetProduct + '/' + this.modalUiIdProductActivate + APIConstant.PRODUCT_ACTIVATE;

    this.requestService.put(apiUpdateProductActive, null, null).subscribe(
        (response) => {
          let propsAlert = "";
          if(response.current === false){
            propsAlert = "Nonaktif";
          }else{
            propsAlert = "Aktif";
          }
          this.alertService.setProps("Success! Status Product is " + propsAlert, false);
          this.getListInventory(this.page, this.pageSize, 'DESC', this.inputSearchProduct);
        }
        ,
        (error) => {
          this.errorService.getErrorApi(error);
        }
    )

  }

  decodeURI(param: string){
    return decodeURI(param);
  }

  findProductMerchant(){
      console.log(this.inputSearchProduct);
      this.getListInventory(this.page, this.pageSize, 'DESC', this.inputSearchProduct);
  }
}
