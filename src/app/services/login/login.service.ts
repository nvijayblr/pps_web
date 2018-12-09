import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'

import { Constant } from '../../utill/constants/constant';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../utill/apicall/apicall.service';

@Injectable()
export class LoginService {

  constructor(
    private http: Http,
    private urlgeneratorService: UrlgeneratorService,
    private apicallService: ApicallService
  ) { }

  /**
   * @desc Api call for login user
   * @param {Object} creds user credentials
   * @param {function} successCallback success callback
   * @param {function} failureCallback failure callback
   **/
  loginUserAuth(creds, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getLoginUserAuthURL();
    this.apicallService.doPostAPIActionwithContentTypeURLEncoded(apiUrl, creds, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }

  getDomainList(successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getDomainListUrl();
    this.apicallService.doGetAPIActionForDomain(apiUrl, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }

  getAuthorization(requestBody, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getAuthURL();
    this.apicallService.doGetAPIAction(apiUrl, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
    // this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
    //   successCallback(JSON.parse(response._body))
    // }, error => {
    //   errorCallback(error)
    // });
  }

  /* Pass our module name, will return access */
  getUserTransaction(moduleName) {
    var access = null;
    if (localStorage.getItem("transactions")) {
      var apiData = JSON.parse(atob(localStorage.getItem("transactions")));
      var transctionWeightage = 0;
      if (apiData[0].RoleModuleTransactions.length > 0) {
        /* Get given module's transaction */
        var modObj = apiData[0].RoleModuleTransactions.filter(function (mod) {
          return mod.Module.ModuleCode === moduleName;
        });
        if (modObj.length > 0) {
          var moduleTransaction = modObj[0].Transaction.TransactionName;
          var transObj = apiData[0].Transactions.filter(function (trns) {
            return trns.TransactionName === moduleTransaction;
          });
          transctionWeightage = transObj[0].TransactionWeightage;
        }
        /* */

        /* Heightest weightage (Full access weightage) */
        var highTransObj = apiData[0].Transactions.filter(function (trn) {
          return trn.TransactionName === 'FullAccess';
        });
        var highTransctionWeightage = highTransObj[0].TransactionWeightage; /*30 for FullAccess*/
        /* */

        if (transctionWeightage === 0) {
          /* No access */
          access = null;
        }
        else if (transctionWeightage < highTransctionWeightage) {
          /* View access */
          access = false;
        }
        else if (transctionWeightage === highTransctionWeightage) {
          /* Full access */
          access = true;
        }
      }
    }
    return access;
  }
}
