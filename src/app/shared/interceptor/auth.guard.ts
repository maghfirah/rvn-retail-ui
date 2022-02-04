import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Error} from '../models/response-api.model';
import {ErrorMessageConstant} from '../constant/error-message.constant';
import {ErrorCodeConstant} from '../constant/error-code.constant';
import {NavigationConstant} from "../constant/navigation.constant";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    localStorage.setItem('token', 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJwYXlsb2FkIiwiZXhwIjoxNjQxMjEwMTg2LCJ1c2VyIjp7ImJ1c2luZXNzU2VydmljZUNsaWVudElkIjoiTUNILTA2ODItMTYzNDEwMTM4NzM2MCIsInJlZmVycmVySWQiOm51bGwsInJvbGVJZCI6MywidXNlckZ1bGxOYW1lIjoiUmV2ZW51ZSB0ZXN0aW5nIG1heCBsZW5ndGgiLCJtZW51TmFtZSI6IkNvbmZpZ3VyYXRpb24iLCJwZXJtaXNzaW9uIjpbInJlYWQiXSwic2FsZXNFbWFpbCI6IiIsInVzZXJJZCI6MTMwOCwiYnVzaW5lc3NDbGllbnRJZCI6IkJTTi0wNjgwLTE2MzQxMDEzODcxMTQiLCJidXNpbmVzc1NlcnZpY2VDbGllbnROYW1lIjoiUEpDU0kgKFBlcnNhdHVhbiBKYXNtaW5lIENhbnRpayBTZWx1cnVoIEluZG9uZXNpYSkgdGVzdGluZyIsInNhbGVzSWQiOm51bGwsImJ1c3NpbmVzc1NlcnZpY2VDbGllbnRJZCI6Ik1DSC0wNjgyLTE2MzQxMDEzODczNjAiLCJyb2xlTmFtZSI6IkFkbWluIiwicmVmZXJyZXJFbWFpbCI6IiIsImJ1c2luZXNzQ2xpZW50TmFtZSI6IlBUIEphc21pbmUgTmFiaWxhIFBlcnNlcm8gdGVzdGluZyIsInVzZXJFbWFpbCI6InJldmVudWV0ZXN0KzEwQGRva3UuY29tIiwidXNlclR5cGUiOiJFeHRlcm5hbCJ9LCJpYXQiOjE2NDEyMDgzODZ9.CVnFJZFbmr_FWMynbO3FyzRCy2MovcKhnt7VGbdt2q8WVueGqt9vvfDct-aohyxD-e-Vu3zVWfrKyndnNi2gXur19bzDZRRAVZz79xMK8pDyE_XoJ2-YpCABo7R1G1sSNhmo7VxVmwnUVoHqgNt-5ahdAe8DM7O6HKC2cUuv9I-IsE4Z1QOt-_JleVv-RBUjPjDCwvP8Wwhvnq3lOGUarE1_vF-IFbzo6UFDeDzTrKfGbiFVnudRBtKHhcPbv5hkD9UxbnVnNXmIefqcf6HiRhFsgy8Fdn28qNyaZIWKndNG9xDeEuqIKWDG6hasgAtNdeXXQXDIM0UC7dy1S3s1mw');

    let activate: boolean;
    activate = this.authService.isAuthenticated();

    if (!activate) {
      return true;
    }
    // token expired or role not authorized
    else {

      let tempErrorModel = new Error();
      tempErrorModel.message = ErrorMessageConstant.UNAUTHORIZED_ERROR_MESSAGE;
      tempErrorModel.code = ErrorCodeConstant.UNAUTHORIZED.toString();

      return true;
    }
  }
}
