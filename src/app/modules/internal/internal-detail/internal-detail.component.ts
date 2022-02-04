import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {ValidationService} from "../../../shared/service/validation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../../../shared/models/user.model";
import {environment} from "../../../../environments/environment";
import {APIConstant} from "../../../shared/constant/api.constant";
import {Product, Variant} from "../../../shared/models/product.model";
import {CategoryProduct} from "../../../shared/enum/category-product.enum";
import {ProductCondition} from "../../../shared/enum/product-condition.enum";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import Swal from "sweetalert2";
import {ProductStatus} from "../../../shared/enum/product-status.enum";
import {DeclineReason} from "../../../shared/enum/decline-reason.enum";
import {ValidateProduct} from "../../../shared/models/validate-product.model";
import {CategoryInternal} from "../../../shared/models/category-internal.model";

@Component({
  selector: 'app-internal-detail',
  templateUrl: './internal-detail.component.html',
  styleUrls: ['./internal-detail.component.css']
})
export class InternalDetailComponent implements OnInit {

  constructor(
      private readonly formBuilder: FormBuilder,
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      private alertService: AlertService,
      private errorService: ErrorService,
      public validationService: ValidationService,
      private modalService: NgbModal,
      private router: Router,
      private activatedRoute: ActivatedRoute,
  )
  { }

  ngOnInit(): void {
    this.pageName = 'edit';
    this.initLoad();
  }

  //loading component
  loading = true;

  //image
  fileData: any;
  imageToUpload1:any;
  imageToUpload2:any;
  imageToUpload3:any;
  previewImageProduct1: any;
  previewImageProduct2: any;
  previewImageProduct3: any;

  user = new User();
  listCategoryProduct : CategoryInternal[] = [];
  private editProductForm: FormGroup;
  productLinkRoot = environment.envUrl;
  productLinkBusiness = "";
  productLinkHost = "";
  pageName : String = "";

  private apiGetProductCategory = environment.apiUrl + APIConstant.INTERNAL + APIConstant.INTERNAL_CATEGORY;
  private apiProduct = environment.apiUrl + APIConstant.INTERNAL+ APIConstant.PRODUCT;
  productDetail : Product = new Product();
  categoryDigitalGoods = CategoryProduct;
  productCondition = ProductCondition;
  declineReasonEnum = DeclineReason;
  declineReason : string = null;
  otherDeclineReasonText : string = "";

  //get variable from add component (parent)
  @Input() productUiId: string;

  async initLoad(){
    let product : Product = await this.getDetailProduct();
    await this.getListCategoryProduct();
    this.form(product);
    this.user = this.requestService.getUserToken();
    this.productLinkBusiness = product.merchantLink;
    this.productLinkHost = this.productLinkRoot + '/' + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_MERCHANT + '/' + this.productLinkBusiness + '/';
  }

  form(product:Product) {
    this.editProductForm = this.formBuilder.group({
      code: [product?.code, [Validators.required, Validators.pattern]],
      name: [product?.name, [Validators.required, Validators.pattern]],
      category: [product?.category, [Validators.required]],
      digitalGoods: [null],
      description: [product?.description, [Validators.required, Validators.pattern]],
      link: [product?.link, [Validators.required, Validators.pattern]],
      image1: [null],
      uiId: [this.productUiId],
      condition: [product?.condition, [Validators.required]],
      variants: this.formBuilder.array(product.variants.map(variant => this.initVariantsProduct(variant)))
    });
  }

  initVariantsProduct(variant: Variant) {
    return this.formBuilder.group({
      uiId: [variant.uiId, [Validators.required]],
      color: [variant.color, [Validators.required, Validators.pattern]],
      minimumOrder: [variant.minimumOrder, [Validators.required, Validators.pattern]],
      length: [variant.length, [Validators.required, Validators.pattern]],
      width: [variant.width, [Validators.required, Validators.pattern]],
      height: [variant.height, [Validators.required, Validators.pattern]],
      stock: [variant.stock, [Validators.required, Validators.pattern]],
      price: [variant.price, [Validators.required, Validators.pattern, Validators.min(10000)]],
      weight: [variant.weight, [Validators.required, Validators.pattern]],
    });
  }

  getListCategoryProduct() {
    this.requestService.get(this.apiGetProductCategory,null).subscribe(
        (response) => {
          this.listCategoryProduct = response;
          this.loading = false;
        }
        ,
        (error) => {
          this.errorService.getErrorApi(error);
        }
    )
  }

  async getDetailProduct() {
    let apiDetailProduct = this.apiProduct + '/' + this.productUiId + APIConstant.PRODUCT_DETAIL;

    return this.requestService.get(apiDetailProduct,null).toPromise().then(
        (response) => {
          this.productDetail = this.apiModelTranslatorService.snakeToCamelCase(response);
          this.productDetail.link = decodeURI(this.productDetail.link)
          this.previewImageProduct1 = this.productDetail.images[0]?.url;
          this.previewImageProduct2 = this.productDetail.images[1]?.url;
          this.previewImageProduct3 = this.productDetail.images[2]?.url;
          return this.productDetail;
        }
        ,
        (error) => {
          this.errorService.getErrorApi(error);
        }
    )
  }

  submitEditProduct() {
    if (this.editProductForm.valid) {
      let encodedLink = encodeURI(this.editProductForm.get("link").value);
      this.editProductForm.patchValue({'link':encodedLink})

      if(this.editProductForm.get('category').value === this.categoryDigitalGoods.DigitalGoods){
        this.editProductForm.patchValue({'digitalGoods':true})
      }else{
        this.editProductForm.patchValue({'digitalGoods':false})
      }

      Swal.fire({
        title: 'Ubah Produk?',
        text: 'Informasi produk akan berubah dan ditampilkan ke website Pelanggan',
        showCancelButton: true,
        cancelButtonText: 'BATAL',
        cancelButtonColor: '#666666',
        reverseButtons: true,
        confirmButtonColor: '#E1251B',
        confirmButtonText: 'UBAH',
        showLoaderOnConfirm: true,
        customClass: {
          title: 'swal2-title-modal-medium'
        },
        preConfirm: async () => {
          this.requestService.put(this.apiProduct, null, this.apiModelTranslatorService.camelToSnakeCase(this.editProductForm.value))
              .subscribe((res) => {

                    this.router.navigate([NavigationConstant.ROUTING_INVENTORY]);
                    this.alertService.setProps("Success! Edit Produk", false);
                  },
                  (error) => {
                    this.errorService.getErrorApi(error);
                  });

          // upload image product 1
          if (this.imageToUpload1 !== null && this.imageToUpload1 !== undefined) {
            await this.uploadImageProduct(this.productUiId, this.imageToUpload1,"0");
          }

          //upload image product 2
          if (this.imageToUpload2 !== null && this.imageToUpload2 !== undefined) {
            await this.uploadImageProduct(this.productUiId, this.imageToUpload2,"1");
          }

          //upload image product 3
          if (this.imageToUpload3 !== null && this.imageToUpload3 !== undefined) {
            await this.uploadImageProduct(this.productUiId, this.imageToUpload3,"2");
          }
        }
      });
    }
  }

  async uploadImageProduct(productUiId: string, file: File, index: string){
    let apiSubmitProduct = environment.apiUrl + APIConstant.PRODUCT;
    return this.requestService.uploadSingleFile("image",apiSubmitProduct + '/' + productUiId + APIConstant.PRODUCT_IMAGES, file,index)
        .toPromise().then((res) => {
            },
            (error) => {
              this.errorService.getErrorApi(error);
            });
  }

  changePage(pageName:String) {
    this.pageName = pageName;
  }

  fileProgress(fileInput: any, name:string) {
    this.fileData = <File>fileInput.target.files[0];
    if(this.fileData !== undefined){
      this.preview(name);
    }
  }

  preview(name:string) {
    let mimeType = this.fileData?.type;

    let reader = new FileReader();
    reader.readAsDataURL(this.fileData);

    reader.onload = (_event) => {

      let img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const height = img.naturalHeight;
        const width = img.naturalWidth;
        if(name === 'previewImageProduct1'){
          if (mimeType.match('image.*') === null) {
            this.editProductForm.patchValue( {'image1':null} );
            this.alertService.setProps("Failed Upload Type", true);
          }
          else if(this.fileData.size > 1000000){
            this.editProductForm.patchValue( {'image1':null} );
            this.alertService.setProps("Size more than 1 MB", true);
          }
          else if(height < 300 || width < 300){
            this.editProductForm.patchValue( {'image1':null} );
            this.alertService.setProps("Dimension less than 300 x 300 pixels", true);
          }
          else{
            this.previewImageProduct1 = reader.result;
            this.imageToUpload1 = this.fileData;
          }
        }
        else if(name === 'previewImageProduct2'){
          if (mimeType.match('image.*') === null) {
            this.editProductForm.patchValue( {'image2':null} );
            this.alertService.setProps("Failed Upload Type", true);
          }
          else if(this.fileData.size > 1000000){
            this.editProductForm.patchValue( {'image2':null} );
            this.alertService.setProps("Size more than 1 MB", true);
          }
          else if(height < 300 || width < 300){
            this.editProductForm.patchValue( {'image2':null} );
            this.alertService.setProps("Dimension less than 300 x 300 pixels", true);
          }
          else {
            this.previewImageProduct2 = reader.result;
            this.imageToUpload2 = this.fileData;
          }
        }
        else if(name === 'previewImageProduct3'){
          if (mimeType.match('image.*') === null) {
            this.editProductForm.patchValue( {'image3':null} );
            this.alertService.setProps("Failed Upload Type", true);
          }
          else if(this.fileData.size > 1000000){
            this.editProductForm.patchValue( {'image3':null} );
            this.alertService.setProps("Size more than 1 MB", true);
          }
          else if(height < 300 || width < 300){
            this.editProductForm.patchValue( {'image3':null} );
            this.alertService.setProps("Dimension less than 300 x 300 pixels", true);
          }
          else {
            this.previewImageProduct3 = reader.result;
            this.imageToUpload3 = this.fileData;
          }
        }
      };

    }
  }

  get variants() {
    return this.editProductForm.get('variants') as FormArray;
  }

  inactiveVariant(variantUiId:string) {
  }

  validateDigitalGoods(){
    this.variants.controls.forEach((element, index) => {
      if(this.editProductForm.get('category').value === this.categoryDigitalGoods.DigitalGoods){
        element.patchValue({'width':1});
        element.patchValue({'height':1});
        element.patchValue({'length':1});
        element.patchValue({'weight':1});
      }
    })
  }

  openModalStatusProduct(idModal){
    this.modalService.open(idModal, {backdrop: 'static', keyboard: false});
  }

  submitDeclineProduct(){
    let notes = "";
    if(this.declineReason === this.declineReasonEnum.Others){
      notes = this.otherDeclineReasonText;
    }else{
      notes = this.declineReason;
    }
    this.validateProduct(notes, ProductStatus.REJECTED);
    this.modalService.dismissAll();
  }

  submitApproveProduct(){
    this.validateProduct(null, ProductStatus.APPROVED);
    this.modalService.dismissAll();
  }


  validateProduct(notes:string, status:ProductStatus) {
    let apiInternalValidate = this.apiProduct + '/' + this.productUiId + APIConstant.INTERNAL_VALIDATE;
    let validateProduct = new ValidateProduct();
    validateProduct.notes = notes;
    validateProduct.status = ProductStatus.valueOf(status);
    return this.requestService.post(apiInternalValidate,null, this.apiModelTranslatorService.camelToSnakeCase(validateProduct)).subscribe(
        (response) => {
          this.alertService.setProps("Success! Produk Status " + status, false);
          this.changePage('list')
        }
        ,
        (error) => {
          this.errorService.getErrorApi(error);
        }
    )
  }
}
