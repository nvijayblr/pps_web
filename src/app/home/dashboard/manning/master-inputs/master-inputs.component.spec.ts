import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterInputsComponent } from './master-inputs.component';

describe('MasterInputsComponent', () => {
  let component: MasterInputsComponent;
  let fixture: ComponentFixture<MasterInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
