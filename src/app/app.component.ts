import {Component} from '@angular/core';
import {AlertService} from './shared/service/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public alertService: AlertService) { }

  title = 'rvn-retail-ui';
}
