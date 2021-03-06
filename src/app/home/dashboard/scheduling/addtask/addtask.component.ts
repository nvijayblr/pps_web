import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TaskService } from '../../../../services/home/task.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Constant } from '../../../../utill/constants/constant';
import { SharedtaskService } from '../../../../services/home/sharedtask.service';
import { SharedService } from '../../../../services/home/shared.service';

import * as moment from 'moment';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.css']
})
export class AddtaskComponent implements OnInit {

  public loading = false;
  public taskId;
  public selectedTask = {
    Speed: 0,
    Yield: 0,
    SpeedFactor: 0
  };
  public maintenancetask = false;
  public goblingOrRnD = false;
  public productionTask = false;
  public productionTasks: any;
  public newStartDateDisableStatus = false;
  public selectedGammeOption;
  public editTaskData;
  //For validation
  public prodTaskValidation = false;
  public packTaskValidation = false;
  public validationFields = [];
  public fields: String;
  public validationFieldspack = [];
  public fieldspack: String;
  public endDateValid = false;
  public endDateValidPack = false;
  public isSpeedFactor = false;
  public speedFactorSum = false;
  public isMinGreater = false;
  public onSaveClick = false;
  public sumMax;
  public sumMin;
  public minPackDate;
  public maxPackDate;
  public sumMaxValidation = false;
  public sumMinValidation = false;
  public startDateEqual = false;
  public endDateEqual = false;
  public reasonSelected = false;
  public wrongSpeedFactor = false;
  public emptyItemNumber = false;
  public isGammePresentForCreate = false;
  public isGammeSelected = false;
  public shipDateValid = false;
  public selectedLine;
  public validationData;
  public validationObject = {
    productionStartDate: '',
    productionEndDate: '',
    productionMinQty: '',
    productionMaxQty: '',
    maintenanceStartDate: '',
    maintenanceEndDate: '',
    listOfPackDetails: [],
    reasonforChange: '',
    keepDurationConstantStatus: '',
    speedFactors: [],
    gammeoption: {
      MacDescription: '',
      IsSelected: ''
    },
    speedFactor: '',
    isEditMode: false
  }
  //
  public gammeObject = {
    maintenancetask: this.maintenancetask,
    test: {
      name: 'Test',
      value: '1'
    },
    goblingOrRnD: this.goblingOrRnD,
    selectedTask: this.selectedTask,
    newStartDateDisableStatus: this.newStartDateDisableStatus,
    onSaveClick: this.onSaveClick,
    isEditMode: false
  };
  public productionObject = {
    maintenancetask: this.maintenancetask,
    selectedTask: this.selectedTask,
    goblingOrRnD: this.goblingOrRnD,
    productionTask: this.productionTasks,
    newStartDateDisableStatus: this.newStartDateDisableStatus,
    onSaveClick: this.onSaveClick
  };
  public packObject = {
    goblingOrRnD: this.goblingOrRnD,
    selectedTask: this.selectedTask,
    newStartDateDisableStatus: this.newStartDateDisableStatus,
    maintenancetask: this.maintenancetask,
    onSaveClick: this.onSaveClick,
    productionTasks: this.productionObject

  };
  public taskSummaryObject = {
    maintenancetask: this.maintenancetask,
    goblingOrRnD: this.goblingOrRnD,
    onSaveClick: this.onSaveClick,
    editTask: true
  }
  constructor(
    private router: Router,
    private taskService: TaskService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private constant: Constant,
    private sharedTask: SharedtaskService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.sharedTask.prodAndPackDetailsToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.validationData = data;
          if (data.isGammePresentForCreate != undefined) {
          }
        }
      });
    this.sharedTask.selectedLineToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.selectedLine = data;
        }
      });
  }

  ngOnInit() {
    // this.selectedTask.Speed = 1;
    // this.selectedTask.Yield = 1;
    // this.selectedTask.SpeedFactor = 1;
    /*Edit Mode*/
    //this.productionTaskDetailsAPICall();

    this.productionTaskDetailsCreateTask();
    /** Send selected task details for validation*/
    this.sharedTask.sendProdAndPackDetailsToBeAssigned(this.validationObject);
    if (localStorage.getItem("fromSimulateChange") === 'true') {
      this.constant.fromSimulateChange = true;
    }
  }
  gammeEmpty(msg) {
    if (msg === 'gammeempty') {
      this.isGammePresentForCreate = true;
      this.prodTaskValidation = false;
      this.packTaskValidation = false;
      this.endDateValid = false;
      this.endDateValidPack = false;
      this.isMinGreater = false;
      this.isSpeedFactor = false;
      this.speedFactorSum = false;
      this.onSaveClick = false;
      this.sumMaxValidation = false;
      this.shipDateValid = false;
      this.gammeObject.onSaveClick = this.onSaveClick;
      this.productionObject.onSaveClick = this.onSaveClick;
      this.packObject.onSaveClick = this.onSaveClick;
      this.taskSummaryObject.onSaveClick = this.onSaveClick;
      this.sumMinValidation = false;
      this.startDateEqual = false;
      this.endDateEqual = false;
      this.reasonSelected = false;
      this.wrongSpeedFactor = false;
      this.emptyItemNumber = false;
      this.isGammeSelected = false;
    } else if (msg === 'gammeexist') {
      this.isGammePresentForCreate = false;
      this.prodTaskValidation = false;
      this.packTaskValidation = false;
      this.endDateValid = false;
      this.isMinGreater = false;
      this.endDateValidPack = false;
      this.isSpeedFactor = false;
      this.speedFactorSum = false;
      this.onSaveClick = false;
      this.shipDateValid = false;
      this.sumMaxValidation = false;
      this.gammeObject.onSaveClick = this.onSaveClick;
      this.productionObject.onSaveClick = this.onSaveClick;
      this.packObject.onSaveClick = this.onSaveClick;
      this.taskSummaryObject.onSaveClick = this.onSaveClick;
      this.sumMinValidation = false;
      this.startDateEqual = false;
      this.endDateEqual = false;
      this.reasonSelected = false;
      this.wrongSpeedFactor = false;
      this.emptyItemNumber = false;
      this.isGammeSelected = false;

    }

  }
  productionTaskDetailsCreateTask() {
    this.productionObject.productionTask = {
      "TaskNumber": "",
      "ItemNumber": "",
      "ProductionPONumber": "",
      "MachineLineId": "",
      "MachineDescription": "",
      "ItemDescription": "",
      "GrossWeight": "",
      "QuantItems": 0,
      "QuantItemsMax": 0,
      "BeginDate": moment().format('YYYY-MM-DD HH:mm:ss'),
      "EndDate": moment().format('YYYY-MM-DD HH:mm:ss'),
      "TaskStatusName": "10",
      "IsMaintanenaceGobRnd": "0",
      "NOM": 0,
      "Nchannel": 0,
      "Speed": 0,
      "SpeedFactor": 1,
      "Yield": 0,
      "PullTonsPerDay": 0,
      "SchGroup": "PRIMARY",
      'isEditMode': false
    }
    this.taskId = '0';
    this.productionTasks = this.productionObject.productionTask;
    localStorage.setItem('speedFactor', btoa(this.productionObject.productionTask.SpeedFactor));
    this.taskService.getCreateTaskDetails(response => {
      let taskSummary = response.data.length ? response.data[0] : [];
      this.productionObject.productionTask.TaskNumber = taskSummary.TaskNumber;
      this.productionObject.productionTask.ProductionPONumber = taskSummary.ProductionPO;
      this.productionObject.productionTask.TaskVersion = taskSummary.Version;
      localStorage.setItem('taskNumber', response.data[0].TaskNumber);
      localStorage.setItem('productionPONumber', response.data[0].ProductionPO);
      localStorage.setItem('originalProductionPONumber', response.data[0].ProductionPO);
      localStorage.setItem('MaxVcaPoNumber',response.data[0].ProductionPO);
      this.sharedTask.sendProdSummaryToBeAssigned(this.productionObject.productionTask);
    }, error => {
      console.log(error);
    });
  }

  productionTaskDetailsAPICall() {
    this.loading = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.taskId = params['taskId'];
      // this.itemNumber = params['item'];
    });
    this.taskService.getEditTasksDetails(this.taskId, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        this.productionTasks = response.data;
        this.productionTasks.BeginDate = this.productionTasks.BeginDate;
        this.productionTasks.EndDate = this.productionTasks.EndDate;
        this.productionObject.productionTask = this.productionTasks;
        localStorage.setItem('taskNumber', response.data.TaskNumber);
        localStorage.setItem('productionPONumber', response.data.ProductionPONumber);
        localStorage.setItem('originalProductionPONumber', response.data.ProductionPONumber);

        // if (response.data.IsMaintanenaceGobRnd === "1") {
        //   this.maintenancetask = true;
        //   this.productionObject.maintenancetask = this.maintenancetask;
        //   this.gammeObject.maintenancetask = this.maintenancetask;
        //   this.packObject.maintenancetask = this.maintenancetask;
        //   this.taskSummaryObject.maintenancetask = this.maintenancetask;
        //   this.productionTasks = response.data;
        //   this.productionTasks.BeginDate = this.productionTasks.BeginDate;
        //   this.productionTasks.EndDate = this.productionTasks.EndDate;
        // }
        // else if (response.data.IsMaintanenaceGobRnd === "2" || response.data.IsMaintanenaceGobRnd === "3") {
        //   this.goblingOrRnD = true;
        //   this.productionObject.maintenancetask = this.goblingOrRnD;
        //   this.packObject.maintenancetask = this.goblingOrRnD;
        //   this.gammeObject.maintenancetask = this.goblingOrRnD;
        //   this.taskSummaryObject.maintenancetask = this.goblingOrRnD;
        //   // this.responseData = response.data;
        // } 
        if (String(response.data.TaskStatusName) !== 'In Production') {
          this.productionObject.newStartDateDisableStatus = false;
          this.packObject.newStartDateDisableStatus = false;
          this.gammeObject.newStartDateDisableStatus = false;
          this.productionTasks.keepDurationConstantStatus = true;
        } else {
          this.productionObject.newStartDateDisableStatus = true;
          this.gammeObject.newStartDateDisableStatus = true;
          this.packObject.newStartDateDisableStatus = true;
          this.productionTasks.keepDurationConstantStatus = false;
        }
        /** Send selected task details to gamme option*/
        this.sharedTask.sendProdSummaryToBeAssigned(this.productionObject.productionTask);
      } else {
        this.toastr.clearAllToasts();
        this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
      this.toastr.clearAllToasts();
      this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }
  /* This function call, when we click on application back button */
  backFromSimulate(): void {
    const link: any = [this.router.url.replace(/\/create\/task.*/, '')];
    this.router.navigate(link);
  }
  onCancel(): void {
    const link: any = [this.router.url.replace(/\/create\/task.*/, '')];
    this.router.navigate(link);
  }

  onSave(): void {

    this.sharedTask.sendProdAndPackDetailsToBeAssigned(this.validationObject);
    this.validate();
  }

  validate(): void {

    this.endDateValid = false;
    this.validationFields = [];
    this.validationFieldspack = [];
    this.onSaveClick = true;
    this.productionObject.onSaveClick = this.onSaveClick;
    this.packObject.onSaveClick = this.onSaveClick;
    this.gammeObject.onSaveClick = this.onSaveClick;
    this.taskSummaryObject.onSaveClick = this.onSaveClick;
    this.prodTaskValidation = false;
    this.packTaskValidation = false;
    this.endDateValidPack = false;
    this.isMinGreater = false;
    this.isSpeedFactor = false;
    this.speedFactorSum = false;
    this.sumMaxValidation = false;
    this.sumMinValidation = false;
    this.startDateEqual = false;
    this.endDateEqual = false;
    this.shipDateValid = false;
    this.reasonSelected = false;
    this.wrongSpeedFactor = false;
    this.emptyItemNumber = false;
    this.isGammeSelected = false;
    this.sumMin = 0;
    this.sumMax = 0;
    if (this.productionTasks.SpeedFactor &&
      (this.productionTasks.SpeedFactor < 0 || this.productionTasks.SpeedFactor > 1)) {
      this.wrongSpeedFactor = true;
    }
    if (!this.productionTasks.ItemNumber) {
      this.emptyItemNumber = true;
    }
    if (this.productionTasks.ItemNumber && !this.validationObject.gammeoption.IsSelected) {
      this.isGammeSelected = true;
    }
    // production task details validation
    //if (this.maintenancetask === false) {
      if (this.validationObject.productionEndDate === null) {
        this.prodTaskValidation = true;
        this.validationFields.push('End Date/Time');

      }
      if (this.validationObject.productionMinQty === null || this.validationObject.productionMinQty === undefined ||this.validationObject.productionMinQty === '' ) {
        this.prodTaskValidation = true;
        this.validationFields.push('Required Quantity');

      }
      if (this.validationObject.productionStartDate === null) {
        this.prodTaskValidation = true;
        this.validationFields.push('Start Date/Time');

      }
      if (this.validationObject.productionMaxQty === null || this.validationObject.productionMaxQty === undefined || this.validationObject.productionMaxQty === '' ) {
        this.prodTaskValidation = true;
        this.validationFields.push('Suggested Max');

      }
      if (this.validationObject.productionMaxQty !== null 
        && this.validationObject.productionMaxQty !== undefined 
        && this.validationObject.productionMaxQty !== '' 
        && this.validationObject.productionMinQty !== null 
        && this.validationObject.productionMinQty !== undefined 
        && this.validationObject.productionMinQty !== ''  ) { 
          if ((Number(this.validationObject.productionMinQty) > Number(this.validationObject.productionMaxQty))) { 
           this.isMinGreater = true;
          }
        }
      this.fields = this.validationFields.join();
       
      if (!this.validationObject.keepDurationConstantStatus) {
        if (this.validationObject.productionStartDate !== null && this.validationObject.productionEndDate !== null) {
          if (new Date(this.validationObject.productionStartDate).getTime() >= new Date(this.validationObject.productionEndDate).getTime()) {
            this.endDateValid = true;
          }
        }
      }
      // pack task details validation
      // if (this.validationObject.reasonforChange === '0') {
      //   this.reasonSelected = true;

      // }
      // maximum and minimum date validation
      //if (this.validationObject.listOfPackDetails[i].Checked === true) {
      for (let j = 0; j < this.validationObject.listOfPackDetails.length; j++) {
        if (this.validationObject.listOfPackDetails[j].Checked === true) {
         
          if (this.validationObject.listOfPackDetails[j].BeginDate !== null  &&
            this.validationObject.listOfPackDetails[j].BeginDate !== undefined) {
            if (((this.validationObject.listOfPackDetails[j].BeginDate.toString()).indexOf('T') !== -1)) {
              this.minPackDate = this.sharedService.dateTimeFormatForTimeZone(this.validationObject.listOfPackDetails[j].BeginDate);

            } else {
              this.minPackDate = this.validationObject.listOfPackDetails[j].BeginDate;
            }
          }
        
          if (this.validationObject.listOfPackDetails[j].EndDate !== null  &&
            this.validationObject.listOfPackDetails[j].EndDate !== undefined) {
            if ((this.validationObject.listOfPackDetails[j].EndDate.toString().indexOf('T') !== -1)) {
              this.maxPackDate = this.sharedService.dateTimeFormatForTimeZone(this.validationObject.listOfPackDetails[j].EndDate);
            }
            else {
              this.maxPackDate = this.validationObject.listOfPackDetails[j].EndDate;
            }
          }
          break;
        }
      }
      //}
      for (let i = 0; i < this.validationObject.listOfPackDetails.length; i++) {
        if (this.validationObject.listOfPackDetails[i].Checked === true) {
          if (this.validationObject.listOfPackDetails[i].EndDate === null  ||
            this.validationObject.listOfPackDetails[i].EndDate === undefined) {
            this.packTaskValidation = true;
            if (this.validationFieldspack.indexOf('End Date/Time') !== -1) {
              this.validationFieldspack = this.validationFieldspack;
            } else {
              this.validationFieldspack.push('End Date/Time');
            }


          }
          if (this.validationObject.listOfPackDetails[i].QuantItems === null) {
            this.packTaskValidation = true;
            if (this.validationFieldspack.indexOf('Required Quantity') !== -1) {
              this.validationFieldspack = this.validationFieldspack;
            } else {
              this.validationFieldspack.push('Required Quantity');
            }

          }
       
          if (this.validationObject.listOfPackDetails[i].BeginDate === null  ||
            this.validationObject.listOfPackDetails[i].BeginDate === undefined) {
            this.packTaskValidation = true;

            if (this.validationFieldspack.indexOf('Start Date/Time') !== -1) {
              this.validationFieldspack = this.validationFieldspack;
            } else {
              this.validationFieldspack.push('Start Date/Time');
            }

          }
          //var myProp = 'QuantItemsMax';
          if (this.validationObject.listOfPackDetails[i].QuantItemsMax === null ||
            this.validationObject.listOfPackDetails[i].QuantItemsMax === undefined) {
            this.packTaskValidation = true;
            if (this.validationFieldspack.indexOf('Suggested Max') !== -1) {
              this.validationFieldspack = this.validationFieldspack;
            } else {
              this.validationFieldspack.push('Suggested Max');
            }
          }
          this.fieldspack = this.validationFieldspack.join();
          //      // maximum and minimum date validation
          // if (this.validationObject.listOfPackDetails[i].Checked === true) {
          //   for (let j = 0; j < this.validationObject.listOfPackDetails.length; j++) {
          //     if (this.validationObject.listOfPackDetails[j].Checked === true) {
          //       this.minPackDate = this.validationObject.listOfPackDetails[j].BeginDate;//this.modifyTaskDurationObject.listOfPackDetails[0].BeginDate;
          //       this.maxPackDate = this.validationObject.listOfPackDetails[j].EndDate;
          //       break;
          //     }
          //   }
          // }

          if (this.validationObject.listOfPackDetails[i].Checked === true) {
            var startDate
            if (this.validationObject.listOfPackDetails[i].BeginDate !== null) {
              if (((this.validationObject.listOfPackDetails[i].BeginDate.toString()).indexOf('T') !== -1)) {
                startDate = this.sharedService.dateTimeFormatForTimeZone(this.validationObject.listOfPackDetails[i].BeginDate);

              } else {
                startDate = this.validationObject.listOfPackDetails[i].BeginDate;
              }
              if (startDate.getTime() < this.minPackDate.getTime()) {
                this.minPackDate = startDate;
              }
            }

          }
          if (this.validationObject.listOfPackDetails[i].Checked === true) {
            if (this.validationObject.listOfPackDetails[i].EndDate !== null && this.validationObject.listOfPackDetails[i].EndDate !== undefined ) {
              var endDate
              //if (this.validationObject.listOfPackDetails[i].BeginDate !== null) {
              if ((this.validationObject.listOfPackDetails[i].EndDate.toString().indexOf('T') !== -1)) {
                endDate = this.sharedService.dateTimeFormatForTimeZone(this.validationObject.listOfPackDetails[i].EndDate);

              } else {
                endDate = this.validationObject.listOfPackDetails[i].EndDate;
              }
              if (endDate.getTime() > this.maxPackDate.getTime()) {
                this.maxPackDate = endDate;
              }
            }

          }
          if (this.validationObject.listOfPackDetails[i].BeginDate !== null && this.validationObject.listOfPackDetails[i].EndDate !== null) {
            if (new Date(this.validationObject.listOfPackDetails[i].BeginDate).getTime() > new Date(this.validationObject.listOfPackDetails[i].EndDate).getTime()) {
              this.endDateValidPack = true;
            }
          }
          // if (this.validationObject.listOfPackDetails[i].ShipDate !== null && this.validationObject.listOfPackDetails[i].EndDate !== null) {
          //   const packEndDate: any = new Date(this.validationObject.listOfPackDetails[i].EndDate);
          //   const shipDate: any = new Date(this.validationObject.listOfPackDetails[i].ShipDate);
          //   let a = shipDate.setSeconds(packEndDate.getSeconds());
          //   a = shipDate.setMilliseconds(packEndDate.getMilliseconds());
          //   if (a < packEndDate.getTime()) {
          //     this.shipDateValid = true;
          //   }
          // }
          if (this.validationObject.listOfPackDetails[i].Checked === true) {
            this.sumMin = Number(this.sumMin) + Number(this.validationObject.listOfPackDetails[i].QuantItems);
            this.sumMax = Number(this.sumMax) + Number(this.validationObject.listOfPackDetails[i].QuantItemsMax);
          }
        }
      }
      // Sum validation
      let minDeviatedSumForMin = (this.sumMin - 3);
      let maxDeviatedSumForMin = (this.sumMin + 3);
      let minDeviatedSumForMax = (this.sumMax - 3);
      let maxDeviatedSumForMax = (this.sumMax + 3);
      this.sumMin = this.sumMin.toString();
      this.sumMax = this.sumMax.toString();
      if (this.validationObject.productionMinQty !== '') {
        // if (this.sumMin !== this.validationObject.productionMinQty) {
        //   this.sumMinValidation = true;
        // }
        let minQty = Number(this.validationObject.productionMinQty);
        if (minQty < minDeviatedSumForMin ||
          minQty > maxDeviatedSumForMin) {
          this.sumMinValidation = true;
        }
      }
      if (this.validationObject.productionMaxQty !== '') {
        // if (this.sumMax > this.validationObject.productionMaxQty) {
        //   this.sumMaxValidation = true;
        // }
        let maxQty = Number(this.validationObject.productionMaxQty);
        if (maxQty < minDeviatedSumForMax ||
          maxQty > maxDeviatedSumForMax) {
          this.sumMaxValidation = true;
        }
      }
      // Date equal check for production and pack task
      if (this.validationObject.productionStartDate !== null) {
        if (this.minPackDate === undefined) {
          this.startDateEqual = false;
        } else {
          let minPackDateCopy = this.minPackDate.setMilliseconds(0);
          minPackDateCopy = new Date(minPackDateCopy).setSeconds(0);
          let prodStartDateCopy = new Date(this.validationObject.productionStartDate).setMilliseconds(0);
          prodStartDateCopy = new Date(prodStartDateCopy).setSeconds(0);
          if (minPackDateCopy !== prodStartDateCopy) {
            let diff = (prodStartDateCopy - minPackDateCopy) / 1000;
            diff /= 60;
            let dateDiff = Math.abs(Math.round(diff));
            if (dateDiff > 1) {
              this.startDateEqual = false;
            }
          }
        }
      }
      if (this.validationObject.productionEndDate !== null) {
        if (this.maxPackDate === undefined) {
          this.endDateEqual = false;
        } else {
          let maxPackDateCopy = this.maxPackDate.setMilliseconds(0);
          maxPackDateCopy = new Date(maxPackDateCopy).setSeconds(0);
          let prodEndDateCopy = new Date(this.validationObject.productionEndDate).setMilliseconds(0);
          prodEndDateCopy = new Date(prodEndDateCopy).setSeconds(0);
          if (maxPackDateCopy !== prodEndDateCopy) {
            let diff = (prodEndDateCopy - maxPackDateCopy) / 1000;
            diff /= 60;
            let dateDiff = Math.abs(Math.round(diff));
            if (dateDiff > 1) {
              this.endDateEqual = false;
            }
          }
        }
      }
      if (String(this.productionTasks.TaskStatusName) !== 'In Production') {
        if (this.validationObject.gammeoption.MacDescription.toString().indexOf('//') !== -1) {
          var sumSpeedFactor = 0;
          for (let i = 0; i < this.validationObject.speedFactors.length; i++) {
            if (this.validationObject.speedFactors[i].speedFactor === '' ||
              this.validationObject.speedFactors[i].speedFactor === '0') {
              this.isSpeedFactor = false;
              // this.toastr.error('Please provide Speed Factor.', this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
              return;
            }

            if (this.validationObject.speedFactors[i].speedFactor !== '' ||
              this.validationObject.speedFactors[i].speedFactor !== '0') {
              sumSpeedFactor = sumSpeedFactor + Number(this.validationObject.speedFactors[i].speedFactor);
            }
          }
          if (sumSpeedFactor !== 1) {
            this.speedFactorSum = false;
            // this.toastr.error('Sum of Speed Factor values should be equal to 1.', this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            return;
          }

        }
      }
      if (this.validationObject.listOfPackDetails.length === 0) {
        this.packTaskValidation = false;
        this.endDateValidPack = false;
        this.sumMaxValidation = false;
        this.sumMinValidation = false;
        this.shipDateValid = false;
        this.startDateEqual = false;
        this.endDateEqual = false;
        if (!this.prodTaskValidation && !this.endDateValid && !this.isGammeSelected ) {

          this.EditTasksSave(this.validationObject);
        }

      } else {
        if (!this.endDateValid && !this.prodTaskValidation && !this.packTaskValidation && !this.endDateValidPack
          && !this.sumMaxValidation && !this.sumMinValidation && !this.startDateEqual && !this.endDateEqual && !this.isMinGreater && !this.shipDateValid) {
          this.EditTasksSave(this.validationObject);
        }
      }
    //} // Validation part for maintenance task 
    //else {
      // if (this.validationObject.reasonforChange === "0") {
      //   this.reasonSelected = true;
      // }
    //   if (this.productionTasks.IsMaintanenaceGobRnd === "1") {
    //     if (this.validationObject.maintenanceStartDate !== null && this.validationObject.maintenanceEndDate !== null) {
    //       if (new Date(this.validationObject.maintenanceStartDate).getTime() >= new Date(this.validationObject.maintenanceEndDate).getTime()) {
    //         this.endDateValid = true;
    //       }
    //     }
    //   }
    //   if (!this.endDateValid) {
    //     this.validationObject.productionStartDate = this.validationObject.maintenanceStartDate;
    //     this.validationObject.productionEndDate = this.validationObject.maintenanceEndDate;
    //     this.EditTasksSave(this.validationObject);
    //   }
    // }
  }

  /* This function calls, after checking all validations for save.*/
  EditTasksSave(editTaskObject): void {
    //this.loading = true;
    // var selectedPackTask = [];
    // selectedPackTask = editTaskObject.listOfPackDetails;
    // for (let i = 0; i < editTaskObject.listOfPackDetails.length; i++) {
    //   if (editTaskObject.listOfPackDetails[i].Checked === true) {
    //      if (((editTaskObject.listOfPackDetails[i].BeginDate.toString()).indexOf('T') === -1)) {
    //     editTaskObject.listOfPackDetails[i].BeginDate = new Date(editTaskObject.listOfPackDetails[i].BeginDate.getTime() - (editTaskObject.listOfPackDetails[i].BeginDate.getTimezoneOffset() * 60000)).toJSON();
    //     editTaskObject.listOfPackDetails[i].EndDate = new Date(editTaskObject.listOfPackDetails[i].EndDate.getTime() - (editTaskObject.listOfPackDetails[i].EndDate.getTimezoneOffset() * 60000)).toJSON();
    //      } else {
    //       editTaskObject.listOfPackDetails[i].BeginDate = editTaskObject.listOfPackDetails[i].BeginDate;
    //       editTaskObject.listOfPackDetails[i].EndDate = editTaskObject.listOfPackDetails[i].EndDate;
    //      }
    //   }
    // }
    var macDescription;
    var poNumber;
    if (editTaskObject.gammeoption.MacDescription.toString().indexOf('//') === -1) {
      if (this.selectedLine !== undefined && this.selectedLine !== "") {
        macDescription = this.selectedLine;
      } else {
        macDescription = editTaskObject.gammeoption.MacDescription;
      }
    }
    var localpasktaskItem = [];
    var specialCaseGamme = [];
    var prodTaskGamme = [];
    if (editTaskObject.gammeoption.length !== 0) {
      if (editTaskObject.gammeoption.MacDescription.toString().indexOf('//') !== -1) {
        for (let i = 0; i < editTaskObject.speedFactors.length; i++) {
          prodTaskGamme.push({
            'TaskNumber': this.productionTasks.TaskNumber,
            'ItemNumber': editTaskObject.gammeoption.ItemNumber,
            'Nom': editTaskObject.gammeoption.Nom,
            'NChannel': editTaskObject.gammeoption.NChannel,
            'MacDescription': editTaskObject.speedFactors[i].line,
            'Speed': editTaskObject.gammeoption.Speed,
            'Yield': editTaskObject.gammeoption.Yield,
            'Manning': editTaskObject.gammeoption.Manning,
            'PullTonsPerDay': editTaskObject.gammeoption.PullTonsPerDay,
            'SpeedFactor': this.productionTasks.SpeedFactor,
            'ProductionPoNumber':editTaskObject.speedFactors[i].POnumber
          })
        }
      }
     
      else if (editTaskObject.gammeoption.MacDescription.toString().indexOf('&') !== -1) {
        for (let i = 0; i < editTaskObject.ampData.length; i++) {
          if(i>0) { 
            poNumber = editTaskObject.ampData[i].POnumber
          }
          else {
            poNumber =  this.productionTasks.ProductionPONumber
          }
          prodTaskGamme.push({
            'TaskNumber': this.productionTasks.TaskNumber,
            'ItemNumber': editTaskObject.gammeoption.ItemNumber,
            'Nom': editTaskObject.gammeoption.Nom,
            'NChannel': editTaskObject.gammeoption.NChannel,
            'MacDescription': editTaskObject.ampData[i].line,
            'Speed': editTaskObject.gammeoption.Speed,
            'Yield': editTaskObject.gammeoption.Yield,
            'Manning': editTaskObject.gammeoption.Manning,
            'PullTonsPerDay': editTaskObject.gammeoption.PullTonsPerDay,
            'SpeedFactor': this.productionTasks.SpeedFactor,
            'ProductionPoNumber':poNumber
          })
        }
      }
	  
      else if (!this.productionTask) {
        prodTaskGamme.push({
          'TaskNumber': this.productionTasks.TaskNumber,
          'ItemNumber': editTaskObject.gammeoption.ItemNumber,
          'Nom': editTaskObject.gammeoption.Nom,
          'NChannel': editTaskObject.gammeoption.NChannel,
          'MacDescription': macDescription,
          'Speed': editTaskObject.gammeoption.Speed,
          'Yield': editTaskObject.gammeoption.Yield,
          'Manning': editTaskObject.gammeoption.Manning,
          'PullTonsPerDay': editTaskObject.gammeoption.PullTonsPerDay,
          'SpeedFactor': this.productionTasks.SpeedFactor
        })
      }
    }
    /** The bulk min and max quantity values are coming as zero on the pack task details then it 
     * should be saved as 1. And production task quantity should be saved as +1. */
    for (let j = 0; j < editTaskObject.listOfPackDetails.length; j++) {
      if (editTaskObject.listOfPackDetails[j].IsBulkTask) {
        if (Number(editTaskObject.listOfPackDetails[j].QuantItems) === 0) {
          editTaskObject.listOfPackDetails[j].QuantItems = 1;
          editTaskObject.productionMinQty = Number(editTaskObject.productionMinQty) + 1;
        }
        if (Number(editTaskObject.listOfPackDetails[j].QuantItemsMax) === 0) {
          editTaskObject.listOfPackDetails[j].QuantItemsMax = 1;
          editTaskObject.productionMaxQty = Number(editTaskObject.productionMaxQty) + 1;
        }
      }
    }
    for (let i = 0; i < editTaskObject.listOfPackDetails.length; i++) {
      //if (editTaskObject.listOfPackDetails[i].Checked === true) {
      localpasktaskItem.push({
        'Checked': editTaskObject.listOfPackDetails[i].Checked,
        'IsDeleted': editTaskObject.listOfPackDetails[i].IsDeleted,
        'TaskNumber': editTaskObject.listOfPackDetails[i].TaskNumber ? editTaskObject.listOfPackDetails[i].TaskNumber : null,
        'ItemNumber': editTaskObject.listOfPackDetails[i].ItemNumber ? editTaskObject.listOfPackDetails[i].ItemNumber : null,
        'VCAPONumber': editTaskObject.listOfPackDetails[i].PONumber ? editTaskObject.listOfPackDetails[i].PONumber : null,
        'NOM': editTaskObject.listOfPackDetails[i].NOM ? editTaskObject.listOfPackDetails[i].NOM : null,
        'NChannel': editTaskObject.listOfPackDetails[i].NChannel ? editTaskObject.listOfPackDetails[i].NChannel : null,
        'MachineLineId': editTaskObject.listOfPackDetails[i].MachineLineId ? editTaskObject.listOfPackDetails[i].MachineLineId : null,
        'QuantItems': editTaskObject.listOfPackDetails[i].QuantItems ? editTaskObject.listOfPackDetails[i].QuantItems : null,
        'QuantItemsMax': editTaskObject.listOfPackDetails[i].QuantItemsMax ? editTaskObject.listOfPackDetails[i].QuantItemsMax : null,
        'BeginDate': editTaskObject.listOfPackDetails[i].BeginDate ? editTaskObject.listOfPackDetails[i].BeginDate : null,
        'EndDate': editTaskObject.listOfPackDetails[i].EndDate ? editTaskObject.listOfPackDetails[i].EndDate : null,
        'ColdEndManning': editTaskObject.listOfPackDetails[i].ColdEndManning ? editTaskObject.listOfPackDetails[i].ColdEndManning : null,
        'Id':editTaskObject.listOfPackDetails[i].Id,
        'ShipDate':editTaskObject.listOfPackDetails[i].ShipDate,
        //'Machine_LineId':editTaskObject.gammeoption.Machine_LineId,
      })
      //}
    }
    if (editTaskObject.specialGamme.length !== 0) {
      for (let i = 0; i < editTaskObject.specialGamme.length; i++) {
        specialCaseGamme.push({
          'TaskNumber': this.productionTasks.TaskNumber,
          'ItemNumber': editTaskObject.specialGamme[i].ItemNumber,
          'MacDescription': editTaskObject.specialGamme[i].MacDescription,
          'Machine_LineId': editTaskObject.specialGamme[i].MachineLineId,
          'Nom': editTaskObject.specialGamme[i].Nom,
          'NChannel': editTaskObject.specialGamme[i].NChannel,
          'Speed': editTaskObject.specialGamme[i].Speed,
          'Yield': editTaskObject.specialGamme[i].Yield,
          'PullTonsPerDay': editTaskObject.specialGamme[i].PullTonsPerDay,
          'Manning': editTaskObject.gammeoption.Manning,
          'SpeedFactor': this.productionTasks.SpeedFactor,
          'ProductionPoNumber':editTaskObject.specialGamme[i].POnumber
        })
      }
    }

    //if (editTaskObject.gammeoption !== undefined) {
    //   if (((editTaskObject.productionStartDate.toString()).indexOf('T') === -1)) {
    // editTaskObject.productionStartDate = new Date(editTaskObject.productionStartDate.getTime() - (editTaskObject.productionStartDate.getTimezoneOffset() * 60000)).toJSON();
    // editTaskObject.productionEndDate = new Date(editTaskObject.productionEndDate.getTime() - (editTaskObject.productionEndDate.getTimezoneOffset() * 60000)).toJSON();
    //   } else  {
    //     editTaskObject.productionStartDate =  editTaskObject.productionStartDate; 
    //     editTaskObject.productionEndDate = editTaskObject.productionStartDate;
    //   }
    this.editTaskData = {
      'TaskSummmary':
        {
          'TaskVersion': this.productionTasks.TaskVersion,
          'TaskNumber': this.productionTasks.TaskNumber,
          'ItemNumber': this.productionTasks.ItemNumber,
          'GrossWeight': this.productionTasks.GrossWeight,
          'MachineLineId': editTaskObject.gammeoption.Machine_LineId,
          'MachineDescription': macDescription,
          'QuantItems': editTaskObject.productionMinQty,
          'QuantItemsMax': editTaskObject.productionMaxQty,
          'BeginDate': new Date(editTaskObject.productionStartDate),
          'EndDate': new Date(editTaskObject.productionEndDate),
          'TaskStatusName': this.productionTasks.TaskStatusName,
          'SpeedFactor': this.productionTasks.SpeedFactor,
          'ProductionPONumber': this.productionTasks.ProductionPONumber
        },
      'ProdTaskGamme': prodTaskGamme,
      'SpecialCaseGamme': specialCaseGamme,
      'PackTaskGamme': localpasktaskItem,


      "Comment": {
        "Comment": editTaskObject.comments ? editTaskObject.comments : '',
        //"ModifiedByID": atob(localStorage.getItem("userId")),
        //"ModifiedDate": new Date()
      },
      "TaskReasonId": '0'
    }
    //}
    this.loading = true;
    this.taskService.saveEditTaskDetails(this.editTaskData, response => {
      this.loading = false;
      if (response.responseCode === 200) {

        this.toastr.success("Task Saved Successfully", 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        this.validationFields = [];
        this.selectedGammeOption = [];
        this.validationFieldspack = [];
        this.prodTaskValidation = false;
        this.packTaskValidation = false;
        this.endDateValid = false;
        this.isMinGreater = false;
        this.endDateValidPack = false;
        this.isSpeedFactor = false;
        this.speedFactorSum = false;
        this.onSaveClick = false;
        this.sumMaxValidation = false;
        this.sumMinValidation = false;
        this.startDateEqual = false;
        this.shipDateValid = false;
        this.endDateEqual = false;
        this.reasonSelected = false;
        this.sumMin = 0;
        this.sumMax = 0;
        localStorage.removeItem('taskNumber');
        localStorage.removeItem('productionPONumber');
        localStorage.removeItem('originalProductionPONumber');
        localStorage.removeItem('speedFactor');
        setTimeout(() => {
          const link: any = [this.router.url.replace(/\/create\/task.*/, '')];
          this.router.navigate(link);
        }, this.constant.minToastLife);
      } else {
        console.log(response);
        //this.getEditTaskDetailsFromAPI();
        this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }

    }, error => {
      this.loading = false;
      this.toastr.clearAllToasts();
      this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }


}
