import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {environment} from "../../../../environments/environment";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {User} from "../../../shared/models/user.model";
import {ResponseApi} from "../../../shared/models/response-api.model";
import {Product} from "../../../shared/models/product.model";
import {ProductStatus} from "../../../shared/enum/product-status.enum";
import {APIConstant} from "../../../shared/constant/api.constant";
import {ProductCondition} from "../../../shared/enum/product-condition.enum";
import {FilterStatus} from "../../../shared/enum/filter-status.enum";

@Component({
  selector: 'app-internal-list',
  templateUrl: './internal-list.component.html',
  styleUrls: ['./internal-list.component.css']
})
export class InternalListComponent implements OnInit {

  constructor(
      private readonly formBuilder: FormBuilder,
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      private alertService: AlertService,
      private errorService: ErrorService,
  )
  {}

  async ngOnInit() {
    await this.initLoad();
    this.user = this.requestService.getUserToken();
    this.productLinkRoot = environment.envUrl + "/" + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_MERCHANT + '/';
  }

  //loading component
  loading = true;
  pageName : String = "";

  //table pagination
  page = 1;
  pageSize = 5;
  totalData = 0;
  startData = 0;
  endData = 0;

  //filter field
  filterProductName : string = null;
  filterProductStatus : FilterStatus[] = [];
  filterProductActive : boolean = null;
  filterProductCategory : string = null;
  filterProductLink : string = null;
  filterProductCondition : ProductCondition = null;
  filterProductStock : number = null;
  filterChkWaiting : boolean = true;
  filterChkActive : boolean = true;
  filterChkNonActive : boolean = true;
  filterChkRejected : boolean = true;
  paginationSort : string = "DESC";

  productUiId : string;
  user = new User();
  responseApi = new ResponseApi();
  productList = new Array<Product>();
  productStatusEnum = ProductStatus;

  private apiInternalGetProduct = environment.apiUrl + APIConstant.INTERNAL_LIST;
  productLinkRoot = environment.envUrl + "/" + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_MERCHANT + '/';

  async initLoad(){
    this.pageName = 'list';
    this.getListInventory(this.page, this.pageSize, this.paginationSort, null, null, null, null, null, null);
  }

  getListInventory(page: number, pageSize: number, sort: string, productName: string, filters:FilterStatus[], category: string, link:string, condition:ProductCondition, stock: number) {
    this.loading = true;
    let requestParam = new Map();
    requestParam.set('page', page-1);
    requestParam.set('size', pageSize);
    requestParam.set('sort', sort);

    //filter nama produk
    if(productName !== null && productName !== ""){
      requestParam.set('name', productName);
    }

    //filter aktif produk
    if(filters !== null){
      requestParam.set('filters', filters);
    }

    this.requestService.get(this.apiInternalGetProduct, requestParam).subscribe(
        (response) => {
          this.productList = this.apiModelTranslatorService.snakeToCamelCase(response.products);
          this.totalData = response.pageable.total_data;
          this.startData = response.pageable.start_data;
          this.endData = response.pageable.end_data;
          this.loading = false;
        }
        ,
        (error) => {
          this.loading = false;
          this.responseApi = error.error;
          this.errorService.getErrorApi(error);
        }
    )
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

  onPageChange(page, pageSize: number) {
    this.getListInventory(page, pageSize, this.paginationSort, this.filterProductName, this.filterProductStatus, this.filterProductCategory, this.filterProductLink, this.filterProductCondition, this.filterProductStock);
  }

  decodeURI(param: string){
    return decodeURI(param);
  }

  findProduct(){
    this.filterProductStatus = [];
    let filterProduct : FilterStatus;

    //product status aktif
    if(this.filterChkActive === true){
      filterProduct = FilterStatus.Active;
      this.filterProductStatus.push(filterProduct);
    }

    //product status non aktif
    if(this.filterChkNonActive === true){
      filterProduct = FilterStatus.Inactive;
      this.filterProductStatus.push(filterProduct);
    }

    //product status waiting
    if(this.filterChkWaiting === true){
      filterProduct = FilterStatus.Waiting;
      this.filterProductStatus.push(filterProduct);
    }

    //product status reject
    if(this.filterChkRejected === true){
      filterProduct = FilterStatus.Rejected;
      this.filterProductStatus.push(filterProduct);
    }

    this.getListInventory(this.page, this.pageSize, this.paginationSort, this.filterProductName, this.filterProductStatus, this.filterProductCategory, this.filterProductLink, this.filterProductCondition, this.filterProductStock);

  }

  changePage(pageName:string, productUiId:string){
    if(pageName === 'edit'){
      this.productUiId = productUiId;
    }
    this.pageName = pageName;
  }
}
