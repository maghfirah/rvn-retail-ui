import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigurationStoreLocationComponent} from './configuration-store-location.component';

describe('ConfigurationStoreLocationComponent', () => {
  let component: ConfigurationStoreLocationComponent;
  let fixture: ComponentFixture<ConfigurationStoreLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationStoreLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationStoreLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
