import { Injectable } from '@angular/core';

Injectable()
export class Constant {

    // baseURL='https://ppsdev.amer.dmai.net/'; //Stagging
    // baseURL='https://pps.amer.dmai.net/'; //Production
    baseURL = 'http://192.168.2.46:8250/'; //DEV
    // baseURL = 'http://192.168.2.46:8091/'; //QA
    // baseURL = 'http://192.168.2.46:9633/'; //DEV DEMO

    loginUser = { email: '' };
    selectedProjectId: 0;
    editMode: 'false';
    complaintNum: '';
    toastLife = 10000;
    loginAPIHeader = {
        'Authorization': 'YWNjb3VudGluZ0Jhc2VTeXN0ZW06c2VjcmV0',
        'Accept': 'application/json'
    };
    apiHeader = {
        'Authorization': '',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    searchObject = {
        'custName': '',
        'claimInitatorFromdate': '',
        'claimInitatorTodate': '',
        'claimTypeSelectedValue': '0',
        'CARNo': '',
        'invoiceNum': '',
        'claimStatusSelectedValue': '0',
        'claimCategorySelectedValue': '0',
        'convetedFromdate': '',
        'convetedTodate': '',
        'searchSatus' : false
    };
    priprodBtnStatusObject = {
        'btnName': 'Primary Production',
        'index': 0
    };
    onEachScheduleTap;
    fromSimulateChange = false;
    editFromChangeSummary = false
    isSimulated = false;
    weekStartday;
    serverError = 'Internal server error.';
    failure = 'Failure!';
    authPrefix = 'bearer ';
    minToastLife = 1000;
    sessionMsg = 'Session Expired';
    clientId = '689b779306714a0ea47677d6decd20a0';
    /* do not change moduleArray order */
    moduleArray = [
        'PRIMARY',
        'DECOR',
        'VAP',
        'MISC',
        'SETPACK',
        'MANNING'
    ];
    noAccessMsg = 'You have no access to this module';
    informationMsg = 'End date should be greater than Start date';
    informationLabel = 'Information';
}
