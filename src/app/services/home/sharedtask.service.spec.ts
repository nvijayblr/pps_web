import { TestBed, inject } from '@angular/core/testing';

import { SharedtaskService } from './sharedtask.service';

describe('SharedtaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedtaskService]
    });
  });

  it('should be created', inject([SharedtaskService], (service: SharedtaskService) => {
    expect(service).toBeTruthy();
  }));
});
