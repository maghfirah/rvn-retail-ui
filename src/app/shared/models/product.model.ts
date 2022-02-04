import {ConfigurationStoreLocation} from "./configuration-store-location.model";

export class Product {

    category: string;
    code: string;
    condition: string;
    description: string;
    link: string;
    name: string;
    variants: Variant[] = [];
    price: number;
    stock: number;
    active: boolean;
    images: Image[] = [];
    image: string;
    uiId: string;
    merchant: ConfigurationStoreLocation = new ConfigurationStoreLocation();
    status: string;
    merchantLink: string;
    notes: string;
    soldProduct: number;
}

export class Variant {
    color: string;
    minimumOrder: number;
    price: number;
    type: string;
    height: number;
    length: number;
    width: number;
    stock: number;
    weight: number;
    quantity: number;
    uiId: string;
    digitalGoods: boolean;
    active: boolean;
}

export class Image {
    id: string;
    url: string;
}
