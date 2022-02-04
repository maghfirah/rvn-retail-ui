export class MerchantOrder {
    orders: Order[] = [];
    pageable: Pageable = new Pageable();
}

export class Order {
    createdDate: string;
    customer: string;
    link: string;
    paymentStatus: string;
    price: number;
    products: OrderProduct[] = [];
    status: string;
    uiId: string;
}

export class Pageable {
    startData: number;
    endData: number;
    totalData: number;
}

export class OrderProduct {
    uiId: string;
    name: string;
    image: string;
}
