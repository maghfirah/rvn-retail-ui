import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MerchantShopProdComponent} from './merchant-shop-prod.component';

describe('MerchantShopProdComponent', () => {
  let component: MerchantShopProdComponent;
  let fixture: ComponentFixture<MerchantShopProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantShopProdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantShopProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
