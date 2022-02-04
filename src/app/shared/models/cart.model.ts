import {ConfigurationStoreLocation} from "./configuration-store-location.model";
import {Product} from "./product.model";

export class Cart {
    cartId: string;
    merchant: ConfigurationStoreLocation = new ConfigurationStoreLocation();
    cartItems: CartItem[] = [];
    totalPrice: number;
    digitalGoods: boolean;
}

export class CartItem {
    product: Product = new Product();
    items: Item[] = [];
    totalPrice: number;
}

export class Item {
    uiId: string;
    color: string;
    stock: number;
    minimumOrder: number;
    quantity: number;
    price: number;
    totalPrice: number;
}
