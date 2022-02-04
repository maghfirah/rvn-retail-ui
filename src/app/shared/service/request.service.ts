import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {catchError, map, timeout} from 'rxjs/operators';
import {User} from '../models/user.model';

declare var swal: any;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({providedIn: 'root'})
export class RequestService {
  private contentPathURL: string;
  private bodyJSON: any;
  private pathParameters: Map<string, string>;
  private _file;
  public timeout = 10000;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  decodeToken(token){
    if(token === null){
      throw new Error('Token is null');
    }
    const helper = new JwtHelperService();
    return helper.decodeToken(token);
  }

  get(path, parameters) {
    this.setContentPathURL(path);
    this.setPathParameters(parameters);
    return this.requestGet();
  }

  getHttpParams() {
    let params = new HttpParams();
    const mapPathParams = this.getPathParameters();
    if(mapPathParams !== null){
      mapPathParams.forEach((value, key) => {
        params = params.append(key, value);
      })
    }
    return params;
  }

  delete(path, parameters) {
    this.setContentPathURL(path);
    this.setPathParameters(parameters);
    return this.requestDelete();
  }

  requestDelete(): any {
    const headers = this.getHeaders();
    const params = this.getHttpParams();
    return this.http
      .delete(this.getFullRequestURL(), { headers, observe: 'response', params})
      .pipe(
        timeout(this.timeout),
        map((response) => this.responseProcessor(response)),
        catchError((error) => this.errorProcessor(error))
      );
  }

  post(path, parameters, body) {
    this.setContentPathURL(path);
    this.setPathParameters(parameters);
    this.setBodyJSON(body);
    return this.requestPost();
  }

  put(path, parameters, body) {
    this.setContentPathURL(path);
    this.setPathParameters(parameters);
    this.setBodyJSON(body);
    return this.requestPut();
  }

  requestGet(): any {
    const headers = this.getHeaders();
    const params = this.getHttpParams();
    return this.http
      .get(this.getFullRequestURL(), { headers, observe: 'response', params})
      .pipe(
        timeout(this.timeout),
        map((response) => this.responseProcessor(response)),
        catchError((error) => this.errorProcessor(error))
      );
  }

  uploadSingleFile(paramName:string, path, file: File, index?:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token') });
    this.setContentPathURL(path);
    const formData: FormData = new FormData();
    formData.append(paramName, file);
    if (typeof index !== 'undefined') {
      formData.append("index",index);
    }
    return this.http.post(this.getFullRequestURL(), formData, { headers, observe: 'response'});
  }

  requestPost() {
    const headers = this.getHeaders();
    const params = this.getHttpParams();
    return this.http
      .post(this.getFullRequestURL(), this.getBodyJSON(), { headers, observe: 'response', params })
      .pipe(
        timeout(this.timeout),
        map((response) => this.responseProcessor(response)),
        catchError((error) => this.errorProcessor(error))
      );
  }

  requestPut() {
    const headers = this.getHeaders();
    const params = this.getHttpParams();
    return this.http
      .put(this.getFullRequestURL(), this.getBodyJSON(), { headers, observe: 'response', params })
      .pipe(
        timeout(this.timeout),
        map((response) => this.responseProcessor(response)),
        catchError((error) => this.errorProcessor(error))
      );
  }

  requestPostUploadFile(path, formDataFile){
    this.setContentPathURL(path);
    return this.http
      .post(this.getFullRequestURL(), formDataFile, {observe: 'response'})
      .pipe(
        timeout(this.timeout),
        map((response) => this.responseProcessor(response)),
        catchError((error) => this.errorProcessor(error))
      );
  }

  private responseProcessor(response) {
    if (response.status == 200 || 201) {
      var res = response.body
      return res;
    }
  }

  private errorProcessor(error) {
    return throwError(error);
  }

  setContentPathURL(contentPathURL: string): RequestService {
    this.contentPathURL = contentPathURL;
    return this;
  }

  getContentPathURL() {
    return this.contentPathURL;
  }

  setPathParameters(pathParameters: Map<string, string>): RequestService {
    this.pathParameters = pathParameters;
    return this;
  }

  getPathParameters() {
    return this.pathParameters;
  }

  setBodyJSON(body: any): RequestService {
    this.bodyJSON = JSON.stringify(body);
    return this;
  }

  getBodyJSON() {
    return this.bodyJSON;
  }

  getHeaders() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + localStorage.getItem('token') });
    return headers;
  }

  getHttpHeaders() {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'auth jwt',
    });
    let apiVersion = '1';
    if (apiVersion) {
      httpHeaders.append('Version', apiVersion);
    }
    return httpHeaders;
  }

  paramsFiles() {
    const params = new URLSearchParams();
    params.append('file', this._file);
    return params;
  }

  setFile(file) {
    this._file = file;
    return this;
  }

  getFullRequestURL() {
    let fullRequestURL = this.getContentPathURL();
    if (this.pathParameters) {
      this.pathParameters.forEach((value: string, key: string) => {
        fullRequestURL = fullRequestURL.replace(key, value);
      });
    }
    if (fullRequestURL.indexOf('sort=') === -1) {
      if (fullRequestURL.indexOf('?') === -1) {
        fullRequestURL = fullRequestURL;
      } else {
        fullRequestURL = fullRequestURL;
      }
    }
    return fullRequestURL;
  }

  getUserToken() : User{
    let token = localStorage.getItem('token');
    const decodedToken = this.decodeToken(token);
    return decodedToken.user;
  }

}
