import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { Http, Response, ConnectionBackend, HttpModule } from '@angular/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

TestBed.configureTestingModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
});

import { RouterTestingModule } from '@angular/router/testing';
import { Constant } from '../utill/constants/constant';
import { UrlgeneratorService } from '../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../utill/apicall/apicall.service';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        RouterTestingModule, HttpModule //<<< import it here also
      ],
      providers: [Constant, UrlgeneratorService, ApicallService, Http, ConnectionBackend],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
