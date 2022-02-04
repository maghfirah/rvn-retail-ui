import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCartListComponent } from './merchant-cart-list.component';

describe('MerchantCartListComponent', () => {
  let component: MerchantCartListComponent;
  let fixture: ComponentFixture<MerchantCartListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantCartListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
