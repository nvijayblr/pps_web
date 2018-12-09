import { Injectable, ViewContainerRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../constants/constant';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Router } from '@angular/router';

@Injectable()
export class ApicallService {
    public loading = false;
    public apiHeaderToken;
    public _headers: any = {
        Authorization: ''
    };
    public isGettingAccessToken = false;
    public requestsWaitingForToken = [];
    constructor(
        public http: Http,
        private toastr: ToastsManager,
        private constant: Constant,
        protected storage: AsyncLocalStorage,
        private router: Router
    ) { }

    /*This api call method for getting the token using refresh token*/
    doPostApi(apiUrl, data, successCallback, failureCallback) {
        this.http.post(apiUrl, data, {
            headers: this._headers,
        })
        .subscribe(response => {
            successCallback(response);
        }, error => {
            failureCallback(error);
        });
    }


    getAccessToken(succcessCallback, errorCallback) {
        console.log('localStorage.getItem("refresh_token")', localStorage.getItem("refresh_token"));
        if(!localStorage.getItem("refresh_token")) {
            this.doLogout();
            return;
        }

        /*Storing all the 401 request in requestsWaitingForToken object*/        
        this.requestsWaitingForToken.push(succcessCallback);

        /*If aready getting the access token dot not do anything.*/
        if(!this.isGettingAccessToken) {
          this.isGettingAccessToken = true;
          this.doPostApi(this.constant.baseURL + 'api/refreshtoken', {
            "Token" : localStorage.getItem("refresh_token") 
            }, response => {
              let _body = JSON.parse(response._body);
              let _data = JSON.parse(_body.data);
              if(!_data || !_data.access_token) {
                  this.requestsWaitingForToken = [];
                  this.isGettingAccessToken = false;
                  this.doLogout();
                  return;
              }
              localStorage.setItem('access_token', _data.access_token);
              localStorage.setItem('refresh_token', _data.refresh_token);
              localStorage.setItem('expires_in', _data.expires_in);

              /*Call the buffered functions*/
              for(let i=0; i<this.requestsWaitingForToken.length; i++) {
                this.requestsWaitingForToken[i]();
              }
              this.requestsWaitingForToken = [];
              this.isGettingAccessToken = false;
              //succcessCallback(JSON.parse(response._body));
          }, error => {
              this.requestsWaitingForToken = [];
              this.isGettingAccessToken = false;
              errorCallback(error);
          });
        } else {

        }
    }

    doLogout(error?) {
        this.requestsWaitingForToken = [];
        this.isGettingAccessToken = false;
        this.onSessionToastMessage();
        setTimeout(() => {
            localStorage.removeItem("userData");
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");
            localStorage.removeItem("transactions");
            localStorage.removeItem("access_token");
            localStorage.removeItem("expires_in");
            localStorage.removeItem("refresh_token");
            const link = ['login'];
            this.router.navigate(link);
        }, this.constant.minToastLife);
        document.getElementById('appLoader').hidden = true;
        if(error) {
            this.onErrorToastMessage(error);
        }
    }

    /**
     * @desc Http service call for GET method
     * @param {string} apiUrl api url
     * @param {function} successCallback success callback
     * @param {function} failureCallback failure callback
     **/
    doGetAPIAction(apiUrl, successCallback, failureCallback) {
        if (localStorage.getItem("access_token")) {
            this._headers = {
                Authorization: this.constant.authPrefix + localStorage.getItem("access_token"),
                'Cache-control': 'no-cache',
                'Pragma': 'no-cache'
            };
            this.http
            .get(apiUrl, {
                headers: this._headers,
            })
            .subscribe(response => {
                successCallback(response);
            }, error => {
                /*Invalid access token/toen has benn expired - Unauthorized*/
                if(error.status === 401) {
                    this.getAccessToken(response => {
                        this.doGetAPIAction(apiUrl, successCallback, failureCallback);
                    }, error => {
                        this.doLogout(error);
                        return;
                    });
                    return;
                }
                /*Invalid user authorized - Unauthorized*/
                if(error.status === 403) {
                    this.doLogout(error);
                    return;
                }
                document.getElementById('appLoader').hidden = true;
                this.onErrorToastMessage(error);
            });
        } else {
            this.doLogout();
        }
    }

    /**
     * @desc Http service call for GET method
     * @param {string} apiUrl api url
     * @param {object} header header data
     * @param {function} successCallback success callback
     * @param {function} failureCallback failure callback
     **/
    doGetAPIActionWithHeader(apiUrl, header, successCallback, failureCallback) {
        if (localStorage.getItem("access_token")) {
            header.Authorization = this.constant.authPrefix + localStorage.getItem("access_token");
            header['Cache-control'] = 'no-cache';
            header['Pragma']= 'no-cache';
            this.http
                .get(apiUrl, {
                    headers: header,
                })
                .subscribe(response => {
                    successCallback(response);
                }, error => {
                /*Invalid access token/toen has benn expired - Unauthorized*/
                if(error.status === 401) {
                    this.getAccessToken(response => {
                        this.doGetAPIActionWithHeader(apiUrl, header, successCallback, failureCallback);
                    }, error => {
                        this.doLogout(error);
                        return;
                    });
                    return;
                }
                /*Invalid user authorized - Unauthorized*/
                if(error.status === 403) {
                    this.doLogout(error);
                    return;
                }
                document.getElementById('appLoader').hidden = true;
                this.onErrorToastMessage(error);
            });
        } else {
            this.doLogout();
        }
    }

    /**
     * @desc Http service call for POST method
     * @param {string} apiUrl api url
     * @param {Object} data the data to be posted to the api
     * @param {function} successCallback success callback
     * @param {function} failureCallback failure callback
     **/
    doPostAPIAction(apiUrl, data, successCallback, failureCallback) {
        if (localStorage.getItem("access_token")) {
            this._headers.Authorization = this.constant.authPrefix + localStorage.getItem("access_token");
            this.http
                .post(apiUrl, data, {
                    headers: this._headers,
                })
                .subscribe(response => {
                    successCallback(response);
                }, error => {
                /*Invalid access token/toen has benn expired - Unauthorized*/
                if(error.status === 401) {
                    this.getAccessToken(response => {
                        this.doPostAPIAction(apiUrl, data, successCallback, failureCallback);
                    }, error => {
                        this.doLogout(error);
                        return;
                    });
                    return;
                }
                /*Invalid user authorized - Unauthorized*/
                if(error.status === 403) {
                    this.doLogout(error);
                    return;
                }
                document.getElementById('appLoader').hidden = true;
                this.onErrorToastMessage(error);
            });
        } else {
            this.doLogout();
        }
    }

    /**
 * @desc Http service call for POST method
 * @param {string} apiUrl api url
 * @param {Object} data the data to be posted to the api
 * @param {function} successCallback success callback
 * @param {function} failureCallback failure callback
 **/
    doPostAPIActionWithHeader(apiUrl, header, data, successCallback, failureCallback) {
        if (localStorage.getItem("access_token")) {
            header.Authorization = this.constant.authPrefix + localStorage.getItem("access_token");
            this.http
                .post(apiUrl, data, {
                    headers: header,
                })
                .subscribe(response => {
                    successCallback(response);
                }, error => {
                /*Invalid access token/toen has benn expired - Unauthorized*/
                if(error.status === 401) {
                    this.getAccessToken(response => {
                        this.doPostAPIActionWithHeader(apiUrl, header, data, successCallback, failureCallback);
                    }, error => {
                        this.doLogout(error);
                        return;
                    });
                    return;
                }
                /*Invalid user authorized - Unauthorized*/
                if(error.status === 403) {
                    this.doLogout(error);
                    return;
                }
                document.getElementById('appLoader').hidden = true;
                this.onErrorToastMessage(error);
            });
        } else {
            this.doLogout();
        }
    }

    /**
 * @desc Http service call for GET method
 * @param {string} apiUrl api url
 * @param {function} successCallback success callback
 * @param {function} failureCallback failure callback
 **/
    doGetAPIActionForDomain(apiUrl, successCallback, failureCallback) {
        this.http
            .get(apiUrl, {
            })
            .subscribe(response => {
                successCallback(response);
            }, error => {
                document.getElementById('appLoader').hidden = true;
                this.onErrorToastMessage(error);
            });
    }

    doPostAPIActionwithContentTypeURLEncoded(apiUrl, data, successCallback, failureCallback) {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options: any = new RequestOptions({ headers: headers });
        this.http
            .post(apiUrl, data, options)
            .subscribe(response => {
                successCallback(response);
            }, error => {
                document.getElementById('appLoader').hidden = true;
                this.onLoginErrorToastMessage(error);
            });
    }

    /**
     * @desc show error toast messages
     * @param {Object} error response object
     **/
    onErrorToastMessage(error): void {
        this.loading = false;
        this.toastr.error('Please try after sometime.', 'Failure!', {
            showCloseButton: true, maxShown: 1
        });
    }

    /**
     * @desc show error toast messages
     * @param {Object} error response object
     **/
    onLoginErrorToastMessage(error): void {
        var errorString = JSON.parse(error._body);
        this.loading = false;
        this.toastr.error(errorString.error_description, 'Failure!', {
            showCloseButton: true, maxShown: 1
        });
    }

    /**
 * @desc show error toast messages
 * @param {Object} error response object
 **/
    onSessionToastMessage(): void {
        this.loading = false;
        this.toastr.error(this.constant.sessionMsg, 'Failure!', {
            showCloseButton: true, maxShown: 1
        });
    }

    /**
 * @desc method to get auth headers
 * @param {string} apiUrl api url
 * @param {function} successCallback success callback
 **/
    getHeaders(apiUrl, successCallback): void {
        const headers = new Headers();
        if (apiUrl.indexOf('oauth') > 0) {
            headers.append('Authorization', 'Basic ' + this.constant.loginAPIHeader.Authorization);
            headers.append('Accept', this.constant.loginAPIHeader.Accept);

            successCallback(headers);
        } else {
            this.storage.getItem('loginUser').subscribe((data) => {
                if (data.accesstoken) {
                    if (this.constant.apiHeader.Authorization === '') {
                        this.apiHeaderToken = data.accesstoken;
                    } else {
                        this.apiHeaderToken = this.constant.apiHeader.Authorization;
                    }
                    headers.append('Authorization', 'bearer ' + this.apiHeaderToken);
                    headers.append('Accept', this.constant.apiHeader.Accept);
                    headers.append('Content-Type', this.constant.apiHeader['Content-Type']);

                    successCallback(headers);
                }
            }, () => { });
        }
    }
}
