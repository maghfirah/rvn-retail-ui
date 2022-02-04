import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MerchantCheckoutComponent} from './merchant-checkout.component';

describe('MerchantCheckoutComponent', () => {
  let component: MerchantCheckoutComponent;
  let fixture: ComponentFixture<MerchantCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
