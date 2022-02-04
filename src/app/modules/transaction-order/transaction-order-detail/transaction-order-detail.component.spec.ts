import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TransactionOrderDetailComponent} from './transaction-order-detail.component';

describe('TransactionOrderDetailComponent', () => {
  let component: TransactionOrderDetailComponent;
  let fixture: ComponentFixture<TransactionOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionOrderDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
