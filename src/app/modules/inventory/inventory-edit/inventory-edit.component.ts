import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {ValidationService} from "../../../shared/service/validation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {User} from "../../../shared/models/user.model";
import {environment} from "../../../../environments/environment";
import {APIConstant} from "../../../shared/constant/api.constant";
import Swal from "sweetalert2";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {Product, Variant} from "../../../shared/models/product.model";
import {ProductCondition} from "../../../shared/enum/product-condition.enum";
import {ProductStatus} from "../../../shared/enum/product-status.enum";

@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.css']
})
export class InventoryEditComponent implements OnInit {

  constructor(
      private readonly formBuilder: FormBuilder,
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      private alertService: AlertService,
      private errorService: ErrorService,
      public validationService: ValidationService,
      private modalService: NgbModal,
      private router: Router,
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
  listCategoryProduct = [];
  private editProductForm: FormGroup;
  productLinkRoot = environment.envUrl;
  productLinkBusiness = "";
  productLinkDetail = "";
  pageName : String = "";

  private apiGetProductCategory = environment.apiUrl + APIConstant.PRODUCT_CATEGORY;
  private apiGetMerchatLink = environment.apiUrl + APIConstant.MERCHANT_LINK;
  private apiProduct = environment.apiUrl + APIConstant.PRODUCT;
  productDetail : Product = new Product();
  productCondition = ProductCondition;
  productStatus = ProductStatus;

  titleInactiveVariant = "Inaktif Varian ?";
  textInactiveVariant ="Varian akan dinonaktifkan";
  confirmButtonTextInactiveVariant ="NONAKTIF";
  successAllertInactiveVariant ="Success! Inaktif Varian";

  //get variable from add component (parent)
  @Input() productUiId: string;

  async initLoad(){
    let product : Product = await this.getDetailProduct();
    await this.getListCategoryProduct();
    this.form(product);
    this.user = this.requestService.getUserToken();
    this.productLinkBusiness = await this.getMerchantLink();
    this.productLinkDetail = this.productLinkRoot + '/' + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_MERCHANT + '/' + this.productLinkBusiness + '/' + this.productDetail.link;
  }

  form(product:Product) {
    this.editProductForm = this.formBuilder.group({
      name: [product?.name, [Validators.required, Validators.pattern]],
      category: [product?.category, [Validators.required]],
      digitalGoods: [product?.variants[0].digitalGoods, [Validators.required]],
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
      active:[variant.active],
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

  submitEditProduct() {
    if (this.editProductForm.valid) {
      let encodedLink = encodeURI(this.editProductForm.get("link").value);
      this.editProductForm.patchValue({'link':encodedLink})

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
    return this.requestService.uploadSingleFile("image",apiSubmitProduct + '/' + productUiId + APIConstant.PRODUCT_IMAGES, file, index)
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

  addNewVariant() {
    let lengthVariant = this.variants.length;
    if(lengthVariant < 5){
      this.variants.push(this.initVariantsProduct(new Variant()));
      this.validateDigitalGoods();
    }
  }

  deleteVariant() {
    let index = this.variants.length - 1;
    this.variants.removeAt(index);
  }

  inactiveVariant(variantUiId:string, id:string) {
    const ele = document.getElementById(id) as HTMLInputElement;
    if(ele.checked){
      this.titleInactiveVariant ="Aktif Variant ?";
      this.textInactiveVariant ="Variant akan diaktifkan";
      this.confirmButtonTextInactiveVariant ="AKTIF";
      this.successAllertInactiveVariant ="Success! Aktif Varian"
    }
    else {
      this.titleInactiveVariant = "Inaktif Varian ?";
      this.textInactiveVariant ="Varian akan dinonaktifkan";
      this.confirmButtonTextInactiveVariant ="NONAKTIF";
      this.successAllertInactiveVariant ="Success! Inaktif Varian";
    }
    Swal.fire({
      title: this.titleInactiveVariant,
      text: this.textInactiveVariant,
      showCancelButton: true,
      cancelButtonText: 'BATAL',
      cancelButtonColor: '#666666',
      reverseButtons: true,
      confirmButtonColor: '#E1251B',
      confirmButtonText: this.confirmButtonTextInactiveVariant,
      showLoaderOnConfirm: true,
      customClass: {
        title: 'swal2-title-modal-medium'
      },
      preConfirm: async () => {
        console.log(id)
        let apiInactiveVariant = environment.apiUrl + APIConstant.PRODUCT_VARIANT + '/' + variantUiId + APIConstant.PRODUCT_ACTIVATE;
        this.requestService.put(apiInactiveVariant, null, null)
            .subscribe((res) => {
                  this.router.navigate([NavigationConstant.ROUTING_INVENTORY]);
                  ele.checked = res.current;
                  this.alertService.setProps(this.successAllertInactiveVariant, false);
                },
                (error) => {
                  ele.checked = !ele.checked;
                  this.errorService.getErrorApi(error);
                });
      }
    }).then(function (result) {
      if (result.isDismissed) {
        ele.checked = !ele.checked;
      }
    });
  }

  validateDigitalGoods(){
    this.variants.controls.forEach((element, index) => {
      if(this.editProductForm.get('digitalGoods').value === true){
        element.patchValue({'width':1});
        element.patchValue({'height':1});
        element.patchValue({'length':1});
        element.patchValue({'weight':1});
      }else{
        element.patchValue({'width':""});
        element.patchValue({'height':""});
        element.patchValue({'length':""});
        element.patchValue({'weight':""});
      }
    })
  }

  openProductLinkDetail(){
    window.open(this.productLinkDetail);
  }

}
