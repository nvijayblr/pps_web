import { TestBed, inject } from '@angular/core/testing';

import { ManningService } from './manning.service';

describe('ManningService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManningService]
    });
  });

  it('should be created', inject([ManningService], (service: ManningService) => {
    expect(service).toBeTruthy();
  }));
});
