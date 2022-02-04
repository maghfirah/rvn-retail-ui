import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RequestService} from '../../../shared/service/request.service';
import {User} from '../../../shared/models/user.model';
import {ActivatedRoute, Params} from '@angular/router';
import {ErrorCodeConstant} from '../../../shared/constant/error-code.constant';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-error-handler-kyb',
  templateUrl: './error-custom.component.html',
  styleUrls: ['./error-custom.component.css']
})
export class ErrorCustomComponent implements OnInit {
  userModel = new User();
  typeError: string;
  kybCode: string = ErrorCodeConstant.KYB;
  kybCodeOld: string = ErrorCodeConstant.KYB_OLD;
  envKybPage = environment.envUrl + "/rr/service-activation";

  constructor(
    private titleService:Title,
    private requestService: RequestService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => this.typeError = params['typeError']);
    this.getToken();
    this.checkCustomError();
  }

  checkCustomError(){
    if(this.typeError === this.kybCodeOld){
      this.titleService.setTitle("Unregistered Service");
    }else if(this.typeError === this.kybCode){
      window.location.href = this.envKybPage;
    }
  }

  getToken(){
    let token = localStorage.getItem('token');
    const decodedToken = this.requestService.decodeToken(token);
    this.userModel = decodedToken.user;
  }

}
