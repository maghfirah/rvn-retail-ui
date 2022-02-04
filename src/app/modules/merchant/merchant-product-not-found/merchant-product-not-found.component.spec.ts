import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MerchantProductNotFoundComponent} from './merchant-product-not-found.component';

describe('MerchantProductNotFoundComponent', () => {
  let component: MerchantProductNotFoundComponent;
  let fixture: ComponentFixture<MerchantProductNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantProductNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantProductNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
