import {Inject, Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {RequestService} from '../service/request.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../models/user.model';
import {APP_BASE_HREF, PlatformLocation} from '@angular/common';
import {PermissionConstant} from '../constant/permission.constant';

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(
    public requestService: RequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pLocation: PlatformLocation,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {}

  isAuthenticated(): boolean {
    const helper = new JwtHelperService();
    let token = localStorage.getItem('token');

    //validation token expired or token null
    if (helper.isTokenExpired(token)) {
      console.warn('Token Expired : ' + helper.getTokenExpirationDate(token));
      return true;
    }
    //validation role for path
    else {
      const decodedToken = this.requestService.decodeToken(token);
      let user: User = decodedToken.user;
      //check path registered
      for (let permission in PermissionConstant) {
        if (this.baseHref + PermissionConstant[permission].path === this.pLocation.pathname) {
          //allow path registered for role or empty role
          if (PermissionConstant[permission].role.search(user.roleName) !== -1 || PermissionConstant[permission].role === '') {
            return false;
          }
          //path registered, have role but dont match
          else{
            console.warn('Permission Denied for Role : ' + user.roleName);
            return true;
          }
        }
      }
      //allow path unregistered
      return false;
    }

  }
}
