import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManningComponent } from './manning.component';

describe('ManningComponent', () => {
  let component: ManningComponent;
  let fixture: ComponentFixture<ManningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

angular.module('tooltipDemo', ['ngMaterial'])
    .controller('AppCtrl', AppCtrl);

function AppCtrl($scope) {
  $scope.demo = {
    showTooltip: false,
    tipDirection: 'i'
  };

  $scope.demo.delayTooltip = undefined;
  $scope.$watch('demo.delayTooltip', function(val) {
    $scope.demo.delayTooltip = parseInt(val, 10) || 0;
  });
}
