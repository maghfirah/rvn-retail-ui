import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TncCustomerComponent} from './tnc-customer.component';

describe('TncCustomerComponent', () => {
  let component: TncCustomerComponent;
  let fixture: ComponentFixture<TncCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TncCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TncCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
