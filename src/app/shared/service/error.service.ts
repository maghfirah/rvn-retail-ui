import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorCodeConstant} from '../constant/error-code.constant';
import {TimeoutError} from 'rxjs';
import {NavigationConstant} from '../constant/navigation.constant';
import {Error} from '../models/response-api.model';
import {AlertService} from './alert.service';
import {ErrorMessageConstant} from '../constant/error-message.constant';
import {MappingResponseApi} from "../enum/mapping-response-api.enum";

@Injectable({providedIn: 'root'})
export class ErrorService implements ErrorHandler{

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private alertService: AlertService,
  ) { }

  //this is error handler if you want to redirect page, this code is automatically so you don't need to implement
  handleError(error: any) {
    let modelError = this.validateHttpError(error);
    this.ngZone.run(()=>this.router.navigate([NavigationConstant.ERROR_GENERAL, modelError.code], { state: {data: modelError} }))
  }

  //this error handler if you want to stay on page, usually implement this code in submit form, when validation come from api
  getErrorApi(error) : Error{
    let modelError = this.validateHttpError(error);
    this.alertService.setProps("Failed! " + modelError.message, true);
    return modelError;
  }

  //this validate error
  validateHttpError(error:any) :Error {
    let tempErrorModel = new Error();

    //http status error
    if(error instanceof HttpErrorResponse) {

      //http status come from api
      if(error?.error?.error){
        tempErrorModel.message = this.mappingErrorResponseApi(error?.error?.error);
        tempErrorModel.type = error.error.error.type;
        tempErrorModel.code = error.error.error.code;
      }
      //http status not come from api
      else{
        // http status Cross Origin
        if (error.status == ErrorCodeConstant.CORS_ORIGIN) {
          tempErrorModel.message = ErrorMessageConstant.CORS_ORIGIN_ERROR_MESSAGE;
          tempErrorModel.code = ErrorCodeConstant.CORS_ORIGIN.toString();
        }
        //http status Unauthorized
        else if (error.status == ErrorCodeConstant.UNAUTHORIZED) {
          tempErrorModel.message = ErrorMessageConstant.UNAUTHORIZED_ERROR_MESSAGE;
          tempErrorModel.code = ErrorCodeConstant.UNAUTHORIZED.toString();
        }
        //http status Not Found
        else if (error.status == ErrorCodeConstant.NOT_FOUND) {
          tempErrorModel.message = ErrorMessageConstant.NOT_FOUND_ERROR_MESSAGE;
          tempErrorModel.code = ErrorCodeConstant.NOT_FOUND.toString();
        }
        //http status unknown error
        else {
          console.error("Http Status Unknown Error : " + JSON.stringify(error));
          tempErrorModel.message = ErrorMessageConstant.HTTP_STATUS_UNKNOWN_ERROR_MESSAGE;
          tempErrorModel.code = error.status.toString();
        }
      }
    }
    //timeout error
    else if(error instanceof TimeoutError){
      tempErrorModel.message = ErrorMessageConstant.TIMEOUT_ERROR_MESSAGE;
      tempErrorModel.code = ErrorCodeConstant.TIMEOUT.toString();
    }
    //unknown error
    else{
      console.error("Unknown Error : " + error);
      tempErrorModel.message = ErrorMessageConstant.UNKNOWN_ERROR_MESSAGE;
      tempErrorModel.code = ErrorCodeConstant.UNKNOWN_ERROR.toString();
    }

    return tempErrorModel;
  }

  //mapping error response API
  mappingErrorResponseApi(error:Error): string{
    for (let mappingResponseApi in MappingResponseApi) {
      if(MappingResponseApi[mappingResponseApi].errorType === error.type &&
          MappingResponseApi[mappingResponseApi].errorMessage === error.message){
        return MappingResponseApi[mappingResponseApi].responseError;
      }
    }
    return error.message;
  }
}
