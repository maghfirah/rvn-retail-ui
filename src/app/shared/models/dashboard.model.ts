export interface DashboardModel {
    transaction_status: TransactionStatus;
    product_status:     ProductStatus;
}

export interface ProductStatus {
    approved_count: number;
    waiting_count:  number;
    rejected_count: number;
}

export interface TransactionStatus {
    waiting_for_payment_count: number;
    new_order_count:           number;
    processing_count:          number;
    sending_count:             number;
    done_count:                number;
}