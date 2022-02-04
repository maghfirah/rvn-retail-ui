import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MerchantInfo} from "../../../shared/models/merchant-info.model";
import {APIConstant} from "../../../shared/constant/api.constant";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {environment} from "../../../../environments/environment";
import {MerchantProduct} from "../../../shared/models/merchant-product.model";
import {MerchantProductCategory} from "../../../shared/models/merchant-product-category.model";
import {ApiErrorCode} from "../../../shared/constant/api-error-code.constant";
import {ResponseApi} from "../../../shared/models/response-api.model";
import {SortByEnum} from "../../../shared/enum/sortBy.enum";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-merchant-shop-prod',
  templateUrl: './merchant-shop-prod.component.html',
  styleUrls: ['./merchant-shop-prod.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MerchantShopProdComponent implements OnInit {

  constructor(
      private readonly formBuilder: FormBuilder,
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      private alertService: AlertService,
      private errorService: ErrorService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private cookieService: CookieService,
  ) { }

  async ngOnInit() {
    await this.initLoad();
    this.unwrap(document.querySelector('.content-wrapper'))
    this.pageName = 'merchant-shop';

  }

    unwrap(wrapper) {
        // place childNodes in document fragment
        if (wrapper !== null) {
            var docFrag = document.createDocumentFragment();
            while (wrapper.firstChild) {
                var child = wrapper.removeChild(wrapper.firstChild);
                docFrag.appendChild(child);
            }

            // replace wrapper with document fragment
            wrapper.parentNode.replaceChild(docFrag, wrapper);
        }
    }

  apiLinkGetMerchantDetail = environment.apiUrl + APIConstant.LINK;
  apiLinkGetMerchantProducts = environment.apiUrl + APIConstant.LINK;

  //loading component
  loading = true;

  //page
  pageName : String = "";

  responseApi = new ResponseApi();
  merchantLink = "";
  private merchantInfo : MerchantInfo = new MerchantInfo();
  originalProductList = new Array<MerchantProduct>();
  filterProductList = new Array<MerchantProduct>();
  merchantProductCategory = new Array<MerchantProductCategory>();
  inputSearch = "";
  showBackdrop = false;
  showBottomSheetFilter = false;
  showBottomSheetSort = false;
  sheetHeight = 0;
  shortingValue = "";
  categoryValue = "noFilter";
  sortByEnum = SortByEnum;


  async initLoad() {
    await this.activatedRoute.params.subscribe((params: Params) => {
      this.merchantLink = params['businessName'];
    });
      this.merchantInfo = await this.getMerchantInfo();
      this.filterProductList = await this.getMerchantProducts();
      this.loading = false;

  }

  private async getMerchantInfo() {
    let apiGetMerchantInfo = this.apiLinkGetMerchantDetail + '/' + this.merchantLink + APIConstant.LINK_MERCHANT_DETAIL ;

    return this.requestService.get(apiGetMerchantInfo,null).toPromise().then(
        (response) => {
            this.merchantInfo = this.apiModelTranslatorService.snakeToCamelCase(response);
            return this.merchantInfo;
        }
        ,
        (error) => {
          this.responseApi = error.error;
          if(this.responseApi.error.code === ApiErrorCode.LINK_MERCHANT_NOT_FOUND){
              this.router.navigate([NavigationConstant.ROUTING_MERCHANT_NOT_FOUND+'/'+this.merchantLink]);
          }
          else {
            this.errorService.getErrorApi(error);
          }
        }
    )
  }

  private async getMerchantProducts() {
    let apiGetMerchantProducts = this.apiLinkGetMerchantProducts + '/' + this.merchantLink + APIConstant.LINK_MERCHANT_PRODUCTS ;

    return this.requestService.get(apiGetMerchantProducts,null).toPromise().then(
        (response) => {
            this.originalProductList = this.apiModelTranslatorService.snakeToCamelCase(response);
            this.originalProductList.forEach(product => product.variants.sort((a, b) => a.price - b.price));
            return this.originalProductList;
          }
        ,
        (error) => {
          this.responseApi = error.error;
          if(this.responseApi.error.code === ApiErrorCode.LINK_MERCHANT_NOT_FOUND){
              this.router.navigate([NavigationConstant.ROUTING_MERCHANT_NOT_FOUND+'/'+this.merchantLink]);
          }
          else {
            this.errorService.getErrorApi(error);
          }
        }
    )
  }
  clickProductName(link){
    this.router.navigate([this.router.url + '/' + link]);
  }

  convertPriceValue(price) {
      return price.toLocaleString('id-ID', {currency: 'IDR', style: 'currency'}).slice(0, -3);
  }

  async toggleBtmSheetFilter(){
      if (!this.showBottomSheetFilter) {
          this.merchantProductCategory = await this.getCategory()
      }
    this.showBottomSheetFilter = !this.showBottomSheetFilter;
  }

  toggleBtmSheetSort(){
    this.showBackdrop = !this.showBackdrop;
    this.showBottomSheetSort = !this.showBottomSheetSort;
  }

  orderProductBy(value){
    if(value === this.sortByEnum.NEWEST_PRODUCT){
        this.filterProductList.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    }
    else if(value === this.sortByEnum.BEST_SELLER_PRODUCT){
        this.filterProductList.sort((a, b) => b.soldProduct - a.soldProduct);
    }
    else if(value === this.sortByEnum.LOWEST_PRICE){
        this.filterProductList.sort((a, b) => a.variants[0].price - b.variants[0].price);
    }
    else if(value === this.sortByEnum.HIGHEST_PRICE){
        this.filterProductList.sort((a, b) => b.variants[0].price - a.variants[0].price);
    }
    this.shortingValue = value;
    // this.showBottomSheetSort = false;
  }

  filterProductBy(value){
      if(value === "noFilter"){
          this.filterProductList = this.originalProductList;
      }
      else{
          this.filterProductList = this.originalProductList.filter(product =>product.category == value);
      }
      this.categoryValue = value;
      // this.showBottomSheetFilter = false;
  }

  checkedFilterProductBy(value){
      if (value === this.categoryValue){
          return true
      }
      return false;
  }

  checkSortingValueChoose(value){
      if (value === this.shortingValue){
          return true
      }
      return false;
  }

  private async getCategory() {
    let apiGetCategory = this.apiLinkGetMerchantDetail + '/' + this.merchantLink + APIConstant.LINK_MERCHANT_CATEGORY ;

    return this.requestService.get(apiGetCategory,null).toPromise().then(
        (response) => {
            this.merchantProductCategory = this.apiModelTranslatorService.snakeToCamelCase(response);
            return this.merchantProductCategory;
        }
        ,
        (error) => {
          this.errorService.getErrorApi(error);
        }
    )
  }

    btnCart() {
        this.cookieService.set("merchantLink", this.merchantLink);
        this.router.navigate([NavigationConstant.ROUTING_MERCHANT_CART]);
    }
}
