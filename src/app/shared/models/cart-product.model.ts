import {Product} from "./product.model";
import {ConfigurationStoreLocation} from "./configuration-store-location.model";

export class CartProduct {
    cart: Product[] = [];
    totalPrice: number;
    grandTotal: number;
    shippingCost: number;
    customer: ConfigurationStoreLocation = new ConfigurationStoreLocation();
    logistic: Logistic;
    cartId: string;
}

export class Logistic {
    name: string;
    rateName: string;
    price: number;
    maxDay: string;
    minDay: string;
}
