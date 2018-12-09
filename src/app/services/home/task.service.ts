import { Injectable } from '@angular/core';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../utill/apicall/apicall.service';

@Injectable()
export class TaskService {

  constructor(
    private urlgeneratorService: UrlgeneratorService,
    private apicallService: ApicallService
  ) { }

  /* Edit task : Gamme options get api for scheduling */
  getGammeOptions(taskNumber, successCallback, errorCallback) {
    const header = {
      'TaskId': taskNumber
    }
    /**NEED TO CHANGE this url for gamme*/
    const apiUrl = this.urlgeneratorService.getEditTaskDetailsURL();
    this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }

  // Get Create task details
  getCreateTaskDetails(successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getCreateTaskDetailsURL();
    this.apicallService.doGetAPIActionWithHeader(apiUrl, {}, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }

  // Get items list by passing item number
  getItemNumbers(_itemNumber, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getItemNumbersURL() + _itemNumber;
    this.apicallService.doGetAPIActionWithHeader(apiUrl, {}, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }

  // Get items list by passing item number
  getItemDescription(_itemNumber, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getItemDescriptionURL() + _itemNumber;
    this.apicallService.doGetAPIActionWithHeader(apiUrl, {}, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }

  // Get items list by passing item number
  getTaskStatusList(successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getTaskStatusListURL();
    this.apicallService.doGetAPIActionWithHeader(apiUrl, {}, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }


  /* Edit task :task summary get api for scheduling */
  getEditTasksDetails(taskNumber, successCallback, errorCallback) {

    const header = {
      'TaskId': taskNumber

    }
    const apiUrl = this.urlgeneratorService.getTaskSummaryDetailsFromAPIURL();
    this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  /* Edit task :gamme option post api for scheduling */
  ProdTaskGammeAPI(taskId, taskDetails, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getProdTaskGammeFromAPIURL();
    const requestBody = {
      'TaskId': taskId ? taskId : '',
      'ItemNumber': taskDetails.ItemNumber,
      'Nom': taskDetails.NOM,
      'Nchannel': taskDetails.Nchannel
    }
    this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }


  /* Edit task :pack task post api for scheduling */
  PackTaskDetailsOnGammeSelectionFromAPI(taskDetails, gammeDetails, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getPackTaskDetailsOnGammeSelectionFromAPIURL();

    const requestBody = {
      'ItemNumber': taskDetails.ItemNumber,
      'Nom': gammeDetails.Nom,
      'Nchannel': gammeDetails.NChannel,
      'TaskNumber': taskDetails.TaskNumber,
      'MachineLineId':gammeDetails.Machine_LineId
    }

    this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  /* Edit task :special gamme post api for scheduling */
  SpecialGammeDetailsOnGammeSelectionFromAPI(gammeDetails, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getSpecialGammeDetailsOnGammeSelectionFromAPIURL();

    const requestBody = {
      'Machine_LineId': gammeDetails.Machine_LineId,
      'Nom': gammeDetails.Nom,
      'Nchannel': gammeDetails.NChannel,
      'SpeedFactor': gammeDetails.SpeedFactor
    }

    this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  /* Edit task :machine list post api for scheduling */
  MachineListDetailsOnGammeSelectionFromAPI(gammeDetails, taskDetails, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getMachineListFromAPIURL();

    const requestBody = {
      'ScheduleGroup': taskDetails.SchGroup,
      'Description': gammeDetails.MacDescription
    }

    this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  /* Edit task :reason for change get api for scheduling */
  ReasonForChangeFromAPI(successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getTaskReasonForChangeFromAPIURL();
    this.apicallService.doGetAPIAction(apiUrl, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  /* Edit task :comment details get api for scheduling */
  CommentDetailsFromAPI(taskNumber, successCallback, errorCallback) {
    const header = {
      'TaskId': taskNumber
    }
    const apiUrl = this.urlgeneratorService.getCommentDetailsFromAPIURL();
    this.apicallService.doGetAPIActionWithHeader(apiUrl, header, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
  /* Edit task :save api for edit task for scheduling */
  saveEditTaskDetails(taskDetails, successCallback, errorCallback) {
    const apiUrl = this.urlgeneratorService.getEditTaskDetailsFromAPIURL();
    var editTaskData = taskDetails;
    var editTaskDetails = editTaskData;
    for (let i = 0; i < editTaskDetails.PackTaskGamme.length; i++) {
      if (editTaskDetails.PackTaskGamme[i].Checked === true) {
        editTaskDetails.PackTaskGamme[i].BeginDate = new Date(editTaskDetails.PackTaskGamme[i].BeginDate.getTime() - (editTaskDetails.PackTaskGamme[i].BeginDate.getTimezoneOffset() * 60000)).toJSON();
        editTaskDetails.PackTaskGamme[i].EndDate = new Date(editTaskDetails.PackTaskGamme[i].EndDate.getTime() - (editTaskDetails.PackTaskGamme[i].EndDate.getTimezoneOffset() * 60000)).toJSON();
      }
    }
    editTaskDetails.TaskSummmary.BeginDate = new Date(editTaskDetails.TaskSummmary.BeginDate.getTime() - (editTaskDetails.TaskSummmary.BeginDate.getTimezoneOffset() * 60000)).toJSON();
    editTaskDetails.TaskSummmary.EndDate = new Date(editTaskDetails.TaskSummmary.EndDate.getTime() - (editTaskDetails.TaskSummmary.EndDate.getTimezoneOffset() * 60000)).toJSON();
    const header = {
      'UserID': atob(localStorage.getItem("userId")),
    }

    this.apicallService.doPostAPIActionWithHeader(apiUrl, header, editTaskDetails, response => {
      successCallback(JSON.parse(response._body))
    }, error => {
      errorCallback(error)
    });
  }
/* Edit task :special gamme post api for scheduling */
sendAcknowledgementFromAPIURL(gammeDetails, taskDetails, selectedLineName, successCallback, errorCallback) {
  const apiUrl = this.urlgeneratorService.getSendAcknowledgementFromAPIURL();

  const requestBody = {

    'TaskNo': taskDetails.TaskNumber,
    'InvalidLineID': gammeDetails.MacDescription,
    'NOM': taskDetails.NOM,
    'NChannel': taskDetails.Nchannel,
    'CurrentLineID': selectedLineName,
    'Username': atob(localStorage.getItem("userName")),
  }

  this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
    successCallback(JSON.parse(response._body))
  }, error => {
    errorCallback(error)
  });
}
}
