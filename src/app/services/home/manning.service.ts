import { Injectable } from '@angular/core';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../utill/apicall/apicall.service';

@Injectable()
export class ManningService {

  constructor(
    private urlgeneratorService: UrlgeneratorService,
    private apicallService: ApicallService
  ) { }

  //Manning data get api for calculate manning
  getManningDetails(header, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getManningURL();
    this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  //Manning role data get api for master input
  getManningRoleDetails(header, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getManningRoleURL();
    this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  //Manning crew data get api for master input
  getManningCrewDetails(header, crewId, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getManningCrewDetailURL(crewId);
    this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  //Manning crew get api for master input
  getManningCrew(successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getManningCrewURL();
    this.apicallService.doGetAPIAction(apiUrl, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  //Manning Role edit post api for master input
  editManningRoles(requestBody, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.saveManningRoleDetailsURL();

    this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  //Manning crew details edit post api for master input
  editCrewDetils(requestBody, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.saveCrewDetailsURL();

    this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  //Manning print details post api
  exportManningPacks(requestBody, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getExportManningPackstFromAPIURL();

    this.apicallService.doGetAPIActionWithHeader(apiUrl, requestBody, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
}
