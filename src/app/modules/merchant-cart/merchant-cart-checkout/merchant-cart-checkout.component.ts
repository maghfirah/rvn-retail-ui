import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ValidationService} from "../../../shared/service/validation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../../../environments/environment";
import {APIConstant} from "../../../shared/constant/api.constant";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {General, Location as LocationModel} from "../../../shared/models/location.model";
import {LocationType} from "../../../shared/enum/location-type.enum";
import {Cart} from "../../../shared/models/cart.model";
import {Detail, Shipping, Type} from "../../../shared/models/shipping.model";
import {FormControlValidationHelper} from "../../../shared/helper/form-control-validation.helper";
import {AddOrder} from "../../../shared/models/add-order.model";
import {Checkout} from "../../../shared/models/checkout.model";
import {formatDate, Location} from "@angular/common";

@Component({
  selector: 'app-merchant-cart-checkout',
  templateUrl: './merchant-cart-checkout.component.html',
  styleUrls: ['./merchant-cart-checkout.component.css']
})
export class MerchantCartCheckoutComponent implements OnInit {
  constructor(
      private readonly formBuilder: FormBuilder,
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      private alertService: AlertService,
      private errorService: ErrorService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private validationService: ValidationService,
      private modalService: NgbModal,
      private cookieService: CookieService,
      private locationRoute: Location
  )
  { }

  async ngOnInit() {
    await this.initLoad();
    this.pageName = 'merchant-checkout';
  }

  //get variable from add component (parent)
  @ViewChild('successCheckout') successCheckout:ElementRef;

  //loading component
  loading = true;

  //page
  pageName : String = "";

  //form
  public checkoutForm: FormGroup;

  private apiGetLocation = environment.apiUrl + APIConstant.LOCATION;
  private apiCart = environment.apiUrl + APIConstant.CART;

  private urlTermsAndCondition = environment.envUrl + "/" + NavigationConstant.ROUTING_RETAIL + "/" + NavigationConstant.ROUTING_TERMS_CONDITION;
  private urlPrivacyPolicy = 'https://jokul.doku.com/jokul-agreement/privacy-policy';

  isChecked = false;
  ongkosKirim : number = 0;

  private tempGetLocation : General[] = [];
  locationType = LocationType;
  private location : LocationModel = new LocationModel();
  cartId : string = "";
  shipping : Shipping = new Shipping();
  selectedShipping : Type = null;
  tempSelectedShipping : Type = null;
  maxDays : string = "";
  minDays : string = "";
  staticLink : string = "";
  merchantLink : string = "";
  cartProduct: Cart = new Cart();
  isDigitalGoods: boolean = false;
  merchantName:string = ""
  async initLoad(){
    this.merchantName = localStorage.getItem("merchantName");
    this.merchantLink = localStorage.getItem("merchantLink");
    this.cartId = localStorage.getItem('cart_id_' + this.merchantName);
    if (this.cartId == '') {
      this.locationRoute.back();
    }
    await this.getCart(this.cartId);
    this.isDigitalGoods = this.cartProduct.digitalGoods;
    this.form();
    if (!this.isDigitalGoods){
      this.checkoutForm.controls['shipping'].setValidators([Validators.required]);
      this.checkoutForm.updateValueAndValidity();
    }
    this.location.postalCode = await this.getLocation(this.locationType.PostalCodeCityProvince, null);
    this.loading = false;
  }

  form() {
    this.checkoutForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern]],
      phoneNumber: [null, [Validators.required, Validators.pattern]],
      email: [null, [Validators.required, FormControlValidationHelper.emailValidator]],
      postalCode: [null, {disabled: this.isDigitalGoods}, [Validators.required]],
      address: [null, {disabled: this.isDigitalGoods}, [Validators.required, Validators.pattern]],
      notes: [null, [Validators.pattern]],
      shipping: [null],
    });
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

  async getCart(cartId:string){
    let requestParam = null;
    if(cartId !== ""){
      requestParam = new Map();
      requestParam.set('cartId', cartId);
    }

    return this.requestService.get(this.apiCart, requestParam).toPromise().then(
        (response) => {
          this.cartProduct = this.apiModelTranslatorService.snakeToCamelCase(response);
        }
        ,
        (error) => {
          this.errorService.getErrorApi(error);
        }
    )
  }

  changePage(pageName:string) {
    this.pageName = pageName;
  }

  btnBack() {
    this.locationRoute.back();
  }

  async submitCheckout(){
    if(this.checkoutForm.valid){
      this.loading = true;

      if (this.isDigitalGoods){
        await this.checkOut();
        let shipping = await this.getShipping();
        this.selectedShipping = shipping.digital;
      }

      let apiOrder = environment.apiUrl + APIConstant.ORDER;
      //set data to order
      let addOrder = new AddOrder();
      addOrder.cartId = this.cartId;
      addOrder.logisticUiId = this.selectedShipping.details[0].uiId;
      addOrder.shippingType = this.selectedShipping.type;
      addOrder.notes = this.checkoutForm.get('notes').value;
      if(this.selectedShipping.details[0].compulsoryInsurance === true){
        addOrder.useInsurance = true;
      }else{
        addOrder.useInsurance = this.isChecked;
      }

      let respSubmit = await this.requestService.post(apiOrder,null, this.apiModelTranslatorService.camelToSnakeCase(addOrder)).toPromise().then(
          (response) => {
            //get data link and uiid for link
            localStorage.removeItem('cart_id_' + this.merchantName);
            localStorage.removeItem('merchantName');
            localStorage.removeItem('merchantLink');
            return response.order.link;
          },
          (error) => {
            this.errorService.getErrorApi(error);
          });

      this.loading = false;
      //apabila menggunakan nama bisnis dan product maka cart bisa tidak valid karena menggunakan nama bisnis dan produk
      if (respSubmit) {
        this.staticLink = decodeURI(environment.envUrl + '/' + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_ORDER + respSubmit);
        this.modalService.open(this.successCheckout, {backdrop: 'static', keyboard: false});
      } else {
        this.alertService.setProps("Failed! Please try again", true);
      }
    }
  }

  async changeStateLocationType(locationType:LocationType){
    if(locationType === LocationType.City){
      this.checkoutForm.patchValue( {'city':null} );
      this.checkoutForm.patchValue( {'district':null} );
      this.checkoutForm.patchValue( {'subDistrict':null} );
      this.checkoutForm.patchValue( {'postalCode':null} );
      let province = this.checkoutForm.get('province').value;
      this.location.city = await this.getLocation(locationType, province.uiId)
    }
    else if(locationType === LocationType.District){
      this.checkoutForm.patchValue( {'district':null} );
      this.checkoutForm.patchValue( {'subDistrict':null} );
      this.checkoutForm.patchValue( {'postalCode':null} );
      let city = this.checkoutForm.get('city').value;
      this.location.district = await this.getLocation(locationType, city.uiId)
    }
    else if(locationType === LocationType.SubDistrict){
      this.checkoutForm.patchValue( {'subDistrict':null} );
      this.checkoutForm.patchValue( {'postalCode':null} );
      let district = this.checkoutForm.get('district').value;
      this.location.subDistrict = await this.getLocation(locationType, district.uiId)
    }
    else if(locationType === LocationType.PostalCode){
      this.checkoutForm.patchValue( {'postalCode':null} );
      let postalCode = this.checkoutForm.get('subDistrict').value;
      this.location.postalCode = await this.getLocation(locationType, postalCode.uiId)
    }
  }

  async openModalStatusProduct(idModal){
    //validation checkout
    if(this.cartProduct?.cartItems[0]?.items[0]['digitalGoods'] === true){
      if(this.checkoutForm.get("email").value !== null && this.checkoutForm.get("email").value !== "" && this.checkoutForm.get("phoneNumber").value !== null && this.checkoutForm.get("phoneNumber").value !== "" && this.checkoutForm.get("name").value !== null && this.checkoutForm.get("name").value !== ""){
        await this.validateShipping(idModal);
      }else{
        this.alertService.setProps("Please Fill Informasi Pengiriman", true);
      }
    }else{
      if(this.checkoutForm.get("email").value !== null && this.checkoutForm.get("email").value !== "" && this.checkoutForm.get("address").value !== null && this.checkoutForm.get("address").value !== "" && this.checkoutForm.get("phoneNumber").value !== null && this.checkoutForm.get("phoneNumber").value !== "" && this.checkoutForm.get("postalCode").value !== null && this.checkoutForm.get("name").value !== null && this.checkoutForm.get("name").value !== ""){
        await this.validateShipping(idModal);
      }
      else{
        this.alertService.setProps("Please Fill Informasi Pengiriman", true);
      }
    }
  }

  async validateShipping(idModal){
    //clear form
    this.tempSelectedShipping = null;
    this.checkoutForm.patchValue({'shipping': this.tempSelectedShipping});

    //checkout api
    let checkout = await this.checkOut();
    this.shipping = await this.getShipping();
    await this.modalService.open(idModal, {backdrop: 'static', keyboard: false, size: 'lg', scrollable:true});
  }

  async checkOut(){

    let apiCheckout = environment.apiUrl + APIConstant.CART + APIConstant.CHECKOUT;
    let checkout = new Checkout();
    checkout.cartId = this.cartId;
    checkout.email = this.checkoutForm.get("email").value;
    checkout.phoneNumber = this.checkoutForm.get("phoneNumber").value;
    checkout.name = this.checkoutForm.get("name").value;

    if(this.cartProduct?.cartItems[0]?.items[0]['digitalGoods'] === false){
      checkout.address = this.checkoutForm.get("address").value;
      checkout.postalCodeUiId = this.checkoutForm.get("postalCode").value.uiId;
    }

    return this.requestService.post(apiCheckout,null, this.apiModelTranslatorService.camelToSnakeCase(checkout)).toPromise().then(
        (response) => {
          //todo
        },
        (error) => {
          this.errorService.getErrorApi(error);
        });
  }


  async getShipping() {

    let apiShipping = environment.apiUrl + APIConstant.CART + APIConstant.SHIPPING;

    let requestParam = new Map();
    requestParam.set('cartId', this.cartId);

    return this.requestService.get(apiShipping,requestParam).toPromise().then(
        (response) => {
          return this.apiModelTranslatorService.snakeToCamelCase(response);
        },
        (error) => {
          this.errorService.getErrorApi(error);
        });
  }

  addDate(minDays: number, maxDays: number) : string{
    let date = new Date();
    const formatDateMinMax = 'dd';
    const formatMonthMinMax = 'MMMM';
    const locale = 'id';
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

  setTempShipping(type: string, detail: Detail){
    this.tempSelectedShipping = new Type();
    this.tempSelectedShipping.type = type;
    this.tempSelectedShipping.details.push(detail)
    this.checkoutForm.patchValue({'shipping': this.tempSelectedShipping});
  }

  setShipping(){
    this.selectedShipping = new Type();
    this.selectedShipping = this.tempSelectedShipping;
    this.ongkosKirim = this.selectedShipping.details[0].totalRate;
  }

  clearShipping(){
    this.tempSelectedShipping = null;
    this.checkoutForm.patchValue({'shipping': this.tempSelectedShipping});
  }

  jcButton(){
    window.location.href = this.staticLink;
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
    this.alertService.setProps("Payment Link is already copied", false);
  }

  decodeURI(param: string){
    return decodeURI(param);
  }

  changed(evt) {
    this.isChecked = evt.target.checked;
    if(this.isChecked === true){
      this.ongkosKirim = this.selectedShipping.details[0].totalRate + this.selectedShipping.details[0].insuranceRate;
    }else{
      this.ongkosKirim = this.selectedShipping.details[0].totalRate;
    }

  }

  openTermsAndCondition(){
    window.open(this.urlTermsAndCondition);
  }
  openPrivacyPolicy(){
    window.open(this.urlPrivacyPolicy);
  }
}
