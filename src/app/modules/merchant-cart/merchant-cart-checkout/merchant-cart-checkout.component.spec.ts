import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCartCheckoutComponent } from './merchant-cart-checkout.component';

describe('MerchantCartCheckoutComponent', () => {
  let component: MerchantCartCheckoutComponent;
  let fixture: ComponentFixture<MerchantCartCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantCartCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCartCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
