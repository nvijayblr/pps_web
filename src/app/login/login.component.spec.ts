import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Router, RouterOutlet } from "@angular/router";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login/login.service';
import { Http, Response, ConnectionBackend, HttpModule } from '@angular/http';
import { UrlgeneratorService } from '../utill/urlgenerator/urlgenerator.service';
import { Constant } from '../utill/constants/constant';
import { Languageconstant } from '../utill/constants/languageconstant';
import { ApicallService } from '../utill/apicall/apicall.service';

TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
});

import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [LoginComponent],
        imports: [
            RouterTestingModule, FormsModule, HttpModule //<<< import it here also
        ],
        providers: [LoginService, Http, ConnectionBackend, UrlgeneratorService, Constant, ApicallService, Languageconstant]
        //imports: [RouterOutlet]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
