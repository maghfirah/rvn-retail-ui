import {ApiErrorType} from '../constant/api-error-type.constant';
import {ApiErrorMessage} from '../constant/api-error-message.constant';
import {ErrorMessageConstant} from '../constant/error-message.constant';

/**
 * Kelas yang berfungsi untuk memappingkan/mentranslate error dari api ke kostum message angular
 */
export class MappingResponseApi {
    public static readonly MIN_ONE_PRODUCT_VARIANT_ACTIVE = new MappingResponseApi(ApiErrorType.INVALID_REQUEST_ERROR, ApiErrorMessage.MIN_ONE_PRODUCT_VARIANT_ACTIVE, ErrorMessageConstant.MIN_ONE_PRODUCT_VARIANT_ACTIVE);
    public static readonly INVALID_PAYMENT_DUE_DATE = new MappingResponseApi(ApiErrorType.INVALID_REQUEST_ERROR, ApiErrorMessage.INVALID_PAYMENT_DUE_DATE, ErrorMessageConstant.INVALID_PAYMENT_DUE_DATE);

    private constructor(public readonly errorType: string, public readonly errorMessage: string, public readonly responseError:string) {}
}
