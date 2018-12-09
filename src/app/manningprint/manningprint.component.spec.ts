import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManningprintComponent } from './manningprint.component';

describe('ManningprintComponent', () => {
  let component: ManningprintComponent;
  let fixture: ComponentFixture<ManningprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManningprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManningprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
