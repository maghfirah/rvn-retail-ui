import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../../../shared/models/user.model";
import {General, Location} from "../../../shared/models/location.model";
import {environment} from "../../../../environments/environment";
import {APIConstant} from "../../../shared/constant/api.constant";
import {ConfigurationStoreLocation} from "../../../shared/models/configuration-store-location.model";
import {ValidationService} from "../../../shared/service/validation.service";
import {FormControlValidationHelper} from "../../../shared/helper/form-control-validation.helper";
import {LocationType} from "../../../shared/enum/location-type.enum";
import Swal from "sweetalert2";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {Router} from "@angular/router";
import {ApiErrorCode} from "../../../shared/constant/api-error-code.constant";
import {ErrorCodeConstant} from "../../../shared/constant/error-code.constant";
import {ResponseApi} from "../../../shared/models/response-api.model";

@Component({
  selector: 'app-configuration-store-location',
  templateUrl: './configuration-store-location.component.html',
  styleUrls: ['./configuration-store-location.component.css']
})
export class ConfigurationStoreLocationComponent implements OnInit {

  constructor(
      private readonly formBuilder: FormBuilder,
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      public validationService: ValidationService,
      private alertService: AlertService,
      private errorService: ErrorService,
      private modalService: NgbModal,
      private router: Router,
  )
  {}


  ngOnInit(): void {
    this.initLoad();
  }

  //loading component
  loading = true;
  pageName : String = "";

  //image
  previewStoreImage: any;
  imageToUpload:any;
  fileData: any;

  responseApi = new ResponseApi();
  user = new User();
  infoConfigStore = new ConfigurationStoreLocation();
  private apiInfoStore = environment.apiUrl + APIConstant.MERCHANT;
  private apiGetLocation = environment.apiUrl + APIConstant.LOCATION;
  private location : Location = new Location();
  private tempGetLocation : General[] = [];
  locationType = LocationType;
  productLinkBusiness = "";
  productLinkRoot = environment.envUrl;
  storeLinkHost = "";
  public configurationStoreLocationForm: FormGroup;


  form(configStore: ConfigurationStoreLocation) {
    this.configurationStoreLocationForm = this.formBuilder.group({
      image: [null, [Validators.required]],
      link: [configStore?.link, [Validators.required, Validators.pattern, Validators.maxLength(25)]],
      phoneNumber: [configStore?.phoneNumber, [Validators.required, Validators.pattern]],
      email: [configStore?.email, [Validators.required, FormControlValidationHelper.emailValidator]],
      postalCodeCityProvince: [configStore?.postalCodeCityProvince, [Validators.required]],
      address: [configStore?.address, [Validators.required, Validators.pattern]],
    });
  }

  async initLoad(){
    let configStore : ConfigurationStoreLocation = await this.getConfigurationStoreInfo();
    this.form(configStore);
    this.user = this.requestService.getUserToken();
    this.productLinkBusiness = this.user.businessClientName;
    this.productLinkBusiness = this.productLinkBusiness.charAt(0).toUpperCase() + this.productLinkBusiness.slice(1);
    this.location.postalCodeCityProvince = await this.getLocation(this.locationType.PostalCodeCityProvince, null);
    this.storeLinkHost = this.productLinkRoot + '/' + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_MERCHANT + '/';
  }

  async getLocation(locationType:LocationType, uiId:string){
    let apiLocation = this.apiGetLocation + '/' + locationType;

    let requestParam = null;
    if(uiId !== null){
      requestParam = new Map();
      requestParam.set('uiId', uiId);
    }

    return this.requestService.get(apiLocation, requestParam).toPromise().then(
        (response) => {
          this.tempGetLocation = this.apiModelTranslatorService.snakeToCamelCase(response);
          return this.tempGetLocation;
        }
        ,
        (error) => {
          this.errorService.getErrorApi(error);
        }
    )
  }

  async changeStateLocationType(locationType:LocationType){
    if(locationType === LocationType.City){
      this.configurationStoreLocationForm.patchValue( {'city':null} );
      this.configurationStoreLocationForm.patchValue( {'district':null} );
      this.configurationStoreLocationForm.patchValue( {'subDistrict':null} );
      this.configurationStoreLocationForm.patchValue( {'postalCode':null} );
      let province = this.configurationStoreLocationForm.get('province').value;
      this.location.city = await this.getLocation(locationType, province.uiId)
    }
    else if(locationType === LocationType.District){
      this.configurationStoreLocationForm.patchValue( {'district':null} );
      this.configurationStoreLocationForm.patchValue( {'subDistrict':null} );
      this.configurationStoreLocationForm.patchValue( {'postalCode':null} );
      let city = this.configurationStoreLocationForm.get('city').value;
      this.location.district = await this.getLocation(locationType, city.uiId)
    }
    else if(locationType === LocationType.SubDistrict){
      this.configurationStoreLocationForm.patchValue( {'subDistrict':null} );
      this.configurationStoreLocationForm.patchValue( {'postalCode':null} );
      let district = this.configurationStoreLocationForm.get('district').value;
      this.location.subDistrict = await this.getLocation(locationType, district.uiId)
    }
    else if(locationType === LocationType.PostalCode){
      this.configurationStoreLocationForm.patchValue( {'postalCode':null} );
      let postalCode = this.configurationStoreLocationForm.get('subDistrict').value;
      this.location.postalCode = await this.getLocation(locationType, postalCode.uiId)
    }
  }

  submitConfigurationStoreLocation() {

    if (this.configurationStoreLocationForm.valid) {
      //set body
      let saveInfoMerchant = new ConfigurationStoreLocation();
      saveInfoMerchant.postalCodeUiId = this.configurationStoreLocationForm.get('postalCodeCityProvince').value.uiId;
      saveInfoMerchant.address = this.configurationStoreLocationForm.get('address').value;
      saveInfoMerchant.email = this.configurationStoreLocationForm.get('email').value;
      saveInfoMerchant.phoneNumber = this.configurationStoreLocationForm.get('phoneNumber').value;
      saveInfoMerchant.link = this.configurationStoreLocationForm.get('link').value;

      Swal.fire({
        title: 'Simpan Lokasi Toko?',
        text: 'Lokasi toko akan di set sebagai pengantaran barang ?',
        showCancelButton: true,
        cancelButtonText: 'BATAL',
        cancelButtonColor: '#666666',
        reverseButtons: true,
        confirmButtonColor: '#E1251B',
        confirmButtonText: 'SIMPAN',
        showLoaderOnConfirm: true,
        customClass: {
          title: 'swal2-title-modal-medium'
        },
        preConfirm: async () => {
          await this.uploadImageProduct(this.imageToUpload);
          this.requestService.post(this.apiInfoStore, null, this.apiModelTranslatorService.camelToSnakeCase(saveInfoMerchant))
              .subscribe((res) => {
                    this.router.navigate([NavigationConstant.ROUTING_CONFIGURATION]);
                    this.alertService.setProps("Success! Set Store Location", false);
                  },
                  (error) => {
                    this.errorService.getErrorApi(error);
                  });

        }
      });
    }

  }

  async uploadImageProduct(file: File){
    let urlUploadImageStore = this.apiInfoStore + APIConstant.MERCHANT_IMAGE
    return this.requestService.uploadSingleFile("image", urlUploadImageStore, file)
        .toPromise().then((res) => {

            },
            (error) => {
              this.errorService.getErrorApi(error);
            });
  }

  async getConfigurationStoreInfo() {
    return this.requestService.get(this.apiInfoStore, null).toPromise().then(
        (response) => {
          this.infoConfigStore = this.apiModelTranslatorService.snakeToCamelCase(response);
          this.previewStoreImage = this.infoConfigStore.image;
          this.loading = false;
          return this.infoConfigStore;
        }
        ,
        (error) => {
          this.responseApi = error.error;
          if(this.responseApi.error.code === ApiErrorCode.MERCHANT_NOT_FOUND){
            this.router.navigate([NavigationConstant.ERROR_CUSTOM, ErrorCodeConstant.KYB]);
          }
          else{
            this.errorService.getErrorApi(error);
          }
        }
    )
  }

  disableBtnShop() {
    if (this.infoConfigStore.link == null || this.infoConfigStore.link == ""){
      return true;
    }
  return false;
  }

  btnShopClick() {
    window.open(this.storeLinkHost+this.infoConfigStore.link, "_blank");
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    if(this.fileData !== undefined){
      this.preview();
    }
  }

  preview() {
    // Show image preview
    let mimeType = this.fileData?.type;
    if (mimeType.match('image.*') === null) {
      this.configurationStoreLocationForm.patchValue( {'image':null} );
      this.alertService.setProps("Failed Upload Type", true);
      return;
    }

    //validation > 1 mb
    if(this.fileData.size > 1000000){
      this.configurationStoreLocationForm.patchValue( {'image':null} );
      this.alertService.setProps("Size more than 1 MB", true);
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(this.fileData);

    reader.onload = (_event) => {

      //validation < 300px x 300px
      let img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const height = img.naturalHeight;
        const width = img.naturalWidth;
        if (height < 300 || width < 300) {
          this.configurationStoreLocationForm.patchValue( {'image':null} );
          this.alertService.setProps("Minimum width and height 300", true);
        } else {
          this.previewStoreImage = reader.result;
          this.imageToUpload = this.fileData;
        }
      }
    }
  }

}
