import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ValidationService {

  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public decimalOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      if(charCode === 46){
        return true;
      }else{
        return false;
      }
    }
    return true;
  }
}
