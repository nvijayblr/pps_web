import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportpageComponent } from './exportpage.component';

describe('ExportpageComponent', () => {
  let component: ExportpageComponent;
  let fixture: ComponentFixture<ExportpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
