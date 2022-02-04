import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RequestService} from '../../../shared/service/request.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ErrorCodeConstant} from '../../../shared/constant/error-code.constant';
import {NavigationConstant} from '../../../shared/constant/navigation.constant';
import {ErrorMessageConstant} from '../../../shared/constant/error-message.constant';

@Component({
  selector: 'app-error',
  templateUrl: './error-general.component.html',
  styleUrls: ['./error-general.component.css']
})
export class ErrorGeneralComponent implements OnInit {

  httpStatus: number;
  unauthorizedCode: number = ErrorCodeConstant.UNAUTHORIZED;
  timeoutCode: number = ErrorCodeConstant.TIMEOUT;
  notFoundCode: number = ErrorCodeConstant.NOT_FOUND;
  corsOriginCode: number = ErrorCodeConstant.CORS_ORIGIN;
  unknownErrorCode: number = ErrorCodeConstant.UNKNOWN_ERROR;
  errorMessage: string;
  errorCode: number;

  constructor(
    private titleService:Title,
    private requestService: RequestService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => this.httpStatus = params['httpStatus']);
    this.checkCustomError();
  }

  checkCustomError(){
    let message = history.state.data !== undefined ? history.state.data.message : undefined;
    let type = history.state.data !== undefined ? history.state.data.type : undefined;
    let code = history.state.data !== undefined ? history.state.data.code : undefined;

    //validate error come from user
    if(message === undefined){
      this.httpStatus = ErrorCodeConstant.NOT_FOUND;
      this.errorMessage = ErrorMessageConstant.NOT_FOUND_ERROR_MESSAGE;
    }
    //validate error come from errorService
    else{
      //Error come from API
      if(type !== undefined){
        this.errorCode = code;
        this.titleService.setTitle("API Error");
        this.errorMessage = message;
        this.httpStatus = ErrorCodeConstant.UNKNOWN_ERROR;
      }
      //Error not come from API
      else{
        this.errorCode = this.httpStatus;

        //Timeout error
        if(this.httpStatus == this.timeoutCode){
          this.titleService.setTitle("Timeout");
          this.errorMessage = message;
        }

        //Cors origin error
        else if(this.httpStatus == this.corsOriginCode){
          this.titleService.setTitle("Cors Origin");
          this.errorMessage = message;
        }

        //Unauthorized error
        else if(this.httpStatus == this.unauthorizedCode){
          this.titleService.setTitle("Unauthorized");
          this.errorMessage = message;
        }

        //Not Found error
        else if(this.httpStatus == this.notFoundCode){
          this.titleService.setTitle("Not Found");
          this.errorMessage = message;
        }

        //Unknown error
        else if(this.httpStatus == this.unknownErrorCode){
          this.titleService.setTitle("Unknown Error");
          this.errorMessage = message;
        }

        //Unknown Http Status Error
        else{
          this.titleService.setTitle("Http Status Unknown Error");
          this.errorMessage = message;
        }
      }
    }
  }

  goBack(){
    this.router.navigate([NavigationConstant.DASHBOARD]);
  }

}
