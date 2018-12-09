import { TestBed, inject } from '@angular/core/testing';
import { Http, Response, ConnectionBackend, HttpModule  } from '@angular/http';
import { ApicallService } from './apicall.service';

describe('ApicallService', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [
              HttpModule //<<< import it here also
          ],
        providers: [ApicallService, Http, ConnectionBackend]
    });
  });

  it('should be created', inject([ApicallService], (service: ApicallService) => {
    expect(service).toBeTruthy();
  }));
});
