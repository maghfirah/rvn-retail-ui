export class MerchantProduct {

    category: string;
    link: string;
    name: string;
    variants: Variant[] = [];
    images: Image[] = [];
    uiId: string;
    soldProduct: number;
    createdDate: string;

}

export class Variant {
    color: string;
    minimumOrder: number;
    price: number;
    height: number;
    length: number;
    width: number;
    stock: number;
    weight: number;
}

export class Image {
    id: string;
    url: string;
}
