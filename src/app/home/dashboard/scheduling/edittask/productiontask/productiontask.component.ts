import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedtaskService } from '../../../../../services/home/sharedtask.service';
import { ProductionService } from '../../../../../services/home/production.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subject } from "rxjs/Subject";
import { Constant } from '../../../../../utill/constants/constant';
import * as moment from 'moment';
import { SharedService } from '../../../../../services/home/shared.service';

@Component({
  selector: 'app-productiontask',
  templateUrl: './productiontask.component.html',
  styleUrls: ['./productiontask.component.css']
})

export class ProductiontaskComponent implements OnInit {

  @Input() productionData;
  @Output() productionDataChangeEvent = new EventEmitter();
  @Output() productionStartDateChangeEvent = new EventEmitter();
  @Output() productionMaxQtyChange = new EventEmitter<any>();

  public modifyTaskDurationObject = {
    keepDurationConstantStatus: true,
    newStartDate: null,
    newEndDate: null,
    newQuantity: '',
    maxQuantity: ''
  };
  public maintenanceTaskObject = {
    startDate: null,
    endDate: null
  }
  public loading = false;
  public newStartDateDisableStatus = false;
  public startNewDateVal;
  public newQuantityValueCheckStatus;
  private unsubscribe: Subject<void> = new Subject<void>();
  public gammeSelectedStatus = false;
  public isGammeSelected = false;
  public maxQuantityCopy;
  public checkMaxQuantity;
  public taskHourMinVal;
  public date2MinDate: any;
  public isEditMode = false;
  public newStartDateCopy;
  public newEndDateCopy;
  public formingLine = null;
  public startDefaultTime:any;
  public endDefaultTime:any;
  public scheduledTaskDateRangeInfo = false;
  public noScheduledTaskDateRangeInfo = false;
  public taskDataObject:any;
  public conflitedTasksRetrivedData:any;
  public taskSummaryData:any;
  public conflictedTaskLength:any;
  public conflictedTaskFirstNumber:any;
  public validationData;
  public selectedLine;
  public specialGamme = [];

  constructor(
    private sharedTask: SharedtaskService,
    private sharedProServices: ProductionService,
    private toastr: ToastsManager,
    private sharedService: SharedService,
    private constant: Constant
  ) {
    this.sharedTask.prodSummaryToBeAssigned$.subscribe(data => {
      if (data != null && data != undefined) {
        this.taskSummaryData = data;
      }
    });
    this.sharedTask.specialGammeToBeAssigned$.subscribe(data => {
      if (data != null && data != undefined) {
        this.specialGamme = data;
      }
    });
    this.sharedTask.initialGammeToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.isEditMode != undefined) {
            this.isEditMode = data.isEditMode;
          }
          this.productionData.selectedTask = data;
        }
      });
    this.sharedTask.selectedLineToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.selectedLine = data;
        }
      });
    this.sharedTask.gammeToBeAssigned$.takeUntil(this.unsubscribe).subscribe(
      data => {
        if (data != null && data != undefined) {
          this.isEditMode = data.isEditMode;
          this.productionData.selectedTask = data;
          if (this.newQuantityValueCheckStatus === undefined) {
            this.newQuantityValueCheckStatus = 0;
            this.gammeSelectedStatus = false;
          }
          if (this.checkMaxQuantity === undefined) {
            this.checkMaxQuantity = 0;
            this.gammeSelectedStatus = false;
          }
          if (this.modifyTaskDurationObject.newStartDate !== null && this.modifyTaskDurationObject.newEndDate !== null) {
            if (Number(data.Nom) === Number(atob(localStorage.getItem('savedNom'))) && Number(data.NChannel) === Number(atob(localStorage.getItem('savedNChannel')))) {
              this.setQuantityAndEnddate();
            } else {
              this.getNewQuantity(this.modifyTaskDurationObject.newStartDate, this.modifyTaskDurationObject.newEndDate);
              let productionObj = JSON.parse(JSON.stringify(this.modifyTaskDurationObject));
              this.sharedTask.sendInitialProdDataToBeAssigned(productionObj);
            }
          }
        }
      });
    this.sharedTask.prodOldQuantityToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.newQuantityValueCheckStatus = data.newQuantityValueCheckStatus;
        }
      });
    this.sharedTask.adjustProdToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.modifyTaskDurationObject.keepDurationConstantStatus = !(data.adjustProductionTaskQuantity);
        }
      });
    this.sharedTask.prodOldMaxQuantityToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.checkMaxQuantity = data.calculatedQty;
        }
      });
    this.sharedTask.prodAndPackDetailsToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          data.productionStartDate = this.modifyTaskDurationObject.newStartDate;
          data.productionEndDate = this.modifyTaskDurationObject.newEndDate;
          data.productionMinQty = this.modifyTaskDurationObject.newQuantity;
          data.productionMaxQty = this.modifyTaskDurationObject.maxQuantity;
          data.keepDurationConstantStatus = this.modifyTaskDurationObject.keepDurationConstantStatus;
          //data.maintenanceStartDate = this.maintenanceTaskObject.startDate;
          //data.maintenanceEndDate = this.maintenanceTaskObject.endDate;
        }
      });
  }

  ngOnInit() {
    this.date2MinDate = new Date();
    this.date2MinDate.setDate(this.date2MinDate.getDate() - 1); 
    if (localStorage.getItem("editOrCreate") !== undefined) {
      if (localStorage.getItem("editOrCreate") === 'true') {
        this.isEditMode = true;
      } else if (localStorage.getItem("editOrCreate") === 'false') {
        this.isEditMode = false;
      }
    }
    if (!this.isEditMode) {
      this.modifyTaskDurationObject.keepDurationConstantStatus = false;
      this.isGammeSelected = true;
      let time: any = new Date().getHours();
      if ((time>=0 && time <8)) {
        this.startDefaultTime = moment().format('YYYY-MM-DD 08:00:0');
        this.endDefaultTime = moment().format('YYYY-MM-DD 08:00:0');
      }
      /**1787 To show start date/time and end date/time in create task on empty space click */
      if (localStorage.getItem("taskDate") !== null) {
        if (this.modifyTaskDurationObject.newStartDate === null) {
          let startDate;
          if ((time>0 && time <8)) {
          startDate = new Date(atob(localStorage.getItem('taskDate'))).setHours(8, 0, 0);
          } else {
            startDate = new Date(atob(localStorage.getItem('taskDate'))).setHours(8, 0, 0);
            if(new Date(atob(localStorage.getItem('taskDate'))).getDate() === new Date().getDate()) {
              startDate = new Date();
            }
          }
          this.modifyTaskDurationObject.newStartDate = new Date(startDate);
          this.newStartDateCopy = this.modifyTaskDurationObject.newStartDate;
          this.newDurationStartDateChange();
        }
      }
      if (localStorage.getItem("taskLine") !== null) {
        this.formingLine = atob(localStorage.getItem('taskLine'));
      }
    } else {
      
    }

  }
  itemNumberCleared(msg) {
    this.noScheduledTaskDateRangeInfo = false;
    this.scheduledTaskDateRangeInfo = false;
    this.isGammeSelected = true;
  }
  /** Calculate min and max quantity*/
  gammeChange(data: any) {
    //Getting data from Gamme component
    this.gammeSelectedStatus = true;
    this.isGammeSelected = false;
    this.noScheduledTaskDateRangeInfo = false;
    this.scheduledTaskDateRangeInfo = false;
    let productionObj = JSON.parse(JSON.stringify(this.modifyTaskDurationObject));
    // productionObj.newQuantity = productionObj.newQuantity.replace(/,/g, ''); //comma
    this.sharedTask.sendInitialProdDataToBeAssigned(productionObj);
  }

  /** This function is used to dump pack quantities sum to production */
  makePackSumEffectToProd(data:any) {
    // this.modifyTaskDurationObject.newQuantity = data.requiredQuantitySum.toLocaleString(); //comma
    this.modifyTaskDurationObject.newQuantity = data.requiredQuantitySum;
    this.modifyTaskDurationObject.maxQuantity = data.suggestedMaxSum;
    this.newQuantityValueCheckStatus = data.requiredQuantitySum;
    this.checkMaxQuantity = data.suggestedMaxSum;
    // Duration=(RQ/yield)/speed 
    let DurationinMins: any;
    if (this.productionData.selectedTask !== undefined) {
      if (this.productionData.selectedTask.Speed !== 0 && this.productionData.selectedTask.Yield !== 0 && this.productionData.selectedTask.SpeedFactor !== 0) {
        DurationinMins = (Number(this.modifyTaskDurationObject.newQuantity) / (this.productionData.selectedTask.Yield / 100)) / (this.productionData.selectedTask.Speed * this.productionData.selectedTask.SpeedFactor);
        // DurationinMins = (Number(data.requiredQuantitySum) / (this.productionData.selectedTask.Yield / 100)) / (this.productionData.selectedTask.Speed * this.productionData.selectedTask.SpeedFactor); //comma
      } else {
        DurationinMins = 0;
      }
    }
    if (DurationinMins === undefined) {
      DurationinMins = 0
    }
    this.startNewDateVal = new Date(this.modifyTaskDurationObject.newStartDate);
    const mcreatedDate: any = this.startNewDateVal;
    let durationInMs = DurationinMins * 60000;
    mcreatedDate.setMilliseconds(this.startNewDateVal.getMilliseconds() + durationInMs + 462);
    this.modifyTaskDurationObject.newEndDate = new Date(mcreatedDate);
    this.newEndDateCopy = new Date(mcreatedDate);
    this.endDefaultTime = new Date(mcreatedDate);

  }

  /** Initial Calculation of End date & Max quantity From Min quantity and gamme options*/
  calculateDate(data: any) {
    //Getting data from Gamme component
    /**Initial case: Do not assign to end date, We need to calculate it. */
    this.initializeValue();
    if (this.productionData.maintenancetask) {
      this.maintenanceTaskObject.startDate = new Date(this.productionData.productionTask.BeginDate);
      this.maintenanceTaskObject.endDate = new Date(this.productionData.productionTask.EndDate);
    } else {
      // debugger;
      this.modifyTaskDurationObject.newStartDate = new Date(this.productionData.productionTask.BeginDate);
      this.newStartDateCopy = new Date(this.productionData.productionTask.BeginDate);
      this.modifyTaskDurationObject.newQuantity = this.productionData.productionTask.QuantItems;
      this.startDefaultTime = new Date(this.productionData.productionTask.BeginDate);
      // this.modifyTaskDurationObject.newQuantity = this.productionData.productionTask.QuantItems.toLocaleString(); //comma
      this.newQuantityValueCheckStatus = this.productionData.productionTask.QuantItems;
      this.modifyTaskDurationObject.maxQuantity = this.productionData.productionTask.QuantItemsMax;
      this.checkMaxQuantity = String(this.productionData.productionTask.QuantItemsMax);
      // this.setCalculatedMaxQuantity(this.modifyTaskDurationObject.newQuantity);
      this.modifyTaskDurationObject.keepDurationConstantStatus = this.productionData.productionTask.keepDurationConstantStatus;
      this.modifyTaskDurationObject.newEndDate = new Date(this.productionData.productionTask.EndDate);
      this.newEndDateCopy = new Date(this.productionData.productionTask.EndDate);
      this.endDefaultTime = new Date(this.productionData.productionTask.EndDate);
      // this.getNewEndDate(this.modifyTaskDurationObject.newQuantity, undefined, this.modifyTaskDurationObject.newStartDate);
      this.setCalculatedMaxQuantity(this.modifyTaskDurationObject.newQuantity);
      // this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.newQuantity, undefined, this.modifyTaskDurationObject.newStartDate);
    }
    /**NEED WHEN TASK UNCHECK CONDITION IN PACK */
    var prodObj = {
      // newQuantity: this.modifyTaskDurationObject.newQuantity.replace(/,/g, ''), //comma
      newQuantity: this.modifyTaskDurationObject.newQuantity,
      newQuantityValueCheckStatus: this.newQuantityValueCheckStatus,
      newStartDate: this.modifyTaskDurationObject.newStartDate,
      newEndDate: this.modifyTaskDurationObject.newEndDate,
      maxQuantity: this.modifyTaskDurationObject.maxQuantity
    }
    this.sharedTask.sendProdDataToBeAssigned(prodObj);
  }

  /* This function initialize the values */
  initializeValue(): void {
    const startDate = this.productionData.productionTask.BeginDate.replace('T', ' ');
    const endDate = this.productionData.productionTask.EndDate.replace('T', ' ');
    const sDate = startDate.replace('-', '/');
    const eDate = endDate.replace('-', '/');
    const startDateFormat: any = new Date(sDate);
    const endDateFormat: any = new Date(eDate);

    const hourDiff = endDateFormat - startDateFormat;
    const diff: any = Math.abs((endDateFormat) - (startDateFormat));
    const minutes: any = Math.floor((diff / 1000) / 60);
    this.taskHourMinVal = minutes;
  }

  /* This function calls, when we check and uncheck the keepconstant chcekbox. */
  keepDurationConstantChange(): void {
    let dataObj = {
      keepQuantityConstant: this.modifyTaskDurationObject.keepDurationConstantStatus
    }
    this.sharedTask.sendKeepQuantityToBeAssigned(dataObj);
  }

  /* This function calls, when we change the new duration start date calendar in Maintenance. */
  newDurationStartDateChangeMaintenance(): void {
    const mstart: any = new Date(this.maintenanceTaskObject.startDate);
    const mend: any = new Date(this.maintenanceTaskObject.endDate);
    this.getNewStartandEndDateMaintenance(mstart, mend);
  }

  // onBlurMaxQuantity(): void {
  //   if (this.modifyTaskDurationObject.maxQuantity === "") {
  //     this.modifyTaskDurationObject.maxQuantity = String(0);
  //   }
  //   if (Number(this.modifyTaskDurationObject.maxQuantity) > Number(this.maxQuantityCopy)) {
  //     this.modifyTaskDurationObject.maxQuantity = String(this.maxQuantityCopy);
  //     this.toastr.error('Max quantity cannot be greater than 100% yield. For the selected Line and Gamme Max quantity cannot exceed ' + this.maxQuantityCopy, 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
  //   } else if (Number(this.modifyTaskDurationObject.newQuantity) > Number(this.modifyTaskDurationObject.maxQuantity)) {
  //     this.modifyTaskDurationObject.maxQuantity = String(this.modifyTaskDurationObject.newQuantity);
  //     this.toastr.error('Max quantity cannot be less than Min quantity', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
  //   }

  //   let currentQty = this.modifyTaskDurationObject.maxQuantity;
  //   let calculatedQty = this.checkMaxQuantity;
  //   if (Number(currentQty) !== Number(calculatedQty)) {
  //     this.productionMaxQtyChange.emit({ currentQty, calculatedQty });
  //   }
  // }

  // In HTML >> (focus)="removeCommas()"
  removeCommas(){
    this.modifyTaskDurationObject.newQuantity = this.modifyTaskDurationObject.newQuantity.toString().replace(/,/g, '');
  }

  /* This function calls, when we lose the focus the new min quantity textfield.*/
  onBlurNewQuantityChange(): void {
    // if (this.modifyTaskDurationObject.newQuantity.indexOf(',') === -1) {
    //   this.modifyTaskDurationObject.newQuantity = Number(this.modifyTaskDurationObject.newQuantity).toLocaleString();
    // } //comma
    // this.modifyTaskDurationObject.newQuantity = this.modifyTaskDurationObject.newQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // if (this.modifyTaskDurationObject.maxQuantity !== '' && this.modifyTaskDurationObject.maxQuantity !== undefined && this.modifyTaskDurationObject.maxQuantity !== null) {
    //   if ((Number(this.modifyTaskDurationObject.newQuantity) <= Number(this.modifyTaskDurationObject.maxQuantity))) {
    //     this.requiredQuantityChangeEvent();
    //   } else {
    //     this.toastr.error('Required quantity should be less than or equal to suggested max quantity', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    //     this.modifyTaskDurationObject.newQuantity = this.newQuantityValueCheckStatus;
    //   }
    // } else {
      this.requiredQuantityChangeEvent();
    // }
  }

  /* This function calls, when we lose the focus the new min quantity textfield.*/
  requiredQuantityChangeEvent() {
    if (this.modifyTaskDurationObject.newStartDate !== null && this.modifyTaskDurationObject.newStartDate !== undefined) {
      if (this.modifyTaskDurationObject.newQuantity === "") {
        this.modifyTaskDurationObject.newQuantity = String(0);
      }
      // if (!this.modifyTaskDurationObject.keepDurationConstantStatus) {
      this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.newQuantity);
      // }
      this.makeProductEffectToPackTask();
      let currentQty = this.modifyTaskDurationObject.maxQuantity;
      let calculatedQty = this.checkMaxQuantity;
      if (Number(currentQty) !== Number(calculatedQty)) {
        this.productionMaxQtyChange.emit({ currentQty, calculatedQty });
      }
    }
  }

  /* This function calls, when we change the Min and Max quantity of the production, it will effect to the pack task table */
  makeProductEffectToPackTask() {
    var prodObj = {
      // newQuantity: this.modifyTaskDurationObject.newQuantity.replace(/,/g, ''), //comma
      newQuantity: this.modifyTaskDurationObject.newQuantity,
      newQuantityValueCheckStatus: this.newQuantityValueCheckStatus,
      newStartDate: this.modifyTaskDurationObject.newStartDate,
      newEndDate: this.modifyTaskDurationObject.newEndDate,
      maxQuantity: this.modifyTaskDurationObject.maxQuantity
    }
    this.sharedTask.sendProdDataToBeAssigned(prodObj);
    /*This will fire on pack task component - makeProductEffectToPack()*/
    this.productionDataChangeEvent.emit();
  }

  /* This function calls, when we change start date of the production, it will effect to the pack task table */
  makeProductDateEffectToPackTask() {
    var prodObj = {
      // newQuantity: this.modifyTaskDurationObject.newQuantity.replace(/,/g, ''), //comma
      newQuantity: this.modifyTaskDurationObject.newQuantity,
      newQuantityValueCheckStatus: this.newQuantityValueCheckStatus,
      newStartDate: this.modifyTaskDurationObject.newStartDate,
      newEndDate: this.modifyTaskDurationObject.newEndDate,
      maxQuantity: this.modifyTaskDurationObject.maxQuantity
    }
    this.sharedTask.sendProdDataToBeAssigned(prodObj);
    /*This will fire on pack task component - makeProductDateEffectToPack()*/
    this.productionStartDateChangeEvent.emit();
  }

  /* This function calls, when we change the new duration start date calendar. */
  newDurationStartDateChange() {
    this.scheduledTaskDateRangeInfo = false;
    this.noScheduledTaskDateRangeInfo = false;
    if (this.modifyTaskDurationObject.newEndDate === null) {
      this.modifyTaskDurationObject.newEndDate = this.modifyTaskDurationObject.newStartDate;
      this.newEndDateCopy = this.modifyTaskDurationObject.newEndDate;
      this.endDefaultTime = this.modifyTaskDurationObject.newStartDate;
    }
    this.startDefaultTime = new Date(this.modifyTaskDurationObject.newStartDate);
    if (this.modifyTaskDurationObject.newEndDate !== null) {
      this.startDefaultTime = new Date(this.modifyTaskDurationObject.newStartDate);
      // do calculate quantity and end date
      const mstart: any = new Date(this.modifyTaskDurationObject.newStartDate);
      const mend: any = new Date(this.modifyTaskDurationObject.newEndDate);
      if (!this.modifyTaskDurationObject.keepDurationConstantStatus) {
        if (mstart <= mend) {
          this.newStartDateCopy = this.modifyTaskDurationObject.newStartDate;
        }
      }
      if (this.modifyTaskDurationObject.keepDurationConstantStatus) {
        this.newStartDateCopy = this.modifyTaskDurationObject.newStartDate;
        this.getNewEndDate(this.modifyTaskDurationObject.newQuantity);
        this.makeProductDateEffectToPackTask();
      } else {
        if (mstart <= mend) {
          this.startDateChangeEvent(mstart, mend);
        } else {
          /*If user is selecting start date greater than end date, keep the duration constant and add it 
          to start date to calculate end date. Keep the qty in prod and pack constant, system should 
          adjust the pack dates as per new prod dates.*/
          this.newStartDateCopy = this.modifyTaskDurationObject.newStartDate;
          this.getNewEndDate(this.modifyTaskDurationObject.newQuantity);
          this.makeProductDateEffectToPackTask();
          // this.toastr.error(this.constant.informationMsg, this.constant.informationLabel, { showCloseButton: true, maxShown: 1 });
          // if (this.newStartDateCopy !== null && this.newStartDateCopy !== undefined && this.newStartDateCopy !== '') {
          //   this.modifyTaskDurationObject.newStartDate = new Date(this.newStartDateCopy);
          //   this.startDefaultTime = this.modifyTaskDurationObject.newStartDate; 
          // } else {
          //   if (this.modifyTaskDurationObject.newEndDate !== null) {
          //     /**For create task: select start date greater than end date */
          //     this.modifyTaskDurationObject.newStartDate = this.modifyTaskDurationObject.newEndDate;
          //     this.newStartDateCopy = this.modifyTaskDurationObject.newStartDate;
          //     const pstart: any = new Date(this.modifyTaskDurationObject.newStartDate);
          //     const pend: any = new Date(this.modifyTaskDurationObject.newEndDate);
          //     this.startDateChangeEvent(pstart, pend);
          //   }
          // }
        }
      }
    } else {
      // do nothing - because it is initial case
    }
  }

  /* This function calls, when we change the new duration start date calendar. */
  startDateChangeEvent(mstart, mend) {
    this.getNewQuantity(mstart, mend);
    this.makeProductDateEffectToPackTask();
    let currentQty = this.modifyTaskDurationObject.maxQuantity;
    let calculatedQty = this.checkMaxQuantity;
    if (Number(currentQty) !== Number(calculatedQty)) {
      this.productionMaxQtyChange.emit({ currentQty, calculatedQty });
    }
  }

  /* This function calls, when we change the new duration end date calendar. */
  newDurationEndDateChange(): void {
    this.scheduledTaskDateRangeInfo = false;
    this.noScheduledTaskDateRangeInfo = false;
    this.endDefaultTime = new Date(this.modifyTaskDurationObject.newEndDate);
    if (this.modifyTaskDurationObject.newStartDate !== null) {
      const start: any = new Date(this.modifyTaskDurationObject.newStartDate);
      const end: any = new Date(this.modifyTaskDurationObject.newEndDate);

      if (this.modifyTaskDurationObject.keepDurationConstantStatus) {
        if (start >= end) {
          this.toastr.error(this.constant.informationMsg, this.constant.informationLabel, { showCloseButton: true, maxShown: 1 });
        } else {
          this.newEndDateCopy = this.modifyTaskDurationObject.newEndDate;
          this.makeProductEffectToPackTask();
        }
      } else {
        if (start <= end) {
          this.newEndDateCopy = this.modifyTaskDurationObject.newEndDate;
          this.getNewQuantity(start, end);
          this.makeProductEffectToPackTask();
          let currentQty = this.modifyTaskDurationObject.maxQuantity;
          let calculatedQty = this.checkMaxQuantity;
          if (Number(currentQty) !== Number(calculatedQty)) {
            this.productionMaxQtyChange.emit({ currentQty, calculatedQty });
          }
        } else {
          this.toastr.error(this.constant.informationMsg, this.constant.informationLabel, { showCloseButton: true, maxShown: 1 });
          if (this.newEndDateCopy !== null && this.newEndDateCopy !== undefined && this.newEndDateCopy !== '') {
            this.modifyTaskDurationObject.newEndDate = new Date(this.newEndDateCopy);
            this.endDefaultTime = this.modifyTaskDurationObject.newEndDate;
          } else {
            this.modifyTaskDurationObject.newEndDate = null;
          }
        }
      }
    }
  }

  /**When RQ changed */
  getNewEndDateAndMaxQuantity(newQuantityVal): void {
    // newQuantityVal = newQuantityVal.toString().replace(/,/g, ''); //comma
    let DurationinMins: any;
    if (this.productionData.selectedTask !== undefined) {
      if (this.productionData.selectedTask.Speed !== 0 && this.productionData.selectedTask.Yield !== 0 && this.productionData.selectedTask.SpeedFactor !== 0) {
        DurationinMins = (Number(newQuantityVal) / (this.productionData.selectedTask.Yield / 100)) / (this.productionData.selectedTask.Speed * this.productionData.selectedTask.SpeedFactor);
      } else {
        DurationinMins = 0;
      }
    }
    if (DurationinMins === undefined) {
      DurationinMins = 0
    }
    this.startNewDateVal = new Date(this.modifyTaskDurationObject.newStartDate);
    const mcreatedDate: any = this.startNewDateVal;
    let durationInMs = DurationinMins * 60000;
    mcreatedDate.setMilliseconds(this.startNewDateVal.getMilliseconds() + durationInMs + 462);
    this.modifyTaskDurationObject.newEndDate = new Date(mcreatedDate);
    this.newEndDateCopy = new Date(mcreatedDate);
    this.endDefaultTime = new Date(mcreatedDate);

    if (this.productionData.selectedTask !== undefined) {
      const maxQuantity = DurationinMins * this.productionData.selectedTask.Speed * this.productionData.selectedTask.SpeedFactor;
      this.modifyTaskDurationObject.maxQuantity = String(Math.round(maxQuantity));
      this.maxQuantityCopy = String(Math.round(maxQuantity));
      // this.checkMaxQuantity = String(Math.round(maxQuantity));
    } else {
      this.modifyTaskDurationObject.newQuantity = String(Math.round(0));
      this.modifyTaskDurationObject.maxQuantity = String(Math.round(0));
      this.maxQuantityCopy = String(Math.round(0));
      // this.checkMaxQuantity = String(Math.round(0));
    }
  }

  /* This function calls, when we check and unchcek the keep duration constant, get the start and end dates of the new duration. */
  // startNewDateValOnkeepDurationConstantStatus(startNewDate, startNewEnddate): void {
    // debugger;
    // this.getNewEndDate(this.modifyTaskDurationObject.maxQuantity, this.modifyTaskDurationObject.keepDurationConstantStatus, startNewDate);
    // this.getNewEndDate(this.modifyTaskDurationObject.maxQuantity);
  // }

  /**To get new end date from sugg max*/
  getNewEndDate(newQuantityVal): void {
    let DurationinMins: any;
    if (this.productionData.selectedTask !== undefined) {
      if (this.productionData.selectedTask.Speed !== 0 && this.productionData.selectedTask.Yield !== 0 && this.productionData.selectedTask.SpeedFactor !== 0) {
        DurationinMins = (Number(newQuantityVal) / (this.productionData.selectedTask.Yield / 100)) / (this.productionData.selectedTask.Speed * this.productionData.selectedTask.SpeedFactor);
      } else {
        DurationinMins = 0;
      }
    }
    if (DurationinMins === undefined) {
      DurationinMins = 0
    }
    this.startNewDateVal = new Date(this.modifyTaskDurationObject.newStartDate);
    const mcreatedDate: any = this.startNewDateVal;
    let durationInMs = DurationinMins * 60000;
    mcreatedDate.setMilliseconds(this.startNewDateVal.getMilliseconds() + durationInMs + 462);
    this.modifyTaskDurationObject.newEndDate = new Date(mcreatedDate);
    this.newEndDateCopy = new Date(mcreatedDate);
    this.endDefaultTime =  new Date(mcreatedDate);
  }

  setQuantityAndEnddate() {
    /**On gamme change then start/end date change then come back to original gamme, fetch min/max from DB then calculate end date */
    this.modifyTaskDurationObject.newQuantity = String(atob(localStorage.getItem('prodMinQuantity')));
    this.modifyTaskDurationObject.maxQuantity = String(atob(localStorage.getItem('prodMaxQuantity')));
    // this.maxQuantityCopy = String(atob(localStorage.getItem('prodMaxQuantity')));
    if (this.gammeSelectedStatus) {
      this.checkMaxQuantity = String(atob(localStorage.getItem('prodMaxQuantity')));
      this.newQuantityValueCheckStatus = this.modifyTaskDurationObject.newQuantity;
      this.gammeSelectedStatus = false;
    }
    // debugger;
    // this.getNewEndDate(this.modifyTaskDurationObject.maxQuantity, undefined, this.modifyTaskDurationObject.newStartDate);
    this.getNewEndDate(this.modifyTaskDurationObject.newQuantity);
  }

  /* This function calls, to get the new min & max quanity based on the start and end date changes. */
  getNewQuantity(startNewDate, startNewEnddate): void {
    // This is added for the to show the dates in the pack tasks should match to the production task date
    const diffMs = (startNewEnddate - startNewDate); // milliseconds 
    if (diffMs >= 0) {
      const diff: any = Math.abs((startNewDate) - (startNewEnddate));
      // const minutes: any = Math.floor((diff / 1000) / 60);
      const minutes: any = (diff / 1000) / 60;
      if (this.productionData.selectedTask !== undefined) {
        if (this.productionData.selectedTask.Speed !== 0 && this.productionData.selectedTask.Yield !== 0 && this.productionData.selectedTask.SpeedFactor !== 0) {
          const maxQuantity = minutes * this.productionData.selectedTask.Speed * this.productionData.selectedTask.SpeedFactor;
          const newQuantity = maxQuantity * (this.productionData.selectedTask.Yield / 100);
          this.modifyTaskDurationObject.newQuantity = String(Math.round(newQuantity));
          // this.modifyTaskDurationObject.newQuantity = (Math.round(newQuantity)).toLocaleString(); //comma
          this.modifyTaskDurationObject.maxQuantity = String(Math.round(maxQuantity));
          this.maxQuantityCopy = String(Math.round(maxQuantity));
          if (this.gammeSelectedStatus) {
            this.checkMaxQuantity = String(Math.round(maxQuantity));
            // this.newQuantityValueCheckStatus = this.modifyTaskDurationObject.newQuantity.replace(/,/g, '');//comma
            this.newQuantityValueCheckStatus = this.modifyTaskDurationObject.newQuantity;
            this.gammeSelectedStatus = false;
          }
        } else {
          const newQuantity = 0;
          const maxQuantity = 0;
          this.modifyTaskDurationObject.newQuantity = String(Math.round(newQuantity));
          this.modifyTaskDurationObject.maxQuantity = String(Math.round(maxQuantity));
          this.maxQuantityCopy = String(Math.round(maxQuantity));       
          if (this.gammeSelectedStatus) {
            this.checkMaxQuantity = String(Math.round(maxQuantity));
            this.newQuantityValueCheckStatus = this.modifyTaskDurationObject.newQuantity;
            this.gammeSelectedStatus = false;
          }
        }
      }
    }
  }

  maintenanceEndDatechange() {
    const mstart: any = new Date(this.maintenanceTaskObject.startDate);
    const mend: any = new Date(this.maintenanceTaskObject.endDate);
    if (mstart >= mend) {
      this.toastr.error(this.constant.informationMsg, this.constant.informationLabel, { showCloseButton: true, maxShown: 1 });
    }
  }

  makePackMinQuantityEffectToProd(value) {
    // if (value.isFirstStartDateRow) {
    //   this.modifyTaskDurationObject.newStartDate = new Date(value.beginDate);
    //   this.newStartDateCopy = new Date(value.beginDate);
    //   const mstart: any = new Date(this.modifyTaskDurationObject.newStartDate);
    //   const mend: any = new Date(this.modifyTaskDurationObject.newEndDate);
    //   if (mstart <= mend) {
    //     // this.getNewQuantity(mstart, mend);
    //     // this.assignProdDataToPack(); //after first start date in pack changed then prod start date 
    //     //should change and it should reflect in pack prodData variable
    //     // this.newQuantityValueCheckStatus = this.modifyTaskDurationObject.newQuantity;
    //     /**for First pack bulk task start date change(1 to 2) issue fix 
    //      * OR change 1st bulk tasks end date to future then change start date same as end date - issue fix
    //     */
    //     var minQuantity = 0;
    //     if (value.minDeltaStatus === 'added') {
    //       minQuantity = Number(this.modifyTaskDurationObject.newQuantity) + Number(value.minDeltaValue);
    //     } else if (value.minDeltaStatus === 'removed') {
    //       minQuantity = Number(this.modifyTaskDurationObject.newQuantity) - Number(value.minDeltaValue);
    //     } else {
    //       minQuantity = Number(this.modifyTaskDurationObject.newQuantity);
    //     }
    //     this.modifyTaskDurationObject.newQuantity = String(minQuantity);
    //     this.newQuantityValueCheckStatus = String(minQuantity);
    //     // this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.newQuantity, undefined, this.modifyTaskDurationObject.newStartDate);
    //   } else {
    //     this.toastr.error(this.constant.informationMsg, this.constant.informationLabel, { showCloseButton: true, maxShown: 1 });
    //   }
    // } else {
    //   var minQuantity = 0;
    //   if (value.minDeltaStatus === 'added') {
    //     minQuantity = Number(this.modifyTaskDurationObject.newQuantity) + Number(value.minDeltaValue);
    //   } else if (value.minDeltaStatus === 'removed') {
    //     minQuantity = Number(this.modifyTaskDurationObject.newQuantity) - Number(value.minDeltaValue);
    //   } else {
    //     minQuantity = Number(this.modifyTaskDurationObject.newQuantity);
    //   }
    //   this.modifyTaskDurationObject.newQuantity = String(minQuantity);
    //   this.newQuantityValueCheckStatus = String(minQuantity);
    //   // this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.newQuantity, undefined, this.modifyTaskDurationObject.newStartDate);
    // }
  }

  makePackMaxQuantityEffectToProd(value) {
    // var maxQuantity = 0;
    // if (value.maxDeltaStatus === 'added') {
    //   maxQuantity = Number(this.modifyTaskDurationObject.maxQuantity) + Number(value.maxDeltaValue);
    // } else if (value.maxDeltaStatus === 'removed') {
    //   maxQuantity = Number(this.modifyTaskDurationObject.maxQuantity) - Number(value.maxDeltaValue);
    // } else {
    //   maxQuantity = Number(this.modifyTaskDurationObject.maxQuantity);
    // }
    // this.modifyTaskDurationObject.maxQuantity = String(maxQuantity);
    // this.checkMaxQuantity = String(maxQuantity);
    // this.onMaxQuantityChange();
  }

  makePackStartDateEffectToProd(value) {
    // debugger;
    // this.modifyTaskDurationObject.newStartDate = new Date(value.beginDate);
    // this.newStartDateCopy = new Date(value.beginDate);
    // const mstart: any = new Date(this.modifyTaskDurationObject.newStartDate);
    // const mend: any = new Date(this.modifyTaskDurationObject.newEndDate);
    // if (mstart >= mend) {
    //   this.toastr.error(this.constant.informationMsg, this.constant.informationLabel, { showCloseButton: true, maxShown: 1 });
    // } else {
    //   this.startNewDateValOnkeepDurationConstantStatus(mstart, mend);
    //   /* debugger; */
    //   /**Change prod end date then change max date, then change 1st pack task's (non bulk) start date 
    //    * then max qty will not equal issue fix (Pack data : 1st is non bulk, 2nd is bulk)*/
    //   let durationinMins = Number(this.modifyTaskDurationObject.newQuantity) / (this.productionData.selectedTask.Speed * (this.productionData.selectedTask.Yield / 100) * this.productionData.selectedTask.SpeedFactor);
    //   const maxQuantity = this.productionData.selectedTask.Speed * durationinMins * (100 / 100) * this.productionData.selectedTask.SpeedFactor;
    //   this.modifyTaskDurationObject.maxQuantity = String(Math.round(maxQuantity));
    //   this.maxQuantityCopy = String(Math.round(maxQuantity));
    //   this.checkMaxQuantity = String(Math.round(maxQuantity));
    // }
  }

  // onMaxQuantityChange(): void {
  //   if (this.productionData.selectedTask !== undefined) {
  //     if (this.productionData.selectedTask.Yield !== 0) {
  //       const newQuantity = Number(this.modifyTaskDurationObject.maxQuantity) * (this.productionData.selectedTask.Yield / 100);
  //       this.modifyTaskDurationObject.newQuantity = String(Math.round(newQuantity));
  //       this.getNewEndDate(this.modifyTaskDurationObject.maxQuantity);
  //       this.makeProductEffectToPackTask();
  //     } else {
  //       const newQuantity = 0;
  //       this.modifyTaskDurationObject.newQuantity = String(Math.round(newQuantity));
  //       this.getNewEndDate(this.modifyTaskDurationObject.maxQuantity);
  //       this.makeProductEffectToPackTask();
  //     }
  //   }
  // }

  // assignProdDataToPack() {
  //   var prodObj = {
  //     newQuantity: this.modifyTaskDurationObject.newQuantity,
  //     newQuantityValueCheckStatus: this.newQuantityValueCheckStatus,
  //     newStartDate: this.modifyTaskDurationObject.newStartDate,
  //     newEndDate: this.modifyTaskDurationObject.newEndDate,
  //     maxQuantity: this.modifyTaskDurationObject.maxQuantity
  //   }
  //   this.sharedTask.sendProdDataToBeAssigned(prodObj);
  // }

  /*get the start and end dates of the new duration in Maintenance. */
  getNewStartandEndDateMaintenance(startNewDate, startNewEnddate): void {
    let DurationinMins: any;
    if (this.productionData.selectedTask !== undefined) {
      if (this.productionData.selectedTask.Speed !== 0 && this.productionData.selectedTask.Yield !== 0 && this.productionData.selectedTask.SpeedFactor !== 0) {
        DurationinMins = this.taskHourMinVal;
      } else {
        DurationinMins = 0;
      }
    }
    if (DurationinMins === undefined) {
      DurationinMins = 0
    }
    this.startNewDateVal = new Date(this.maintenanceTaskObject.startDate);
    const mcreatedDate: any = this.startNewDateVal;
    let durationInMs = DurationinMins * 60000;
    mcreatedDate.setMilliseconds(this.startNewDateVal.getMilliseconds() + durationInMs + 462);
    this.maintenanceTaskObject.endDate = new Date(mcreatedDate);
  }

  setCalculatedMaxQuantity(newQuantityVal) {
    // debugger;
    //need to change logic. from where we get duration
    let DurationinMins: any;
    if (this.productionData.selectedTask !== undefined) {
      if (this.modifyTaskDurationObject.newStartDate !== null && this.modifyTaskDurationObject.newEndDate !== null) {
        // DurationinMins = Number(newQuantityVal) / (this.productionData.selectedTask.Speed * (this.productionData.selectedTask.Yield / 100) * this.productionData.selectedTask.SpeedFactor);
        const diffMs = (this.modifyTaskDurationObject.newEndDate - this.modifyTaskDurationObject.newStartDate); // milliseconds 
        if (diffMs >= 0) {
          const diff: any = Math.abs((this.modifyTaskDurationObject.newStartDate) - (this.modifyTaskDurationObject.newEndDate));
          // const minutes: any = Math.floor((diff / 1000) / 60);
          const minutes: any = (diff / 1000) / 60;
          DurationinMins = minutes;
        } else {
          DurationinMins = 0;
        }
      }
      if (DurationinMins === undefined) {
        DurationinMins = 0
      }
      if (this.productionData.selectedTask !== undefined) {
        const maxQuantity = DurationinMins * this.productionData.selectedTask.Speed * this.productionData.selectedTask.SpeedFactor;
        this.maxQuantityCopy = String(Math.round(maxQuantity));
      } else {
        this.maxQuantityCopy = String(Math.round(0));
      }
    }
  }

  getScheduledTaskOnSelectedDateRange() {
    this.scheduledTaskDateRangeInfo = false;
    this.noScheduledTaskDateRangeInfo = false;
    if (!this.isEditMode) {
      if (this.isGammeSelected) {
        return;
      }
    }
    let machineLineId;
    var machineLineIdList = [];
    if (this.modifyTaskDurationObject.newStartDate !== null
      && this.modifyTaskDurationObject.newEndDate !== null
      && this.taskSummaryData.ItemNumber !== '') {
      //  to handle without gamme
      if (this.productionData.selectedTask.Machine_LineId === undefined) {
        machineLineId = this.productionData.selectedTask.MachineLineId;
      } else {
        machineLineId = this.productionData.selectedTask.Machine_LineId;
      }
      //  to handle line id with &
      if (this.productionData.productionTask.MachineDescription.toString().indexOf('&') !== -1) {
        var descriptions = this.productionData.productionTask.MachineDescription.split('&');
        for (var i = 0; i < descriptions.length; i++) {
          machineLineIdList[i] = descriptions[i];
        }
        this.taskDataObject = {
          'BeginDate': new Date(this.modifyTaskDurationObject.newStartDate.getTime() - (this.modifyTaskDurationObject.newStartDate.getTimezoneOffset() * 60000)).toJSON(),
          'EndDate': new Date(this.modifyTaskDurationObject.newEndDate.getTime() - (this.modifyTaskDurationObject.newEndDate.getTimezoneOffset() * 60000)).toJSON(),
          "MachineLineIDList":machineLineIdList, 
          'TaskNumber': this.taskSummaryData.TaskNumber,
          'ItemNumber': this.taskSummaryData.ItemNumber,
          'IsSave': 1
        }
      }  // for special case gamme
      else if (this.specialGamme.length !== 0) {
        for (let i = 1; i <= this.specialGamme.length; i++) {
          machineLineIdList[i] = this.specialGamme[i - 1].MacDescription;
        }
        if (this.selectedLine !== undefined && this.selectedLine !== "") {
          machineLineIdList[0] = this.selectedLine;
        } else {
          machineLineIdList[0] = this.productionData.productionTask.MachineDescription;
        }
        this.taskDataObject = {
          'BeginDate': new Date(this.modifyTaskDurationObject.newStartDate.getTime() - (this.modifyTaskDurationObject.newStartDate.getTimezoneOffset() * 60000)).toJSON(),
          'EndDate': new Date(this.modifyTaskDurationObject.newEndDate.getTime() - (this.modifyTaskDurationObject.newEndDate.getTimezoneOffset() * 60000)).toJSON(),
          "MachineLineIDList":machineLineIdList, 
          'TaskNumber': this.taskSummaryData.TaskNumber,
          'ItemNumber': this.taskSummaryData.ItemNumber,
          'IsSave': 1
        }
      } else {
        this.taskDataObject = {
          'BeginDate': new Date(this.modifyTaskDurationObject.newStartDate.getTime() - (this.modifyTaskDurationObject.newStartDate.getTimezoneOffset() * 60000)).toJSON(),
          'EndDate': new Date(this.modifyTaskDurationObject.newEndDate.getTime() - (this.modifyTaskDurationObject.newEndDate.getTimezoneOffset() * 60000)).toJSON(),
          'MachineLineID': machineLineId,
          'TaskNumber': this.taskSummaryData.TaskNumber,
          'ItemNumber': this.taskSummaryData.ItemNumber,
          'IsSave': 1
        }
      }

      this.loading = true
      this.sharedProServices.postConflictedTasksList(this.taskDataObject, response => {
        this.loading = false;

        if (response.responseCode === 200) {
          this.conflitedTasksRetrivedData = (response.data) ? response.data : [];
          if (response.data.length !== 0) {
            for (let i = 0; i < response.data.length; i++) {
              this.conflitedTasksRetrivedData[i].BeginDate = this.sharedService.getDateAMPMFormat(response.data[i].BeginDate);
              this.conflitedTasksRetrivedData[i].EndDate = this.sharedService.getDateAMPMFormat(response.data[i].EndDate);
            }

            this.conflictedTaskFirstNumber = response.data[0].TaskNumber;
            this.conflictedTaskLength = response.data.length - 1;
            this.scheduledTaskDateRangeInfo = true;
          } else {
            this.noScheduledTaskDateRangeInfo = true;
          }
        }
        else {
          console.log(response);
          this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        }

      }, error => {

      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
     localStorage.removeItem('taskDate');
    localStorage.removeItem('taskLine');
  }

}
