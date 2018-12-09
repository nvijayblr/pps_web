import { TestBed, inject } from '@angular/core/testing';

import { UrlgeneratorService } from './urlgenerator.service';
import { Constant } from '../constants/constant';
import { ApicallService } from '../apicall/apicall.service';
import { Http, Response, ConnectionBackend, HttpModule } from '@angular/http';

describe('UrlgeneratorService', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [
              HttpModule //<<< import it here also
          ],
        providers: [UrlgeneratorService, Constant, ApicallService, Http, ConnectionBackend]
    });
  });

  it('should be created', inject([UrlgeneratorService], (service: UrlgeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
