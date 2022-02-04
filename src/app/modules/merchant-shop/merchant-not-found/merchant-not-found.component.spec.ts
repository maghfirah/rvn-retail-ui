import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MerchantNotFoundComponent} from './merchant-not-found.component';

describe('MerchantNotFoundComponent', () => {
  let component: MerchantNotFoundComponent;
  let fixture: ComponentFixture<MerchantNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
