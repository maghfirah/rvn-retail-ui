import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {RequestService} from "../../../shared/service/request.service";
import {APIConstant} from "../../../shared/constant/api.constant";
import {ApiModelTranslatorService} from "../../../shared/service/api-model-translator.service";
import {ErrorService} from "../../../shared/service/error.service";
import {AlertService} from "../../../shared/service/alert.service";
import {Order} from "../../../shared/models/order.model";
import {PaymentStatus} from "../../../shared/enum/payment-status.enum";
import {OrderDetail} from "../../../shared/models/order-detail.model";
import {formatDate} from "@angular/common";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FormControlValidationHelper} from "../../../shared/helper/form-control-validation.helper";
import {EmailSend} from "../../../shared/models/email-send.model";
import {PropConstant} from "../../../shared/constant/prop.constant";

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private requestService: RequestService,
        public apiModelTranslatorService: ApiModelTranslatorService,
        private errorService: ErrorService,
        private alertService: AlertService,
        private readonly formBuilder: FormBuilder,
    ) {
    }

    async ngOnInit() {
        await this.activatedRoute.params.subscribe((params: Params) => {
            this.uiIdInvoice = params['uiIdInvoice'];
            this.businessName = params['businessName'];
        });
        await this.initLoad();
        this.formEmail();
    }

    async initLoad() {
        await this.checkOrder();
    }

    //loading component
    loading = true;

    //image
    fileData: any;
    imageToUpload1: any;
    previewImageProduct1: any;

    uiIdInvoice: string;
    businessName: string;
    orderDetail: OrderDetail = new OrderDetail();
    envUrl = environment.envUrl;
    envSimulatorNotExist = PropConstant.ENV_SIMULATOR_NOT_EXIST;
    totalProduct: number = 0;
    //form
    public emailForm: FormGroup;

    formEmail() {
        this.emailForm = this.formBuilder.group({
            email: [null, [FormControlValidationHelper.emailValidator]],
        });
    }

    async checkOrder() {
        let apiGetOrder = environment.apiUrl + APIConstant.ORDER;

        let requestParam = new Map();
        requestParam.set('uiId', this.uiIdInvoice);
        let order: Order = await this.requestService.get(apiGetOrder, requestParam).toPromise().then(
            (response) => {
                return this.apiModelTranslatorService.snakeToCamelCase(response);
            },
            (error) => {
                this.errorService.getErrorApi(error);
            });

        //validate status payment
        if (order.paymentStatus === PaymentStatus.Paid) {
            this.loading = false;
            await this.getDetailOrder();
        } else {
            //validate have redirect url or not
            if (order.redirectUrl !== "" || order.redirectUrl !== null) {
                window.location.href = order.redirectUrl;
            } else {
                this.alertService.setProps("Mohon maaf terjadi kesalahan, mohon coba kembali", true);
            }
        }

    }

    async getDetailOrder() {
        let apiGetOrderDetail = environment.apiUrl + APIConstant.ORDER_DETAIL;

        let requestParam = new Map();
        requestParam.set('uiId', this.uiIdInvoice);

        await this.requestService.get(apiGetOrderDetail, requestParam).toPromise().then(
            (response) => {
                this.orderDetail = this.apiModelTranslatorService.snakeToCamelCase(response);
                //sort based on order milestone
                this.orderDetail.milestones = this.orderDetail.milestones.sort((a, b) => a.order - b.order);
                this.totalProduct = this.orderDetail.products.reduce((total, product) => {
                    let total_item = product.items.reduce((total2, item) => {
                        return total2 + item.quantity;
                    }, 0);
                    return total + total_item;
                }, 0);
                return this.orderDetail;
            },
            (error) => {
                this.errorService.getErrorApi(error);
            });
    }

    detailPesanan() {

    }

    addDate(minDays: number, maxDays: number, createdDate: string): string {
        let date;
        if (createdDate === undefined) {
            date = new Date();
        } else {
            date = new Date(createdDate);
        }
        const formatDateMinMax = 'dd';
        const formatMonthMinMax = 'MMMM';
        const locale = 'id';
        // const locale = 'id-ID';
        let minDate = date.setDate(date.getDate() + minDays);
        let maxDate = date.setDate(date.getDate() + maxDays);
        const formattedMinDate = formatDate(minDate, formatDateMinMax, locale);
        const formattedMaxDate = formatDate(maxDate, formatDateMinMax, locale);
        const formattedMinMonth = formatDate(minDate, formatMonthMinMax, locale);
        const formattedMaxMonth = formatDate(minDate, formatMonthMinMax, locale);

        if (formattedMinMonth === formattedMaxMonth) {
            return formattedMinDate + ' - ' + formattedMaxDate + ' ' + formattedMaxMonth;
        } else {
            return formattedMinDate + ' ' + formattedMinMonth + ' - ' + formattedMaxDate + ' ' + formattedMaxMonth;
        }
    }

    //Upload image
    fileProgress(fileInput: any, name: string) {
        this.fileData = <File>fileInput.target.files[0];
        if (this.fileData !== undefined) {
            this.preview(name);
        }
    }

    preview(name: string) {
        // Show image preview
        let mimeType = this.fileData?.type;
        if (mimeType.match('image.*') === null) {
            this.alertService.setProps("Failed Upload Type", true);
            return;
        }

        //validation > 1 mb
        if (this.fileData.size > 1000000) {
            this.alertService.setProps("Size more than 1 MB", true);
            return;
        }

        let reader = new FileReader();
        reader.readAsDataURL(this.fileData);

        reader.onload = (_event) => {

            let img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const height = img.naturalHeight;
                const width = img.naturalWidth;
                //validation < 300px x 300px
                if (height < 300 || width < 300) {
                    this.alertService.setProps("Minimum width and height 300", true);
                } else {
                    this.previewImageProduct1 = reader.result;
                    this.imageToUpload1 = this.fileData;
                }
            };

        }
    }

    pesananDiterima() {
        this.loading = true;
        let apiOrderComplete = environment.apiUrl + APIConstant.ORDER_COMPLETE;

        let requestParam = new Map();
        requestParam.set('uiId', this.uiIdInvoice);

        this.requestService.post(apiOrderComplete, requestParam, null).toPromise().then(
            async (response) => {
                await this.getDetailOrder();
                this.loading = false;
            },
            (error) => {
                this.errorService.getErrorApi(error);
            });
    }

    //send email
    sendEmail() {
        if (this.emailForm.valid) {
            this.loading = true;
            let apiSendEmail = environment.apiUrl + APIConstant.ORDER_SEND_EMAIL;

            let emailSend: EmailSend = new EmailSend();
            emailSend.email = this.emailForm.get("email").value;
            emailSend.uiId = this.uiIdInvoice;
            this.requestService.post(apiSendEmail, null, this.apiModelTranslatorService.camelToSnakeCase(emailSend)).toPromise().then(
                async (response) => {
                    this.loading = false;
                },
                (error) => {
                    this.errorService.getErrorApi(error);
                });
        }
    }

}
