import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InternalDetailComponent} from './internal-detail.component';

describe('InternalDetailComponent', () => {
  let component: InternalDetailComponent;
  let fixture: ComponentFixture<InternalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
