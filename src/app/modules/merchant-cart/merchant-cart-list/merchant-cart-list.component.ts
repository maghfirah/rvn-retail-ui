import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import {CookieService} from "ngx-cookie-service";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {Router} from "@angular/router";
import {Cart} from "../../../shared/models/cart.model";
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {environment} from "../../../../environments/environment";
import {APIConstant} from "../../../shared/constant/api.constant";
import {PropConstant} from "../../../shared/constant/prop.constant";

@Component({
  selector: 'app-merchant-cart-list',
  templateUrl: './merchant-cart-list.component.html',
  styleUrls: ['./merchant-cart-list.component.css']
})
export class MerchantCartListComponent implements OnInit {

  constructor(
      private requestService: RequestService,
      public apiModelTranslatorService: ApiModelTranslatorService,
      private alertService: AlertService,
      private errorService: ErrorService,
      private location: Location,
      private cookieService: CookieService,
      private router: Router,
  ) { }

  async ngOnInit() {
    await this.initLoad();
    this.pageName = 'merchant-cart-list';
    this.loading = false;
  }

  //loading component
  loading = true;

  //page
  pageName : string = "";

  @Input() step: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 0;
  renderedValue: string;
  quantity: number = 0;

  private apiCart = environment.apiUrl + APIConstant.CART;

  cart : Cart = new Cart();
  cartId : string = "";
  merchantLink : string = "";
  hasDigitalAndNonDigitalGoods : boolean = false;
  totalProduct: number = 0;
  merchantName:string = "";

  async initLoad(){
    this.merchantName = localStorage.getItem('merchantName')
    this.merchantLink = localStorage.getItem('merchantLink');
    this.cartId = localStorage.getItem('cart_id_' + this.merchantName);

    this.loading = false;
    if (this.cartId !== ''){
      await this.getCart(this.cartId);
      this.hasDigitalAndNonDigitalGoods =
          this.cart.cartItems.reduce((total,val) => {
            if (val.items[0]['digitalGoods']){
              return total + 1;
            }
          },0) > 0 &&
          this.cart.cartItems.reduce((total,val) => {
            if (!val.items[0]['digitalGoods']){
              return total + 1;
            }
          },0) > 0;
    }
  }

  async getCart(cartId:string){
    let requestParam = null;
    if(cartId !== ""){
      requestParam = new Map();
      requestParam.set('cartId', cartId);
    }

    return this.requestService.get(this.apiCart, requestParam).toPromise().then(
        (response) => {
          this.cart = this.apiModelTranslatorService.snakeToCamelCase(response);
          this.totalProduct = this.cart.cartItems.reduce((total, product) => {
              return total + product.items.reduce((total2, item) => {
                return total2 + item.quantity;
              },0)
          },0);
        }
        ,
        (error) => {
          this.errorService.getErrorApi(error);
        }
    )
  }

  async updateCartProduct(index, index2, productId, quantity) {
    let stock = this.cart.cartItems[index].items[index2].stock;
    let minimum = this.cart.cartItems[index].items[index2].minimumOrder;
    quantity = parseInt(quantity);
    quantity = quantity < minimum ? minimum : quantity;
    quantity = quantity > stock ? stock : quantity;
    try {
      if (quantity >= minimum && quantity <= stock){
        await this.updateCart(productId,quantity)
        this.cart.cartItems[index].items[index2].quantity = quantity;
        this.cart.cartItems[index].totalPrice = this.cart.cartItems[index].items.reduce((total,item) => {
          return total + (item.quantity * item.price);
        },0)
        this.totalProduct = this.cart.cartItems.reduce((total, product) => {
          return total + product.items.reduce((total2, item) => {
            return total2 + item.quantity;
          },0)
        },0);
      }
    } catch (err){
    }
  };

  async deleteCartProduct(productId:string, index:number, index2:number) {
    let deleteCart = {
      cartId: this.cart.cartId,
      items: []
    }
    let itemTemp = [];
    this.cart.cartItems.forEach(data => {
      let items = data.items.map(item => {
        return {
          product_variant_ui_id : item['uiId'],
          quantity:  item['quantity']
        }
      })
      itemTemp = itemTemp.concat(items);
    })
    deleteCart.items = itemTemp;
    let indexToDelete = null;
    deleteCart.items.forEach((val, index) => {
      if (val.product_variant_ui_id === productId) {
        indexToDelete = index;
      }
    })
    if (indexToDelete !== null) {
      deleteCart.items.splice(indexToDelete, 1);
      return this.requestService.put(this.apiCart, null, this.apiModelTranslatorService.camelToSnakeCase(deleteCart)).toPromise().then(
          async (response) => {
            let cartTemp = this.apiModelTranslatorService.snakeToCamelCase(response);
            this.cart.totalPrice  = cartTemp.totalPrice;
            this.cart.cartItems[index].items.splice(index2,1);
            this.totalProduct = this.cart.cartItems.reduce((total, product) => {
              return total + product.items.reduce((total2, item) => {
                return total2 + item.quantity;
              },0)
            },0);
          },
          (error) => {
            this.errorService.getErrorApi(error);
          });
    }
  }

  async updateCart(productId:string, quantity:number) {
      let updateCart = {
        cartId: this.cart.cartId,
        items: []
      }
      let itemTemp = [];
      this.cart.cartItems.forEach(data => {
        let items = data.items.map(item => {
          return {
            product_variant_ui_id : item['uiId'],
            quantity:  item['quantity']
          }
        })
        itemTemp = itemTemp.concat(items);
      })
      updateCart.items = itemTemp;
      updateCart.items.forEach((val, index) => {
        if (val.product_variant_ui_id === productId) {
          updateCart.items[index].quantity = quantity;
        }
      })
      return this.requestService.put(this.apiCart, null, this.apiModelTranslatorService.camelToSnakeCase(updateCart)).toPromise().then(
          (response) => {
            let cartTemp = this.apiModelTranslatorService.snakeToCamelCase(response);
            this.cart.totalPrice  = cartTemp.totalPrice;
          },
          (error) => {
            this.errorService.getErrorApi(error);
          });
  }

  changePage(pageName:string) {
    this.pageName = pageName;
  }

  btnBack() {
    this.location.back();
  }
  btnMerchantProduct() {
    // supposed to back to merchant products
    this.router.navigate([NavigationConstant.ROUTING_MERCHANT + '/' + this.merchantLink]);
  }

  onChangeQuantiy(e, index, index2, productId){
    this.updateCartProduct(index, index2, productId,e.target.value);
  }

  btnCheckoutCart() {
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() + parseInt(PropConstant.COOKIE_CART_ID_TIMEOUT));
    localStorage.setItem('cart_id_' + this.merchantName, this.cartId);
    this.router.navigate([NavigationConstant.ROUTING_MERCHANT_CART  + '/checkout']);
  }
}

