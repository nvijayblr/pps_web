import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'

import { Constant } from '../../utill/constants/constant';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../utill/apicall/apicall.service';

@Injectable()
export class ProductionService {

    constructor(
        private http: Http,
        private urlgeneratorService: UrlgeneratorService,
        private apicallService: ApicallService
    ) { }
    //Primary production data get api for scheduling
    getPrimaryProductionDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getPrimaryProductionURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Simulation data get api for production scheduling
    getSimulationDetails(header, type, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getSimulationDetailsURL(type);
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Simulation data get api for pack scheduling
    getPackSimulationDetails(header, type, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getPackSimulationDetailsURL(type);
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Simulation data get api for manning
    getPackSimulationDetailsForManning(header,successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.GetManningSimulationURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Decor production data get api for scheduling
    getDecorProductionDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getDecorProductionURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //VAP production data get api for scheduling
    getVAPProductionDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getVAPProductionURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Miscellaneous production data get api for scheduling
    getMiscellaneousProductionDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getMiscellaneousProductionURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Refresh task get api for scheduling
    getProdTaskRefresh(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getProdTaskRefreshURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Primary pack data get api for scheduling
    getPrimaryPackDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getPrimaryPackURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Decor pack data get api for scheduling
    getDecorPackDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getDecorPackURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Vap pack data get api for scheduling
    getVapPackDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getVapPackURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Miscellaneous pack data get api for scheduling
    getMiscellaneousPackDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getMiscellaneousPackURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
      //Set and  pack data get api for scheduling
      getSetAndPackDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getSetAndPackURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Unscheduled tasks details get api for scheduling
    getUnscheduledTasksDetails(header, type, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getUnscheduledTasksDetailsURL(type);
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Rescheduled tasks details get api for scheduling
    getRescheduledTasksDetails(header, selectedUnscheduledTask, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getRescheduledTasksDetailsURL(selectedUnscheduledTask);
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Delete tasks get api for scheduling
    geDeleteScheduleTask(selectedTask, successCallback, errorCallback) {
        let header = {
            'UserID': atob(localStorage.getItem("userId"))
        };
        const apiUrl = this.urlgeneratorService.geDeleteScheduleTaskURL(selectedTask);
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Reason for change dropdown get api for scheduling
    getReasonForChangeFromAPIDetails(selectedTask, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getReasonForChangeFromAPIDetailsURL(selectedTask);
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Modify task duration post api for scheduling
    getupdateModifyScheduleTask(selectedTask, modifiedObject, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getupdateModifyScheduleTaskURL(selectedTask);
        selectedTask.BeginDate = new Date(modifiedObject.newStartDate.getTime() - (modifiedObject.newStartDate.getTimezoneOffset() * 60000)).toJSON();
        selectedTask.EndDate = new Date(modifiedObject.newEndDate.getTime() - (modifiedObject.newEndDate.getTimezoneOffset() * 60000)).toJSON();
        selectedTask.TaskReasonForChangeId = modifiedObject.reasonforChange;
        selectedTask.QuantItems = Number(modifiedObject.newQuantity);
        this.apicallService.doPostAPIAction(apiUrl, selectedTask, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Reschedule task post api for scheduling
    getupdateReScheduleTask(selectedTask, modifiedObject, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getUpdateRescheduledRescheduledTasksURL();

        const requestBody = {
            "LineDescription": selectedTask.LineDescription,
            "BeginDate": new Date(modifiedObject.startDate.getTime() - (modifiedObject.startDate.getTimezoneOffset() * 60000)).toJSON(),
            "EndDate": new Date(modifiedObject.endDate.getTime() - (modifiedObject.endDate.getTimezoneOffset() * 60000)).toJSON(),
            "TotalMinutes": selectedTask.TotalMinutes,
            "MachineLineID": selectedTask.MachineLineID,
            "TaskNumber": selectedTask.TaskNumber,
            "ItemNumber": selectedTask.ItemNumber,
            "TaskStatusCode": selectedTask.TaskStatusCode,
        }
        let header = {
            'UserID' : atob(localStorage.getItem("userId"))
        };
        this.apicallService.doPostAPIActionWithHeader(apiUrl, header, requestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Add new task post api for scheduling
    addNewTaskAPI(addNewtaskdata, addNewTaskObject, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.geAddNewTaskTaskURL();

        const requestBody = {
            'Id': 0,
            'BeginDate': new Date(addNewtaskdata.startDate.getTime() - (addNewtaskdata.startDate.getTimezoneOffset() * 60000)).toJSON(),
            'StartingHour': '',
            'EndingHour': '',
            'EndDate': new Date(addNewtaskdata.endDate.getTime() - (addNewtaskdata.endDate.getTimezoneOffset() * 60000)).toJSON(),
            'IsContinueation': false,
            'TonsPerDay': 0,
            'Description': '',
            'ProductionOrder': 0,
            'ProductDiamension': 0,
            'IsOngoing': false,
            'IsScheduledMaintanance': false,
            'TaskNumber': 0,
            'ItemNumber': addNewtaskdata.createPacktaskStatusItemNumber,
            'TaskStatusCode': 0,
            'QuantItems': addNewtaskdata.quantity,
            'NTables': 0,
            'NMolds': 0,
            'NOperations': 0,
            'Speed': addNewtaskdata.speed,
            'Yield': 0,
            'nChannl': 0,
            'ItemGrossWeight': 0,
            'ItemNetWeight': 0,
            'SpeedFactor': addNewtaskdata.yieldFactor,
            'NOM': 0,
            'ItemsPerMinute': 0,
            'PullTonsPerDay': addNewtaskdata.pullTonsPerDay,
            'TotalTonsPerTask': 0,
            'TaskStatus': 0,
            'Begin_Date': '00:00',
            'VcaPoNumber': 0,
            'TaskReasonForChangeId': 0,
            'ObjTaskStatus': 7,
            'Machine_LineId': addNewtaskdata.selectLine,
            'IsPackTask': addNewtaskdata.createPacktaskStatus,
            'Manning': addNewtaskdata.createPacktaskManning,

        }
        let header = {
            'UserID' : atob(localStorage.getItem("userId"))
        };
        this.apicallService.doPostAPIActionWithHeader(apiUrl, header, requestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Change operating mode post api for scheduling
    changeOperatingModeAPI(addNewtaskdata, changeOperatingModeObject, alternateGammeOptionsSelectedData, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getChangeOperatingModePostURL(addNewtaskdata);

        const requestBody = {


            "Nom": alternateGammeOptionsSelectedData.Nom,
            "GammeId": alternateGammeOptionsSelectedData.GammeId,
            "NChannel": alternateGammeOptionsSelectedData.NChannel,
            "LChannel": alternateGammeOptionsSelectedData.LChannel,
            "ScheduledStartDate": new Date(changeOperatingModeObject.startDate.getTime() - (changeOperatingModeObject.startDate.getTimezoneOffset() * 60000)).toJSON(),
            "ScheduledEndDate": new Date(changeOperatingModeObject.endDate.getTime() - (changeOperatingModeObject.endDate.getTimezoneOffset() * 60000)).toJSON(),


        }

        this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    //Change operating mode get api for scheduling
    getchangeOperatingMode(selectedTask, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getchangeOperatingModeURL(selectedTask);
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Legend details get api
    getLegendDetails(selectedTask, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getLegendDetailsURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Forming line details get api
    getFormingLinesDetails(selectedTask, type, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getFormingLinesDetailsURL(type);
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Gamme option  data get api for scheduling
    loadGetGammeOptionData(selectedTask, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getchangeOperatingModeURL(selectedTask);
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    // Job change details get api for scheduling
    getPopupJobchangeDetails(header, Task, selectionchange, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getpopupDetailsJobChanges(Task, selectionchange);
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    // Edit task details get api for scheduling
    getEditTasksDetails(taskNumber, successCallback, errorCallback) {

        const header = {
            'TaskId': taskNumber

        }
        const apiUrl = this.urlgeneratorService.getEditTaskDetailsURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    editTasksSaveAPI(modifiedObject, successCallback, errorCallback) {
        let header = {
            'UserID' : atob(localStorage.getItem("userId"))
        };
        const apiUrl = this.urlgeneratorService.EditTaskSaveURL();
        this.apicallService.doPostAPIActionWithHeader(apiUrl, header, modifiedObject, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    // getPrintModelDetails(header, modifiedObject,successCallback, errorCallback) {
    //     const apiUrl = this.urlgeneratorService.getPrintModel();
    //     this.apicallService.doPostAPIAction(apiUrl, modifiedObject, response => {
    //         successCallback(JSON.parse(response._body))
    //     }, error => {
    //         errorCallback(error)
    //     });
    // }

    exportSchedulesSaveAPI(selectedTask,modifiedObject, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExportSchedulesURL();
        this.apicallService.doPostAPIAction(apiUrl, modifiedObject, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    loadExportDetails(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExportDetails();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Change Summary get api
    getChangeSummary(fromDate, type, successCallback, errorCallback) {
        const header = {
            'FromDate': fromDate
        }
        const apiUrl = this.urlgeneratorService.getChangeSummaryURL(type);
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    //Change Summary Detail get api
    getChangeSummaryDetail(taskId, successCallback, errorCallback) {
        const header = {
            'TaskId': taskId,
            'UserName' : atob(localStorage.getItem("userName"))
        }
        const apiUrl = this.urlgeneratorService.getChangeSummaryDetailURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    // Default Furnace List get api
    getDefaultFurnaceListFromAPIDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getDefaultFurnaceListURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    // Furnace History Details get api
    getFurnaceHistoryFromAPIDetails(header, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getFurnaceHistoryFromAPIDetailsURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
     // Furnace History Details Delete get api
     getFurnaceHistoryDeleteAPI(FurnaceCapacityDetailsId, successCallback, errorCallback) {
        const header = {
            "FurnaceDetailId":FurnaceCapacityDetailsId.toString()
        }
        const apiUrl = this.urlgeneratorService.getDeleteFurnaceHistoryFromAPIDetailsURL();
        this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    // Default Furnace List save api
    saveDefaultCapacityAPI(modifiedObject, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.saveDefaultCapacityURL();
        this.apicallService.doPostAPIAction(apiUrl, modifiedObject, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
     // Edit Furnace Capacity save api
     saveFurnaceHistoryCapacityAPI(modifiedObject, successCallback, errorCallback) {
        modifiedObject = {
            
                "FurnaceCapacityDetailsId":modifiedObject.FurnaceCapacityDetailsId,
                "FurnaceCapacity":modifiedObject.FurnaceCapacity,
                "FurnaceCapacityFromDate":modifiedObject.FurnaceCapacityFromDate,
                "FurnaceCapacityToDate":modifiedObject.FurnaceCapacityToDate,
                "FurnaceCapacityModifiedOn":modifiedObject.FurnaceCapacityModifiedOn,
                "FurnaceCapacityModifiedBy":modifiedObject.FurnaceCapacityModifiedBy,
                "FurnaceModel":modifiedObject.FurnaceModel
              }
              
              
        const apiUrl = this.urlgeneratorService.saveFurnaceHistoryCapacityAPIURL();
        this.apicallService.doPostAPIAction(apiUrl, modifiedObject, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
      // Edit Furnace Capacity save api
      saveFurnaceCapacityAPI(modifiedObject, successCallback, errorCallback) {
        modifiedObject = {
            "FurnaceModel":
              {
                "FurnaceId":modifiedObject.furanceId,
              },
              "FurnaceCapacityFromDate":modifiedObject.startDate.toString(),
              "FurnaceCapacityToDate":modifiedObject.endDate.toString(),
              "FurnaceCapacity":modifiedObject.newCapacity
          }
        const apiUrl = this.urlgeneratorService.saveFurnacetCapacityURL();
        this.apicallService.doPostAPIAction(apiUrl, modifiedObject, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
     // Retrieve button in Edit furnace capacity save api
    retrieveButtonAPI(modifiedObject, successCallback, errorCallback) {
        modifiedObject = {
            "FurnaceModel":
              {
                "FurnaceId":modifiedObject.furanceId,
              },
              "FurnaceCapacityFromDate":modifiedObject.startDate.toString(),
              "FurnaceCapacityToDate":modifiedObject.endDate.toString()
          }
          
        const apiUrl = this.urlgeneratorService.retrieveButtonAPIURL();
        this.apicallService.doPostAPIAction(apiUrl, modifiedObject, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    approveJobChangesAPI(jobChangesObject, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.approveJobChangesURL();
        this.apicallService.doPostAPIAction(apiUrl, jobChangesObject, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    goToEditTaskURL(TaskNumber, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.goToEditTasksURL(TaskNumber);
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    // Get users list by passing user name
    getUserNames(userName, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getUserNamesURL() + userName;
        this.apicallService.doGetAPIActionWithHeader(apiUrl, {}, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    // checking Conflict and get conflicted list
    postConflictedTasksList(selectedTaskObject, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getConflictedTasks();
        this.apicallService.doPostAPIAction(apiUrl,selectedTaskObject, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
     }
}

