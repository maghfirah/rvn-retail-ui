/**
 * Kelas yang berisi kumpulan response error message dari api
 */
export class ApiErrorMessage {

    public static INVALID_PAYMENT_DUE_DATE = 'The request for payment.paymentDueDate is invalid, because payment_due_date must be greater than 0 minutes.';
    public static MIN_ONE_PRODUCT_VARIANT_ACTIVE = 'At least 1 product variant is active';
}
