import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {ValidationService} from "../../../shared/service/validation.service";
import {User} from "../../../shared/models/user.model";
import Swal from 'sweetalert2';
import {environment} from "../../../../environments/environment";
import {APIConstant} from "../../../shared/constant/api.constant";
import {ProductCondition} from "../../../shared/enum/product-condition.enum";
import { Router } from '@angular/router';
import { NavigationConstant } from 'src/app/shared/constant/navigation.constant';

@Component({
  selector: 'app-inventory-add',
  templateUrl: './inventory-add.component.html',
  styleUrls: ['./inventory-add.component.css']
})
export class InventoryAddComponent implements OnInit {

  constructor(
      private readonly formBuilder: FormBuilder,
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      private alertService: AlertService,
      private errorService: ErrorService,
      public validationService: ValidationService,
      private router: Router
      )
  { }

  ngOnInit(): void {
    this.pageName = 'add';
    this.initLoad();
    this.form();
  }

  //loading component
  loading = true;

  user = new User();
  listCategoryProduct = [];
  public addProductForm: FormGroup;
  pageName : String = "";
  fileData: any;
  imageToUpload1:any;
  imageToUpload2:any;
  imageToUpload3:any;
  previewImageProduct1: any;
  previewImageProduct2: any;
  previewImageProduct3: any;
  private apiGetProductCategory = environment.apiUrl + APIConstant.PRODUCT_CATEGORY;
  private apiSubmitProduct = environment.apiUrl + APIConstant.PRODUCT;
  productCondition = ProductCondition;

  async initLoad(){
    await this.getListCategoryProduct();
    this.user = this.requestService.getUserToken();
    this.loading = false;
  }

  form() {
    this.addProductForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern]],
      category: [null, [Validators.required]],
      digitalGoods: [null, [Validators.required]],
      description: [null, [Validators.required, Validators.pattern]],
      image1: [null, [Validators.required]],
      image2: [null],
      image3: [null],
      condition: [null, [Validators.required]],
      variants: this.formBuilder.array([this.initVariantsProduct()])
    });
  }

  initVariantsProduct() {
    return this.formBuilder.group({
      color: [null, [Validators.required, Validators.pattern]],
      minimumOrder: [null, [Validators.required, Validators.pattern]],
      length: [null, [Validators.required, Validators.pattern]],
      width: [null, [Validators.required, Validators.pattern]],
      height: [null, [Validators.required, Validators.pattern]],
      stock: [null, [Validators.required, Validators.pattern]],
      price: [null, [Validators.required, Validators.pattern, Validators.min(10000)]],
      weight: [null, [Validators.required, Validators.pattern]],
    });
  }

  getListCategoryProduct() {
    this.requestService.get(this.apiGetProductCategory,null).subscribe(
        (response) => {
          this.listCategoryProduct = response;
        }
        ,
        (error) => {
          this.errorService.getErrorApi(error);
        }
    )
  }

  validateDigitalGoods(){
      this.variants.controls.forEach((element, index) => {
        if(this.addProductForm.get('digitalGoods').value === true){
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

  async submitAddProduct(page: string) {
    if (this.addProductForm.valid) {
      let productUiId = null;

      Swal.fire({
        title: 'Tambahkan Produk Baru?',
        text: 'Produk akan ditampilkan dan siap untuk dijual ke Pelanggan ?',
        showCancelButton: true,
        cancelButtonText: 'BATAL',
        cancelButtonColor: '#666666',
        reverseButtons: true,
        confirmButtonColor: '#E1251B',
        confirmButtonText: 'TAMBAHKAN',
        showLoaderOnConfirm: true,
        customClass: {
          title: 'swal2-title-modal-medium'
        },
        preConfirm: async () => {
          await this.requestService.post(this.apiSubmitProduct, null, this.apiModelTranslatorService.camelToSnakeCase(this.addProductForm.value))
              .toPromise().then(async (response) => {
                    productUiId = response.product.detail.uuid;
                  },
                  (error) => {
                    this.errorService.getErrorApi(error);
                  });

          // upload image product 1
          await this.uploadImageProduct(productUiId, this.imageToUpload1,"0");

          //upload image product 2
          if (this.imageToUpload2 !== null && this.imageToUpload2 !== undefined) {
            await this.uploadImageProduct(productUiId, this.imageToUpload2,"1");
          }

          //upload image product 3
          if (this.imageToUpload3 !== null && this.imageToUpload3 !== undefined) {
            await this.uploadImageProduct(productUiId, this.imageToUpload3,"2");
          }

          this.changePage(page);
          this.alertService.setProps("Success! Add Product", false);
        }
      });
    }
  }

  async uploadImageProduct(productUiId: string, file: File, index: string){
    return this.requestService.uploadSingleFile("image",this.apiSubmitProduct + '/' + productUiId + APIConstant.PRODUCT_IMAGES, file,index)
        .toPromise().then((res) => {

            },
            (error) => {
              this.errorService.getErrorApi(error);
            });
  }

  changePage(pageName:String) {
    this.router.navigate([NavigationConstant.ROUTING_INVENTORY]);
    this.pageName = pageName
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
              this.addProductForm.patchValue( {'image1':null} );
              this.alertService.setProps("Failed Upload Type", true);
            }
            else if(this.fileData.size > 1000000){
              this.addProductForm.patchValue( {'image1':null} );
              this.alertService.setProps("Size more than 1 MB", true);
            }
            else if(height < 300 || width < 300){
              this.addProductForm.patchValue( {'image1':null} );
              this.alertService.setProps("Dimension less than 300 x 300 pixels", true);
            }
            else{
              this.previewImageProduct1 = reader.result;
              this.imageToUpload1 = this.fileData;
            }
          }
          else if(name === 'previewImageProduct2'){
            if (mimeType.match('image.*') === null) {
              this.addProductForm.patchValue( {'image2':null} );
              this.alertService.setProps("Failed Upload Type", true);
            }
            else if(this.fileData.size > 1000000){
              this.addProductForm.patchValue( {'image2':null} );
              this.alertService.setProps("Size more than 1 MB", true);
            }
            else if(height < 300 || width < 300){
              this.addProductForm.patchValue( {'image2':null} );
              this.alertService.setProps("Dimension less than 300 x 300 pixels", true);
            }
            else {
              this.previewImageProduct2 = reader.result;
              this.imageToUpload2 = this.fileData;
            }
          }
          else if(name === 'previewImageProduct3'){
            if (mimeType.match('image.*') === null) {
              this.addProductForm.patchValue( {'image3':null} );
              this.alertService.setProps("Failed Upload Type", true);
            }
            else if(this.fileData.size > 1000000){
              this.addProductForm.patchValue( {'image3':null} );
              this.alertService.setProps("Size more than 1 MB", true);
            }
            else if(height < 300 || width < 300){
              this.addProductForm.patchValue( {'image3':null} );
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
    return this.addProductForm.get('variants') as FormArray;
  }

  addNewVariant() {
    let lengthVariant = this.variants.length;
    if(lengthVariant < 5) {
      this.variants.push(this.initVariantsProduct());
      this.validateDigitalGoods();
    }
  }

  deleteVariant() {
    let index = this.variants.length - 1;
    this.variants.removeAt(index);
  }
}
