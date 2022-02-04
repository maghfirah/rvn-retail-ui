import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {AlertService} from "../../../shared/service/alert.service";
import {ErrorService} from "../../../shared/service/error.service";
import {NavigationConstant} from "../../../shared/constant/navigation.constant";
import {Product, Variant} from "../../../shared/models/product.model";
import {APIConstant} from "../../../shared/constant/api.constant";
import {environment} from "../../../../environments/environment";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CartProduct} from "../../../shared/models/cart-product.model";
import {ValidationService} from "../../../shared/service/validation.service";
import {AddCart} from "../../../shared/models/add-cart.model";
import {v4 as uuidv4} from 'uuid';
import {PropConstant} from "../../../shared/constant/prop.constant";
import {Cart} from "../../../shared/models/cart.model";
import {NgbCarousel} from '@ng-bootstrap/ng-bootstrap';
import {Meta} from "@angular/platform-browser";

@Component({
    selector: 'app-merchant-product',
    templateUrl: './merchant-product.component.html',
    styleUrls: ['./merchant-product.component.css']
})
export class MerchantProductComponent implements OnInit {
    @ViewChild("productCarousel") productCarousel: NgbCarousel;
    constructor(
        private readonly formBuilder: FormBuilder,
        private requestService: RequestService,
        public apiModelTranslatorService: ApiModelTranslatorService,
        private alertService: AlertService,
        private errorService: ErrorService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public validationService: ValidationService,
        private metaTagService: Meta
    ) {
    }

    async ngOnInit() {
        await this.initLoad();
        this.unwrap(document.querySelector('.content-wrapper'));
        this.pageName = 'merchant-product';
        this.form();
    }

    //form
    public addChartProduct: FormGroup;

    //Endpoint API
    private apiLinkGetProduct = environment.apiUrl + APIConstant.LINK;
    private apiAddToCart = environment.apiUrl + APIConstant.CART;
    private apiCart = environment.apiUrl + APIConstant.CART;

    cart : Cart = new Cart();
    //loading component
    loading = true;

    loadingProduct = false;

    //page
    pageName : string = "";

    //checkout
    cartProduct = new CartProduct();
    cartId : string;

    
    mouseDown: boolean= false;

    startX: any;

    scrollLeft: any;

    slider = document.querySelector<HTMLElement>('.span1');

    merchantLink = "";
    productLink = "";
    productList : Product[] =[];
    productDetail : Product = new Product();
    productLinkRoot = "";
    shareToCopyWriting = "";
    activeVariant = new Variant();
    variantColor = "";
    variantStock = 0;
    isDigitalGoods: boolean;
    limitCart: number = 5;
    itemInCart: number = 0;
    cartHasVariant: boolean = false;
    currentVariantInCart: number = 0;
    merchantName:string = "";
    showBottomSheetShareTo = false;

    async initLoad() {
        await this.activatedRoute.params.subscribe((params: Params) => {
            this.merchantLink = params['businessName'];
            this.productLink = params['product'];
        });
        this.getListInventory();
        let product: Product = await this.getDetailProduct();
        this.shareToCopyWriting = 'Temukan "' + this.productDetail.name + '" dengan harga ' + this.convertPriceValue(this.activeVariant.price) + ' di toko ' + this.productDetail.merchant.name;
        this.setMetaTags();
        this.productLinkRoot = environment.envUrl + "/" + NavigationConstant.ROUTING_RETAIL + '/' + NavigationConstant.ROUTING_MERCHANT + '/' + decodeURI(this.merchantLink) + '/';
        this.merchantName = this.convertMerchantName(this.productDetail.merchant.name);
        this.cartId = localStorage.getItem('cart_id_' + this.merchantName);
        this.isDigitalGoods = this.activeVariant.digitalGoods;
        if (this.cartId !== '') {
            await this.getCart(this.cartId);
            if (!this.cart.cartItems.length) {
                localStorage.removeItem('cart_id_' + this.merchantName);
            } else {
                this.checkCart();
                this.isDigitalGoods = this.cart.digitalGoods;
            }
        }
    }

    private convertMerchantName(merchantName:string) {
        return merchantName.replace(/\s/g, '');
    }

    private checkCart() {
        this.cartHasVariant = false;
        this.itemInCart = 0;
        this.currentVariantInCart = 0;
        this.cart.cartItems.forEach(product => {
            product.items.forEach(item => {
                this.itemInCart++;
                if (item.uiId === this.activeVariant.uiId) {
                    this.cartHasVariant = true;
                    this.currentVariantInCart = item.quantity;
                }
            })
        })
    }

    unwrap(wrapper) {
        if (wrapper !== null) {
            var docFrag = document.createDocumentFragment();
            while (wrapper.firstChild) {
                var child = wrapper.removeChild(wrapper.firstChild);
                docFrag.appendChild(child);
            }

            wrapper.parentNode.replaceChild(docFrag, wrapper);
        }
    }


    async getDetailProduct() {
        let apiGetDetailByLink = this.apiLinkGetProduct + '/' + this.merchantLink + APIConstant.PRODUCT + '/' + this.productLink;

        return this.requestService.get(apiGetDetailByLink, null).toPromise().then(
            (response) => {
                //harusnya apabila product non aktif jangan berikan response
                if (response === null) {
                    this.router.navigate([this.router.url + '/' + NavigationConstant.ROUTING_MERCHANT_PRODUCT_NOT_FOUND]);
                } else {
                    this.productDetail = this.apiModelTranslatorService.snakeToCamelCase(response);
                    this.loading = false;
                    this.activeVariant = this.productDetail.variants[0];
                    this.variantColor = this.activeVariant.color;
                    this.variantStock = this.activeVariant.stock;

                    return this.productDetail;
                }
            }
            ,
            (error) => {
                this.errorService.getErrorApi(error);
            }
        )
    }

    form() {
        this.addChartProduct = this.formBuilder.group({
            quantity: [1, [Validators.required, Validators.pattern, Validators.min(this.activeVariant.minimumOrder), Validators.max(this.activeVariant.stock)]],
        });
    }

    copyMessage(val: string) {
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

    decodeURI(param: string) {
        return decodeURI(param);
    }

    changeVariant() {
        this.activeVariant = this.productDetail.variants.find(variant => variant.color === this.variantColor);
        this.form();
        this.checkCart();
        if (this.activeVariant.stock > 0) {
            this.addChartProduct.patchValue({"quantity": 1});
        } else {
            this.addChartProduct.patchValue({"quantity": 0});
        }
        this.isDigitalGoods = this.activeVariant.digitalGoods;
        this.shareToCopyWriting = 'Temukan "' + this.productDetail.name + '" dengan harga ' + this.convertPriceValue(this.activeVariant.price) + ' di toko ' + this.productDetail.merchant.name;
        this.setMetaTags();
    }

    async submitCheckout() {
        if (this.addChartProduct.valid) {
            //set data to checkout
            let product = this.productDetail;
            let cartVariant = this.activeVariant;
            cartVariant.quantity = this.addChartProduct.get("quantity").value;
            product.variants = [];
            product.variants.push(cartVariant);
            this.cartProduct.cart.push(product);
            this.cartProduct.totalPrice = this.addChartProduct.get("quantity").value * this.activeVariant.price;

            //disable add to cart can spam db
            let addToCart = new AddCart();
            let isNewCart = false;
            if (localStorage.getItem('cart_id_' + this.merchantName)) {
                this.cartId = localStorage.getItem('cart_id_' + this.merchantName)
            } else {
                this.cartId = uuidv4();
                isNewCart = true;
                addToCart.cartId = this.cartId;
                addToCart.item.productVariantUiId = this.activeVariant.uiId;
                addToCart.item.quantity = this.addChartProduct.get("quantity").value;
                await this.requestService.post(this.apiAddToCart, null, this.apiModelTranslatorService.camelToSnakeCase(addToCart)).toPromise().then(
                    (response) => {
                    },
                    (error) => {
                        this.errorService.getErrorApi(error);
                    });
            }
            await this.getCart(this.cartId);
            let updateCart = {
                cartId: this.cartId,
                items: []
            }
            let itemTemp = [];
            this.cart.cartItems.forEach(data => {
                let items = data.items.map(item => {
                    return {
                        product_variant_ui_id: item['uiId'],
                        quantity: item['quantity']
                    }
                })
                itemTemp = itemTemp.concat(items);
            })
            updateCart.items = itemTemp;
            if (!isNewCart) {
                updateCart.items.forEach((val, index) => {
                    if (val.product_variant_ui_id === this.activeVariant.uiId) {
                        updateCart.items[index].quantity += parseInt(this.addChartProduct.get("quantity").value)
                    }
                })
                if (this.itemInCart <= this.limitCart) {
                    if (!this.cartHasVariant) {
                        updateCart.items.push({
                            product_variant_ui_id: this.activeVariant.uiId,
                            quantity: this.addChartProduct.get("quantity").value
                        });
                    }
                }
            }
            return this.requestService.put(this.apiCart, null, this.apiModelTranslatorService.camelToSnakeCase(updateCart)).toPromise().then(
                (response) => {
                    // response to update cart
                    const dateNow = new Date();
                    dateNow.setMinutes(dateNow.getMinutes() + parseInt(PropConstant.COOKIE_CART_ID_TIMEOUT));
                    localStorage.setItem('cart_id_' + this.merchantName, this.cartId);
                    localStorage.setItem("merchantLink", this.merchantLink);
                    localStorage.setItem("merchantName", this.merchantName);
                    this.router.navigate([NavigationConstant.ROUTING_MERCHANT_CART]);
                },
                (error) => {
                    this.errorService.getErrorApi(error);
                });
        }
    }

    async getCart(cartId: string) {
        let requestParam = null;
        if (cartId !== "") {
            requestParam = new Map();
            requestParam.set('cartId', cartId);
        }

        return this.requestService.get(this.apiCart, requestParam).toPromise().then(
            (response) => {
                this.cart = this.apiModelTranslatorService.snakeToCamelCase(response);
            }
            ,
            (error) => {

                this.errorService.getErrorApi(error);
            }
        )
    }

    changePage(pageName: string) {
        this.pageName = pageName;
    }

    btnMerchantProduct() {
        // supposed to back to merchant products
        this.router.navigate([NavigationConstant.ROUTING_MERCHANT + '/' + this.merchantLink]);
    }

    btnCart() {
        localStorage.setItem("merchantLink", this.merchantLink);
        this.router.navigate([NavigationConstant.ROUTING_MERCHANT_CART]);
    }

    toggleBtmSheetShareTo() {
        if (!this.showBottomSheetShareTo) {
            // this.merchantProductCategory = await this.getCategory()
        }
        this.showBottomSheetShareTo = !this.showBottomSheetShareTo;
    }

    onClickShareTo(media) {
        let URL = "";
        if (media == 'whatsapp') {
            URL = 'https://api.whatsapp.com/send?text=' + this.shareToCopyWriting + '%20' + encodeURIComponent(this.productLinkRoot + decodeURI(this.productDetail?.link));
        } else if (media == 'facebook') {
            URL = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.productLinkRoot + decodeURI(this.productDetail?.link));
        } else if (media == 'instagram') {
            URL = '';
        } else if (media == 'line') {
            URL = 'https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(this.productLinkRoot + decodeURI(this.productDetail?.link));
        }

        if (URL) {
            console.log(URL);
            window.open(URL);
        }
    }

    private swipeCoord?: [number, number];
    private swipeTime?: number;

    swipe(e: TouchEvent, when: string): void {

        const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        const time = new Date().getTime();

        if (when === 'start') {
            this.swipeCoord = coord;
            this.swipeTime = time;
        } else if (when === 'end') {
            const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
            const duration = time - this.swipeTime;

            if (duration < 1000 //
                && Math.abs(direction[0]) > 30 // Long enough
                && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
                const swipe = direction[0] < 0 ? 'next' : 'previous';
                if (swipe === 'next') {
                    this.productCarousel.next();
                    this.swipeCoord = [0, 0];
                    this.swipeTime = 0;
                } else if (swipe === 'previous') {
                    this.productCarousel.prev();
                    this.swipeCoord = [0, 0];
                    this.swipeTime = 0;
                }

                // Do whatever you want with swipe
            }
        }
    }

    private swipeCoords?: [number, number] = [0, 0];

    private swipeTimes?: number = 0;

    mouseMove(e: MouseEvent, when: string): void {
        const coord: [number, number] = [e.clientX, e.clientY];
        const time = new Date().getTime();

        if (when === 'start') {
            this.swipeCoords = coord;
            this.swipeTimes = time;
        } else if (when === 'end') {
            const direction = [coord[0] - this.swipeCoords[0], coord[1] - this.swipeCoords[1]];
            const duration = time - this.swipeTimes;

            if (duration < 1000 //
                && Math.abs(direction[0]) > 30 // Long enough
                && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
                const swipe = direction[0] < 0 ? 'next' : 'previous';
                if (swipe === 'next') {
                    this.productCarousel.prev();
                    this.swipeCoords = [0, 0];
                    this.swipeTimes = 0;
                } else if (swipe === 'previous') {
                    this.productCarousel.next();
                    this.swipeCoords = [0, 0];
                    this.swipeTimes = 0;
                }

                // Do whatever you want with swipe
            }
        }
    }

    getListInventory() {
        this.loadingProduct = true;
        let apiGetProduct = this.apiLinkGetProduct
        let requestParam = new Map();

        this.requestService.get(apiGetProduct + '/' + decodeURI(this.merchantLink) + APIConstant.LINK_MERCHANT_PRODUCTS, requestParam).subscribe(
            (response) => {
                this.productList = this.apiModelTranslatorService.snakeToCamelCase(response);
                this.loadingProduct = false;
            }
            ,
            (error) => {
                this.errorService.getErrorApi(error);
                this.loadingProduct = false;
            }
        )
    }
    startDragging(e, flag, el) {
      event.stopPropagation();
      this.mouseDown = true;
      this.startX = e.pageX - el.offsetLeft;
      this.scrollLeft = el.scrollLeft;
    }
    stopDragging(e, flag) {
      event.stopPropagation();
      this.mouseDown = false;
    
    }
    moveEvent(e, el) {
      e.stopPropagation();
      if (!this.mouseDown) {
        return;
      }
      const x = e.pageX - el.offsetLeft;
      const scroll = x - this.startX;
      el.scrollLeft = this.scrollLeft - scroll;
    }

    convertPriceValue(price) {
      return price.toLocaleString('id-ID', {currency: 'IDR', style: 'currency'}).slice(0, -3);
    }

    toDetailClick(e: Event, link: string){
      e.stopPropagation();
      let currentUrl =  '/' + NavigationConstant.ROUTING_MERCHANT + '/' + decodeURI(this.merchantLink) + '/' + link;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
      });
    }

    setMetaTags(){
        this.metaTagService.addTags([
            {
                property: 'og:url',
                content: this.productLinkRoot
            },
            {
                property: 'og:type',
                content: this.productDetail.category
            },
            {
                property: 'og:title',
                content: this.productDetail.name
            },
            {
                property: 'og:description',
                content: this.shareToCopyWriting
            },
            {
                property: 'og:image',
                content: this.productDetail.images[0].url
            },
            {
                property: 'twitter:image',
                content: this.productDetail.images[0].url
            },
            {
                property: 'twitter:card',
                content: this.productDetail.images[0].url
            },
            {
                property: 'twitter:image:alt',
                content: this.productDetail.name
            },
            {
                property: 'twitter:title',
                content: this.productDetail.name
            },
            {
                property: 'twitter:description',
                content: this.shareToCopyWriting
            },
            {
                property: 'twitter:url',
                content:this.productLinkRoot
            }
        ]);
    }

}
