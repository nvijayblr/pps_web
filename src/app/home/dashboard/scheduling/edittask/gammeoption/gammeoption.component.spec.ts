import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GammeoptionComponent } from './gammeoption.component';

describe('GammeoptionComponent', () => {
  let component: GammeoptionComponent;
  let fixture: ComponentFixture<GammeoptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GammeoptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GammeoptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
