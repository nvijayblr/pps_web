import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurefurnacecapacityComponent } from './configurefurnacecapacity.component';

describe('ConfigurefurnacecapacityComponent', () => {
  let component: ConfigurefurnacecapacityComponent;
  let fixture: ComponentFixture<ConfigurefurnacecapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurefurnacecapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurefurnacecapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
