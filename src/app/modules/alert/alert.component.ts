import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  _data: {message: string, type: string, symbol: string} = {} as any;


  @Input()
  set data(props: {message: string, type: boolean}) {
    this._data.message = props.message;
    this._data.symbol = props.type ? "fa-times-circle" : "fa-check-circle";
    this._data.type = props.type? "alert-danger" : "alert-success";
  }

}
