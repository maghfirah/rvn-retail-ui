import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorCustomComponent} from './error-custom.component';

describe('ErrorHandlerComponent', () => {
  let component: ErrorCustomComponent;
  let fixture: ComponentFixture<ErrorCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
