import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AlertService {

  alertProp: {message: string, type: boolean} = {} as any;
  message = '';
  isError = true;
  timeLeft: number = 10;
  interval;
  constructor() { }

  setProps(message: string, isError: boolean){
    this.alertProp.type = isError;
    if(this.message !=""){
      this.alertProp.message = this.alertProp.message + ", "  + message
    }else{
      this.alertProp.message = message;
      this.startTimer();
    }
  }

  getProps() {
    return this.alertProp;
  }

  getMessage() {
    return this.message;
  }

  isAlert() {
    return this.alertProp.message && this.timeLeft > 0;
  }

  startTimer() {
    this.timeLeft = 10;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else if (this.timeLeft === 0){
        this.message = '';
        clearInterval(this.interval);
      } else {
        this.timeLeft = 2;
      }
    }, 1000);
  }

}
