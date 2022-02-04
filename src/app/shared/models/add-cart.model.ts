export class AddCart {
    cartId: string;
    item: AddCartItem = new AddCartItem();
}

export class AddCartItem {
    productVariantUiId: string;
    quantity: number;
}
