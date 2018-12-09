import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductiontaskComponent } from './productiontask.component';

describe('ProductiontaskComponent', () => {
  let component: ProductiontaskComponent;
  let fixture: ComponentFixture<ProductiontaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductiontaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductiontaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
