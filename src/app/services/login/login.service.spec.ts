import { TestBed, inject } from '@angular/core/testing';
//import { UrlgeneratorService } from '../utill/urlgenerator/urlgenerator.service';
import { LoginService } from './login.service';
import { Constant } from '../../utill/constants/constant';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { Http, Response, ConnectionBackend, HttpModule } from '@angular/http';
import { ApicallService } from '../../utill/apicall/apicall.service';


describe('LoginService', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [
              HttpModule //<<< import it here also
          ],
          providers: [LoginService, Constant, ApicallService, UrlgeneratorService, Http, ConnectionBackend]
    });
  });

  it('should be created', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));
});
