export class OrderDetail {
    invoiceNumber: string;
    createdDate: string;
    merchant: Merchant = new Merchant();
    customer: Customer = new Customer();
    shipping : OrderShipping = new OrderShipping();
    payment : Payment = new Payment();
    milestones : Milestones[] = [];
    serverDate: string;
    status: string;
    products: OrderDetailProduct[] = [];
}

export class Merchant {
    name: string;
    image: string;
}

export class Customer {
    address: string;
    country: string;
    detailAddress: string;
    email: string;
    name: string;
    phoneNumber: string;
}

export class Payment {
    amount: number;
    channel: string;
    itemsPrice: number;
    shippingPrice: number;
    status: string;
    insurancePrice: number;
}

export class Milestones {
    order: number;
    status: string;
    createdDate: string;
}

export class OrderShipping {
    awbNumber: string;
    trackingId: string;
    name: string;
    logoUrl: string;
    rateName: string;
    digitalGoods: boolean;
}

export class OrderDetailProduct {
    uiId: string;
    name: string;
    image: string;
    items: Item[] = [];
}

export class Item {
    uiId: string;
    color: string;
    quantity: number;
    price: number;
    amount: number;
}
