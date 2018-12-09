import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacktaskComponent } from './packtask.component';

describe('PacktaskComponent', () => {
  let component: PacktaskComponent;
  let fixture: ComponentFixture<PacktaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacktaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacktaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
