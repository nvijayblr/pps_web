import { Component, OnInit, ViewEncapsulation, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { DialogComponent } from '../../../../common/dialog/dialog.component';
import { ProductionService } from '../../../../services/home/production.service';
import { Languageconstant } from '../../../../utill/constants/languageconstant';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { Constant } from '../../../../utill/constants/constant';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
// import 'eonasdan-bootstrap-datetimepicker';
import * as moment from 'moment';
// import { A2Edatetimepicker } from 'ng2-eonasdan-datetimepicker';
// import 'eonasdan-bootstrap-datetimepicker';
// import { DateTimePickerDirective } from 'ng2-eonasdan-datetimepicker/dist/datetimepicker.directive';
import tableDragger from 'table-dragger';
import { SharedService } from '../../../../services/home/shared.service';
import { LoginService } from '../../../../services/login/login.service';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css'],
  providers: [DatePipe]
})
export class ProductionComponent implements OnInit {

  // @Output() itemNumberCleared = new EventEmitter();

  ExportpopupDetails: any;
  jobchangeurlconstant: string;
  popUpDetailsgroupId: any;
  popUpDetailsdate: any;
  date: any;
  date2MinDate: any;
  minDate = new Date();

  weekstartExport: String;
  weekendExport: String;
  exportDate = new Date();

  public popUpDetails;
  public export = {
    Primary: false,
    Décor: false,
    VAP: false,
    Miscellaneous: false
  }

  public weekDays = [];
  public selectedArray = [];
  public selectedArrays = [];
  public timeSlot = [];
  public weekDaysStatus = '';
  public timeSlotStatus = '';
  public loading = true;
  public loadingt = true;
  public apiData: any;
  public productionLiButtons = [];
  public isLiItemClicked = 'Primary Production';
  public isLiItemClickedIndex = 0;
  public progressFurnaces = [];
  public formLines = [];
  public tonStates = [];
  public jobChanges = [];
  public weekStartday;
  public defaultDay;
  public weekEndday;
  public DateCalander = [];
  public currentDate = new Date();
  public viewFlag = 'primary';
  public simulateFlag = false;
  public createTaskWithoutGamme = false;
  public createExport = false;
  public exportPrimary = false;
  public exportDecor = false;
  public exportVap = false;
  public exportMisc = false;
  public weekcountExport = 1;
  public editTaskVisible = false;
  public createTaskVisible = false;
  public modifyTaskDurationStatus = false;
  public changeOperatingModeStatus = false;
  public addViewCommentsStatus = false;
  public unscheduleTaskStatus = false;
  public editTaskVisibleLiItem = false;
  public rescheduleTask = false;
  public unscheduledTasksItems = [];
  public rescheduledTaskItems = [];
  public freezeScheduleLbl = 'Freeze Schedule';
  public selectedTask;
  public selectedUnscheduledTask;
  public taskBackgroundColor = 'red';
  public legendData;
  public reasonforChangeList = [];
  public formingLineList = [];
  public selecedLine: String;
  public popUpLineName: String;
  public simulatedPage: String;
  public pageHeader: String;
  public newStartDateDisableStatus = false;
  public modifyTaskDurationdata;
  public rescheduleTaskdata;
  public changeOperatingModedata;
  public dateStatusError = false;
  public isEndDatevalid: boolean = false
  public isChangeEndDatevalid: boolean = false;
  public dateStatus = false;
  public changeDateStatus = false;
  public lineName;
  public gammeSelected = false;
  public selectedGamme;
  public alternateGammeOptions;
  public addNewtaskdata;
  public typeOfCode;
  public modifyValidation = false;
  public addValidation = false;
  public changeValidation = true;
  public yieldFactorValidation = false;
  public timeHours = [];
  public timeHoursMinute = [];
  public alternateGammeOptionsSelectedData;
  public startTimeFinal;
  public endTimeFinal;
  public startNewDateVal;
  public startNewEnddateVal;
  public rescheduleEndTimeHour;
  public rescheduleEndTimeMinutes;
  public onCreateOk = false;
  public onModifyTaskDurationOk = false;
  public rescheduleTaskOk = false;
  public jobChangesPopUp = false;
  public onchangeOk = false;
  public timeInMinutes;
  public taskHourVal;
  public newStartDate1 = '12/25/2017';
  public taskHourMinVal;
  public rescheduleEndDate: any;
  public taskOngoingStatus = false;
  public isEdit = false;
  public weekstart;
  public isPrimaryProduction = false;
  public access = null; /* null=noAccess ; false=view; true=fullAccess */
  public primaryAccess = null; /* null=noAccess ; false=view; true=fullAccess */
  public decorAccess = null; /* null=noAccess ; false=view; true=fullAccess */
  public vapAccess = null; /* null=noAccess ; false=view; true=fullAccess */
  public miscAccess = null; /* null=noAccess ; false=view; true=fullAccess */
  public setPackAccess = null;/* null=noAccess ; false=view; true=fullAccess */
  public moduleName = '';
  public approveJobChanges = false;
  public approvePopUpShow = false;
  public taskCount = '';
  public taskNumber;
  public editFromChangeSummary = false;
  public showEditTaskPopUp = false;
  public today = new Date();
  
  public myDatePickerOptionsStart: IMyDpOptions = {
    showTodayBtn: false,
    dateFormat: 'mm/dd/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    inline: false,
    showClearDateBtn: false,
    alignSelectorRight: true,
    editableDateField: false,
    openSelectorOnInputClick: true,
    disableUntil: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() - 1
    }
  };
  public myDatePickerOptions: IMyDpOptions = {
    showTodayBtn: false,
    dateFormat: 'mm/dd/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    inline: false,
    showClearDateBtn: false,
    alignSelectorRight: true,
    editableDateField: false,
    openSelectorOnInputClick: true,
    disableUntil: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() - 1
    }
  };
  public myDatePickerOptionsChange: IMyDpOptions = {
    showTodayBtn: false,
    dateFormat: 'mm/dd/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    inline: false,
    showClearDateBtn: false,
    alignSelectorRight: true,
    editableDateField: false,
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    openSelectorTopOfInput: true,
    disableUntil: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() - 1
    }
  };
  public modifyTaskDurationObject = {
    modiTaskName: '',
    modiItemName: '',
    currentStartDate: '',
    currentEndDate: '',
    currentQuantity: '',
    newStartDate: new Date(2017, 0, 28),
    startTime: '',
    endTime: '',
    newEndDate: new Date(2017, 0, 28),
    newQuantity: '',
    reasonforChange: '0',
    taskNumber: '',
    itemNumber: '',
    PONumber: '',
    startTimeHour: '00',
    startTimeminute: '00',
    startTimeminuteType: '0',
    endTimeHour: '00',
    endTimeminute: '00',
    endTimeminuteType: '0',
    keepDurationConstantStatus: true
  }

  public changeOperatingModeObject = {
    comTaskName: '',
    currentFormingLine: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    alternateGammeOptions: [],
    availableStartDate: '',
    availableEndDate: '',
    startTimeHour: '00',
    startTimeminute: '00',
    startTimeminuteType: '0',
    endTimeHour: '00',
    endTimeminute: '00',
    endTimeminuteType: '0'
  }

  public addViewCommentsObject = {
    comments: []
  }

  public unscheduleTaskObject = {
    unTaskName: '',
  }
  public rescheduleTaskObject = {
    startDate: '',
    endDate: '',
    currentFormingLine: '',
    startTimeHour: '00',
    startTimeminute: '00',
    startTimeminuteType: '0',
    endTimeHour: '00',
    endTimeminute: '00',
    endTimeminuteType: '0'
  }

  public addNewTaskObject = {
    selectLine: '0',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    pullTonsPerDay: '',
    speed: '100',
    yieldFactor: '1',
    quantity: '',
    itemNumber: '',
    createPacktaskStatus: false,
    createPacktaskManning: '',
    createPacktaskStatusQuantity: '',
    createPacktaskStatusItemNumber: '',
    startTimeHour: '00',
    startTimeminute: '00',
    startTimeminuteType: '0',
    endTimeHour: '00',
    endTimeminute: '00',
    endTimeminuteType: '0'
  }
  public isChangeSummary = false;
  public detailedChangeSummary = false;
  public changeConsolidated = [];
  public changeSummaryDetails = {
    "ProdTask": [],
    "PackTask": []
  };
  public noPackTask = true;
  public packTaskDetails: any;
  public prodTaskDetails: any;
  public approvedDate = null;
  public approvedBy = null;
  public userNameTypeahead = new EventEmitter<string>();
  public userNameList = [];
  public userName = '';
  public approveClick = false;
  public approvePopUpDetails;
  public userID = null;

  date1: moment.Moment;
  a2eOptions: any;
  constructor(
    private router: Router,
    private productionService: ProductionService,
    private languageconstant: Languageconstant,
    private toastr: ToastsManager,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    public constant: Constant,
    private vcr: ViewContainerRef,
    private sharedService: SharedService,
    private loginService: LoginService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    //   require.ensure([' <script src="https://code.jquery.com/jquery-1.12.3.min.js"></script>

    //   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>'], require => {
    //     let yourModule = require(' <script src="https://code.jquery.com/jquery-1.12.3.min.js"></script>

    //     <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>');
    //     yourModule.someFunction();
    //  });

    /*UserName Typeahead*/
    this.userNameTypeahead.subscribe(data => {
      if(data && data.length > 1) {
        this.productionService.getUserNames(data, response => {
          this.userNameList = response.data;
        }, error => {
          console.log(error);
        });
      } else {
        this.userNameList = [];
      }
    });
  }

  ngOnInit() {
    if (localStorage.getItem("userData") === null) {
      this.onSessionToastMessage();
      this.gotoLogin();
    } else {
      localStorage.removeItem('taskDate');
      localStorage.removeItem('taskLine');
      localStorage.removeItem('lineId')
      this.getEachTabAccess();
      this.date2MinDate = new Date();
      this.date2MinDate.setDate(this.date2MinDate.getDate() - 1);
      this.date1 = moment();
      this.a2eOptions = { format: 'YYYY/MM/DD HH:mm' };
      this.addProductionLiButtons();
      if (this.router.url === '/dashboard/productions/primary') {
        if (this.primaryAccess === null) {
          this.noAccess();
        } else {
          this.onLiBtnclick('Primary Production', 0);
        }
      } else if (this.router.url === '/dashboard/productions/decor') {
        if (this.decorAccess === null) {
          this.noAccess();
        } else {
          this.onLiBtnclick('Decor Production', 2);
        }
      } else if (this.router.url === '/dashboard/productions/vap') {
        if (this.vapAccess === null) {
          this.noAccess();
        } else {
          this.onLiBtnclick('VAP Production', 4);
        }
      } else if (this.router.url === '/dashboard/productions/miscellaneous') {
        if (this.miscAccess === null) {
          this.noAccess();
        } else {
          this.onLiBtnclick('Miscellaneous Production', 6);
        }
      } else {
        var moduleName = this.checkingForLandingTab();
        if (moduleName === 'SETPACK') {
          this.router.navigate(['packs', 'repack'], { relativeTo: this.activatedRoute.parent });
        }
        else {
          var selectedTab = this.getFirstTab(moduleName);
          this.onLiBtnclick(selectedTab.name, selectedTab.value);
        }
      }
      this.loadLegendsFromAPI();
      this.addtimeHous();
      this.addtimeMinutes();
      this.callDnD();
    }
  }

  /** Landing page logic based on the permission (There should be atleast one Scheduling module)*/
  checkingForLandingTab(): any {
    let moduleName = '';
    for (var i = 0; i < this.constant.moduleArray.length - 1; i++) {
      /** this.constant.moduleArray.length-1 means we do not need manning here */
      let tabAccess = this.loginService.getUserTransaction(this.constant.moduleArray[i]);
      if (tabAccess !== null) {
        /* Full access OR View access */
        moduleName = this.constant.moduleArray[i];
        break;
      } else {
        continue;
      }
    }
    return moduleName;
  }

  /**According to module access, we need to find which tab we need to show */
  getFirstTab(name): any {
    var modules = {
      name: '',
      value: 0
    };
    switch (name) {
      case this.constant.moduleArray[0]:
        modules.name = 'Primary Production';
        modules.value = 0;
        break;
      case this.constant.moduleArray[1]:
        modules.name = 'Decor Production';
        modules.value = 2;
        break;
      case this.constant.moduleArray[2]:
        modules.name = 'VAP Production';
        modules.value = 4;
        break;
      case this.constant.moduleArray[3]:
        modules.name = 'Miscellaneous Production';
        modules.value = 6;
        break;
      case this.constant.moduleArray[4]:
        modules.name = 'Set And Pack';
        modules.value = 9;
        break;
      default:
        break;
    }
    return modules;
  }

  getEachTabAccess(): void {
    /* null=noAccess ; false=viewAccess; true=fullAccess */
    this.primaryAccess = this.loginService.getUserTransaction(this.constant.moduleArray[0]);
    this.decorAccess = this.loginService.getUserTransaction(this.constant.moduleArray[1]);
    this.vapAccess = this.loginService.getUserTransaction(this.constant.moduleArray[2]);
    this.miscAccess = this.loginService.getUserTransaction(this.constant.moduleArray[3]);
    this.setPackAccess = this.loginService.getUserTransaction(this.constant.moduleArray[4]);
  }

  noAccess(): void {
    this.noAccessToastMessage();
    this.gotoLogin();
  }

  gotoLogin(): void {
    setTimeout(() => {
      const link = ['login'];
      this.router.navigate(link);
    }, this.constant.minToastLife);
  }

  callDnD(): void {
    // tableDragger(document.querySelector('#table'));
    // tableDragger(document.querySelector("#table"), { mode: "row" });
    // tableDragger(document.querySelector("#table"), { mode: "row"});
    // $("#table-1").tableDnD();
    // tableDragger(document.querySelector('#table'), { mode: 'free', dragHandler: '.handle', onlyBody: true })
    // https://www.npmjs.com/package/table-dragger
    // http://isocra.com/2008/02/table-drag-and-drop-jquery-plugin/comment-page-24/
  }

  addtimeHous(): void {
    // this.timeHours.push({ 'value': 0, 'hour': '00' })
    for (let i = 0; i <= 12; i++) {
      if (i < 10) {
        this.timeHours.push({ 'value': '0' + i, 'hour': '0' + i })
      } else {
        this.timeHours.push({ 'value': i, 'hour': i });
      }
    }
  }

  addtimeMinutes(): void {
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.timeHoursMinute.push({ 'value': '0' + i, 'min': '0' + i })
      } else {
        this.timeHoursMinute.push({ 'value': i, 'min': i })
      }
    }
  }

  addProductionLiButtons(): void {
    if (this.primaryAccess !== null) {
      this.productionLiButtons.push(
        { name: 'Primary Production' },
        { name: 'Primary Pack' }
      )
    }
    if (this.decorAccess !== null) {
      this.productionLiButtons.push(
        { name: 'Decor Production' },
        { name: 'Decor Pack' }
      )
    }
    if (this.vapAccess !== null) {
      this.productionLiButtons.push(
        { name: 'VAP Production' },
        { name: 'VAP Pack' }
      )
    }
    if (this.miscAccess !== null) {
      this.productionLiButtons.push(
        { name: 'Miscellaneous Production' },
        { name: 'Miscellaneous Pack' }
      )
    }
    if (this.setPackAccess !== null) {
      this.productionLiButtons.push(
        { name: 'Set and Pack' },
      )
    }

  }

  alternateGammeOptionsSelected(selectedData, index): void {
    this.selectedGamme = index;
    this.alternateGammeOptionsSelectedData = selectedData;
  }

  onLiBtnclick(name, index): void {
    this.simulateFlag = false;
    this.isLiItemClicked = name;
    this.constant.priprodBtnStatusObject.btnName = name;
    this.constant.priprodBtnStatusObject.index = index;
    var currentDateString = this.getDateStringFormat(new Date());
    if (name === 'Primary Production') {
      this.access = this.primaryAccess;
      this.loading = true;
      this.selecedLine = 'Forming Lines';
      this.popUpLineName = 'Forming Line';
      this.simulatedPage = ' Primary Production Simulation';
      this.pageHeader = 'Primary Production Schedule';
      this.viewFlag = 'primary';
      this.isPrimaryProduction = true;
      this.router.navigate(['productions', 'primary'], { relativeTo: this.activatedRoute.parent });
      if (localStorage.getItem("weekStartMonday") != null) {
        this.loadDataofPrimaryProductionFromAPI(localStorage.getItem("weekStartMonday"));
        localStorage.removeItem('weekStartMonday');
      }
      else if (localStorage.getItem("weekStartday") === null) {
        this.loadDataofPrimaryProductionFromAPI(currentDateString);
      }
      else if (localStorage.getItem("weekStartday") !== null && this.constant.editFromChangeSummary && !this.constant.isSimulated) {
        this.loadDataofPrimaryProductionFromAPI(localStorage.getItem("weekStartday"));
        this.getChangeSummary(1, 0);
      }
      else if (localStorage.getItem("weekStartday") !== null && this.constant.editFromChangeSummary && this.constant.isSimulated) {
        this.onSimulateChange();
        this.getChangeSummary(1, 0);
      }
    } else if (name === 'Primary Pack') {
      this.access = this.primaryAccess;
      this.loading = true;
      this.selecedLine = 'Forming Lines';
      this.popUpLineName = 'Forming Line';
      this.pageHeader = 'Primary Pack Schedule';
      this.router.navigate(['packs', 'primary'], { relativeTo: this.activatedRoute.parent });
    } else if (name === 'Decor Production') {
      this.isPrimaryProduction = false;
      this.access = this.decorAccess;
      this.loading = true;
      this.selecedLine = 'Decor Lines';
      this.popUpLineName = 'Decor Line';
      this.simulatedPage = 'Decor Production Simulation';
      this.pageHeader = 'Decor Production Schedule';
      this.viewFlag = 'decor';
      this.router.navigate(['productions', 'decor'], { relativeTo: this.activatedRoute.parent });
      if (localStorage.getItem("weekStartday") === null) {
        this.loadDataofDecorProductionFromAPI(currentDateString);
      } else if (localStorage.getItem("weekStartday") !== null && this.constant.editFromChangeSummary && !this.constant.isSimulated) {
        this.loadDataofDecorProductionFromAPI(localStorage.getItem("weekStartday"));
        this.getChangeSummary(2, 0);
      }
      else if (localStorage.getItem("weekStartday") !== null && this.constant.editFromChangeSummary && this.constant.isSimulated) {
        this.onSimulateChange();
        this.getChangeSummary(2, 0);
      }
    } else if (name === 'Decor Pack') {
      this.access = this.decorAccess;
      this.loading = true;
      this.selecedLine = 'Decor Lines';
      this.popUpLineName = 'Decor Line';
      this.pageHeader = 'Decor Pack Schedule';
      this.router.navigate(['packs', 'decor'], { relativeTo: this.activatedRoute.parent });
    } else if (name === 'VAP Production') {
      this.isPrimaryProduction = false;
      this.access = this.vapAccess;
      this.loading = true;
      this.selecedLine = 'Vap Lines';
      this.popUpLineName = 'Vap Line';
      this.pageHeader = 'VAP Production Schedule';
      this.simulatedPage = 'VAP Production Simulation';
      this.viewFlag = 'vap';
      this.router.navigate(['productions', 'vap'], { relativeTo: this.activatedRoute.parent });
      if (localStorage.getItem("weekStartday") === null) {
        this.loadDataofVAPProductionFromAPI(currentDateString);
      } else if (localStorage.getItem("weekStartday") !== null && this.constant.editFromChangeSummary && !this.constant.isSimulated) {
        this.loadDataofVAPProductionFromAPI(localStorage.getItem("weekStartday"));
        this.getChangeSummary(4, 0);
      }
      else if (localStorage.getItem("weekStartday") !== null && this.constant.editFromChangeSummary && this.constant.isSimulated) {
        this.onSimulateChange();
        this.getChangeSummary(4, 0);
      }
    } else if (name === 'VAP Pack') {
      this.access = this.vapAccess;
      this.loading = true;
      this.selecedLine = 'Vap Lines';
      this.popUpLineName = 'Vap Line';
      this.pageHeader = 'VAP Pack Schedule';
      this.router.navigate(['packs', 'vap'], { relativeTo: this.activatedRoute.parent });
    } else if (name === 'Miscellaneous Production') {
      this.isPrimaryProduction = false;
      this.access = this.miscAccess;
      this.loading = true;
      this.selecedLine = 'Miscellaneous Lines';
      this.popUpLineName = 'Miscellaneous Line';
      this.pageHeader = 'Miscellaneous Production Schedule';
      this.simulatedPage = 'Miscellaneous Production Simulation';
      this.viewFlag = 'miscellaneous';
      this.router.navigate(['productions', 'miscellaneous'], { relativeTo: this.activatedRoute.parent });
      if (localStorage.getItem("weekStartday") === null) {
        this.loadDataofMiscellaneousProductionFromAPI(currentDateString);
      }
      else if (localStorage.getItem("weekStartday") !== null && this.constant.editFromChangeSummary && !this.constant.isSimulated) {
        this.loadDataofMiscellaneousProductionFromAPI(localStorage.getItem("weekStartday"));
        this.getChangeSummary(5, 0);
      }
      else if (localStorage.getItem("weekStartday") !== null && this.constant.editFromChangeSummary && this.constant.isSimulated) {
        this.onSimulateChange();
        this.getChangeSummary(5, 0);
      }
    } else if (name === 'Miscellaneous Pack') {
      this.access = this.miscAccess;
      this.loading = true;
      this.selecedLine = 'Miscellaneous Lines';
      this.popUpLineName = 'Miscellaneous Line';
      this.pageHeader = 'Miscellaneous Pack Schedule';
      this.router.navigate(['packs', 'miscellaneous'], { relativeTo: this.activatedRoute.parent });
    } else if (name === 'Set and Pack') {
      this.access = this.setPackAccess;
      this.loading = true;
      this.selecedLine = 'Repack Lines';
      this.popUpLineName = 'Repack Line';
      this.pageHeader = 'Set and Pack Schedule';
      this.router.navigate(['packs', 'repack'], { relativeTo: this.activatedRoute.parent });
    }
    /**Back from edit task */
    if (this.constant.fromSimulateChange) {
      this.loading = true;
      this.weekStartday = this.constant.weekStartday;
      this.constant.fromSimulateChange = false;
      localStorage.removeItem('fromSimulateChange');
      setTimeout(() => {
        this.onSimulateChange();
      }, this.constant.minToastLife);
    }
  }

  loadDaysTimeSlot(weekDays): void {
    this.timeSlotStatus = '';
    this.timeSlot = [];
    for (let i = 0; i < weekDays.length; i++) {
      if (weekDays[i].IsCurrentDay) {
        this.timeSlotStatus = 'current';
      } else {
        this.timeSlotStatus = '';
      }
      this.timeSlot.push({
        first12: '12 AM',
        middle8: '8 AM',
        last4: '4 PM',
        status: this.timeSlotStatus
      })
    }
  }

  loadLegendsFromAPI(): void {
    // this.loading = true;
    this.productionService.getLegendDetails('', response => {
      // this.loading = false;
      if (response.responseCode === 200) {
        this.legendData = response.data
      } else {
      }
    }, error => {
      // this.loading = false;
    });
  }

  loadDataofPrimaryProductionFromAPI(dateString): void {
    this.formLines = [];
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getPrimaryProductionDetails(reqBody, response => {
      // this.apiData = response;
      this.weekDays = [];
      this.loading = false;
      // console.log(response);
      if (response.responseCode === 200) {
        this.apiData = response;
        this.weekStartday = this.getDateStringFormat(this.apiData.data.ProductionWeekStartDate);
        this.weekstart = this.weekStartday;
        this.defaultDay = new Date(this.weekStartday);
        this.defaultDay.setDate(this.defaultDay.getDate());
        this.weekEndday = this.getDateStringFormat(this.apiData.data.ProductionWeekEndDate);
        this.weekDays = this.apiData.data.FormingLines[0].Days;
        this.loadDaysTimeSlot(this.weekDays);
        this.progressFurnaces = this.apiData.data.TonStates[0].Furnaces;
        this.formLines = this.apiData.data.FormingLines;
        this.tonStates = this.apiData.data.TonStates;
        this.jobChanges = this.apiData.data.JobChanges;
        this.chechkBlownPressTaskNull();
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
  }
  chechkBlownPressTaskNull() {
    for (let i = 0; i < this.jobChanges.length; i++) {
      if (this.jobChanges[i].blowTask === null) {
        var blownTask = {
          'ApprovalStatus': false,
          'CoGroupType': 2,
          'BlowTaskCount': 0
        }
        this.jobChanges[i].blowTask = blownTask;

      }
      if (this.jobChanges[i].pressTask === null) {
        var pressTask = {
          'ApprovalStatus': false,
          'CoGroupType': 1,
          'PressTaskCount': 0
        }
        this.jobChanges[i].pressTask = pressTask;
      }
    }
  }
  loadDataofSimulationFromAPI(dateString, type): void {
    this.formLines = [];
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getSimulationDetails(reqBody, type, response => {
      // this.apiData = response;
      this.weekDays = [];
      this.loading = false;
      // console.log(response);
      if (response.responseCode === 200) {
        this.apiData = response;
        this.weekStartday = this.getDateStringFormat(this.apiData.data.ProductionWeekStartDate);
        this.weekstart = this.weekStartday;
        this.defaultDay = new Date(this.weekStartday);
        this.defaultDay.setDate(this.defaultDay.getDate());
        this.weekEndday = this.getDateStringFormat(this.apiData.data.ProductionWeekEndDate);
        this.weekDays = this.apiData.data.FormingLines[0].Days;
        this.loadDaysTimeSlot(this.weekDays);
        if (this.apiData.data.TonStates.length > 0) {
          this.progressFurnaces = this.apiData.data.TonStates[0].Furnaces;
        }
        this.formLines = this.apiData.data.FormingLines;
        this.tonStates = this.apiData.data.TonStates;
        // this.tonStates[0].Furnaces[0].CurrentUtilization = 20;
        this.jobChanges = this.apiData.data.JobChanges;
        this.chechkBlownPressTaskNull();
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
  }

  loadDataofDecorProductionFromAPI(dateString): void {
    this.formLines = [];
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getDecorProductionDetails(reqBody, response => {
      this.loading = false;
      this.weekDays = [];
      // console.log(response);
      if (response.responseCode === 200) {
        this.apiData = response;
        this.weekStartday = this.getDateStringFormat(this.apiData.data.ProductionWeekStartDate);
        this.weekstart = this.weekStartday;
        this.defaultDay = new Date(this.weekStartday);
        this.defaultDay.setDate(this.defaultDay.getDate());
        this.weekEndday = this.getDateStringFormat(this.apiData.data.ProductionWeekEndDate);
        this.weekDays = this.apiData.data.FormingLines[0].Days;
        this.loadDaysTimeSlot(this.weekDays);
        if (this.apiData.data.TonStates !== null && this.apiData.data.TonStates.length !== 0) {
          this.progressFurnaces = this.apiData.data.TonStates[0].Furnaces;
        }
        this.formLines = this.apiData.data.FormingLines;
        this.tonStates = this.apiData.data.TonStates;
        this.jobChanges = this.apiData.data.JobChanges;
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
  }

  loadDataofVAPProductionFromAPI(dateString): void {
    this.formLines = [];
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getVAPProductionDetails(reqBody, response => {
      this.loading = false;
      this.weekDays = [];
      // console.log(response);
      if (response.responseCode === 200) {
        this.apiData = response;
        this.weekStartday = this.getDateStringFormat(this.apiData.data.ProductionWeekStartDate);
        this.weekstart = this.weekStartday;
        this.defaultDay = new Date(this.weekStartday);
        this.defaultDay.setDate(this.defaultDay.getDate());
        this.weekEndday = this.getDateStringFormat(this.apiData.data.ProductionWeekEndDate);
        this.weekDays = this.apiData.data.FormingLines[0].Days
        this.loadDaysTimeSlot(this.weekDays);
        if (this.apiData.data.TonStates !== null && this.apiData.data.TonStates.length !== 0) {
          this.progressFurnaces = this.apiData.data.TonStates[0].Furnaces;
        }
        this.formLines = this.apiData.data.FormingLines;
        this.tonStates = this.apiData.data.TonStates;
        this.jobChanges = this.apiData.data.JobChanges;
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
  }

  loadDataofMiscellaneousProductionFromAPI(dateString): void {
    this.formLines = [];
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getMiscellaneousProductionDetails(reqBody, response => {
      this.loading = false;
      this.weekDays = [];
      // console.log(response);
      if (response.responseCode === 200) {
        this.apiData = response;
        this.weekStartday = this.getDateStringFormat(this.apiData.data.ProductionWeekStartDate);
        this.weekstart = this.weekStartday;
        this.defaultDay = new Date(this.weekStartday);
        this.defaultDay.setDate(this.defaultDay.getDate());
        this.weekEndday = this.getDateStringFormat(this.apiData.data.ProductionWeekEndDate);
        this.weekDays = this.apiData.data.FormingLines[0].Days
        this.loadDaysTimeSlot(this.weekDays);
        if (this.apiData.data.TonStates !== null && this.apiData.data.TonStates.length !== 0) {
          this.progressFurnaces = this.apiData.data.TonStates[0].Furnaces;
        }
        this.formLines = this.apiData.data.FormingLines;
        this.tonStates = this.apiData.data.TonStates;
        this.jobChanges = this.apiData.data.JobChanges;
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
  }

  gotoPreviousWeek(_date): void {
    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    if (new Date(_date).getTime() <= prevMonday.getTime()) {
      this.toastr.clearAllToasts();
      // this.toastr.error('Previous week data not available.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      return;
    }
    _date = moment(moment(_date, "MM/DD/YYYY").endOf('week').subtract(7, 'days')).format('MM/DD/YYYY');
    this.exportDate = moment(_date, "MM/DD/YYYY").toDate();
    this.convertToWeekDays(this.exportDate);
  }

  gotoNextWeek(_date): void {
    _date = moment(moment(_date, "MM/DD/YYYY").endOf('week').add(7, 'days')).format('MM/DD/YYYY');
    this.exportDate = moment(_date, "MM/DD/YYYY").toDate();
    this.convertToWeekDays(this.exportDate)
  }

  convertToWeekDays(_date): void {
    this.weekstartExport = moment(moment(_date, "MM/DD/YYYY").startOf('week').add(1, 'days')).format('MM/DD/YYYY');
    this.weekendExport = moment(moment(_date, "MM/DD/YYYY").endOf('week').add(1, 'days')).format('MM/DD/YYYY');
    this.exportDate = moment(this.weekstartExport, "MM/DD/YYYY").toDate();
  }

  weekPicker(selecetedDate): void {
    //if(this.weekstart !== Object){
    if (selecetedDate !== null) {
      this.weekstart = selecetedDate;
    }
    let dateString = this.weekstart;
    let newDate = new Date(dateString);
    //} else {
    //let newDate = this.weekstart;
    //}

    var weekYear = this.getWeekNumber(newDate);
    var year = weekYear[0];
    var week = weekYear[1];

    if (week !== undefined && year !== undefined) {
      var startDate = this.getStartDateOfWeek(week, year);
    }
    var weekPeriod = this.getStartDateOfWeek(week, year);
    if (weekPeriod[0] != undefined && weekPeriod[1] != undefined) {
      const newDate = weekPeriod[0] + " to " + weekPeriod[1];
      //$scope.formData.dueDate = weekPeriod[0] + " to "+ weekPeriod[1];
    }
    if (this.simulateFlag) {
      // this.loadDataofSimulationFromAPI(nextDateString);
      if (this.viewFlag === 'decor') {
        this.loadDataofSimulationFromAPI(weekPeriod[0], 2);
        this.getUnscheduledTasksDetailsFromAPI(weekPeriod[0], 2);
      } else if (this.viewFlag === 'vap') {
        this.loadDataofSimulationFromAPI(weekPeriod[0], 4);
        this.getUnscheduledTasksDetailsFromAPI(weekPeriod[0], 4);
      } else if (this.viewFlag === 'primary') {
        this.loadDataofSimulationFromAPI(weekPeriod[0], 1);
        this.getUnscheduledTasksDetailsFromAPI(weekPeriod[0], 1);
      } else if (this.viewFlag === 'miscellaneous') {
        this.loadDataofSimulationFromAPI(weekPeriod[0], 5);
        this.getUnscheduledTasksDetailsFromAPI(weekPeriod[0], 5);
      }
    } else {
      if (this.viewFlag === 'decor') {
        this.loadDataofDecorProductionFromAPI(weekPeriod[0]);
      } else if (this.viewFlag === 'vap') {
        this.loadDataofVAPProductionFromAPI(weekPeriod[0]);
      } else if (this.viewFlag === 'primary') {
        this.loadDataofPrimaryProductionFromAPI(weekPeriod[0]);
      } else if (this.viewFlag === 'miscellaneous') {
        this.loadDataofMiscellaneousProductionFromAPI(weekPeriod[0]);
      }
    }
  }
  getWeekNumber(d) {
    d = new Date(+d);
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    let yearStart: any = new Date(d.getFullYear(), 0, 1);
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return [d.getFullYear(), weekNo];
  }

  getStartDateOfWeek(w, y) {
    // console.log(w, y);
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    let ISOweekStart: any = simple;
    if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay());
    else
      ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay());
    ISOweekStart.setDate(ISOweekStart.getDate() + 1);
    let ISOweekEnd: any = new Date(ISOweekStart);
    ISOweekEnd.setDate(ISOweekEnd.getDate() + 6);

    ISOweekStart = (ISOweekStart.getMonth() + 1) + '/' + ISOweekStart.getDate() + '/' + ISOweekStart.getFullYear();
    ISOweekEnd = (ISOweekEnd.getMonth() + 1) + '/' + ISOweekEnd.getDate() + '/' + ISOweekEnd.getFullYear();
    return [ISOweekStart, ISOweekEnd];
  }


  onPreviousWeekdate(): void {
    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    if (new Date(this.apiData.data.ProductionWeekStartDate).getTime() > prevMonday.getTime()) {
      var myDate = new Date(this.apiData.data.ProductionWeekStartDate);
      var previousDay = new Date(myDate);
      previousDay.setDate(myDate.getDate() - 2);
      var previousDateString = this.getDateStringFormat(previousDay);
      this.loading = true;
      if (this.simulateFlag) {
        // this.loadDataofSimulationFromAPI(nextDateString);
        if (this.viewFlag === 'decor') {
          this.loadDataofSimulationFromAPI(previousDateString, 2);
          this.getUnscheduledTasksDetailsFromAPI(previousDateString, 2);
        } else if (this.viewFlag === 'vap') {
          this.loadDataofSimulationFromAPI(previousDateString, 4);
          this.getUnscheduledTasksDetailsFromAPI(previousDateString, 4);
        } else if (this.viewFlag === 'primary') {
          this.loadDataofSimulationFromAPI(previousDateString, 1);
          this.getUnscheduledTasksDetailsFromAPI(previousDateString, 1);
        } else if (this.viewFlag === 'miscellaneous') {
          this.loadDataofSimulationFromAPI(previousDateString, 5);
          this.getUnscheduledTasksDetailsFromAPI(previousDateString, 5);
        }
      } else {
        if (this.viewFlag === 'decor') {
          this.loadDataofDecorProductionFromAPI(previousDateString);
        } else if (this.viewFlag === 'vap') {
          this.loadDataofVAPProductionFromAPI(previousDateString);
        } else if (this.viewFlag === 'primary') {
          this.loadDataofPrimaryProductionFromAPI(previousDateString);
        } else if (this.viewFlag === 'miscellaneous') {
          this.loadDataofMiscellaneousProductionFromAPI(previousDateString);
        }
      }
    } else {
      this.toastr.clearAllToasts();
      //this.toastr.error('Previous week data not available.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
  }

  onFutureWeekdate(): void {
    var myDate = new Date(this.apiData.data.ProductionWeekEndDate);
    var nextDay = new Date(myDate);
    nextDay.setDate(myDate.getDate() + 1);
    var nextDateString = this.getDateStringFormat(nextDay);
    this.loading = true;
    if (this.simulateFlag) {
      // this.loadDataofSimulationFromAPI(nextDateString);
      if (this.viewFlag === 'decor') {
        this.getUnscheduledTasksDetailsFromAPI(nextDateString, 2);
        this.loadDataofSimulationFromAPI(nextDateString, 2);
      } else if (this.viewFlag === 'vap') {
        this.getUnscheduledTasksDetailsFromAPI(nextDateString, 4);
        this.loadDataofSimulationFromAPI(nextDateString, 4);
      } else if (this.viewFlag === 'primary') {
        this.getUnscheduledTasksDetailsFromAPI(nextDateString, 1);
        this.loadDataofSimulationFromAPI(nextDateString, 1);
      } else if (this.viewFlag === 'miscellaneous') {
        this.getUnscheduledTasksDetailsFromAPI(nextDateString, 5);
        this.loadDataofSimulationFromAPI(nextDateString, 5);
      }
    } else {
      if (this.viewFlag === 'decor') {
        this.loadDataofDecorProductionFromAPI(nextDateString);
      } else if (this.viewFlag === 'vap') {
        this.loadDataofVAPProductionFromAPI(nextDateString);
      } else if (this.viewFlag === 'primary') {
        this.loadDataofPrimaryProductionFromAPI(nextDateString);
      } else if (this.viewFlag === 'miscellaneous') {
        this.loadDataofMiscellaneousProductionFromAPI(nextDateString);
      }
    }
  }

  displaydate(stDate, type): void {
    const current = stDate;     // get current date
    const weekstart = current.getDate() - current.getDay() + 1;
    const weekend = weekstart + 6;       // end day is the first day + 6
    const monday = new Date(current.setDate(weekstart));
    const sunday = new Date(current.setDate(weekend));
    const startDate = new Date(monday);
    this.weekStartday = ((startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + startDate.getFullYear())
    const endDate = new Date(sunday);
    this.weekEndday = ((endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + endDate.getFullYear());
  }

  loadNextWeekData(stDate, enDate): void {
    const current = enDate;     // get current date
    const weekstart = current.getDate() - current.getDay() + 1;
    const weekend = weekstart + 6;       // end day is the first day + 6
    const monday = new Date(current.setDate(weekstart));
    const sunday = new Date(current.setDate(weekend));
    const startDate = new Date(monday);
    this.weekStartday = ((startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + startDate.getFullYear())
    const endDate = new Date(sunday);
    this.weekEndday = ((endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + endDate.getFullYear())
  }
  onSimulateChange(): void {
    // console.log('onSimulateChange');
    this.loading = true;
    this.simulateFlag = true;
    this.constant.isSimulated = true;
    const currentDateString = this.getDateStringFormat(new Date());
    //this.getUnscheduledTasksDetailsFromAPI();
    // this.loadDataofSimulationFromAPI(nextDateString);
    if (localStorage.getItem("weekStartday") !== null) {
      this.weekStartday = localStorage.getItem("weekStartday");
    }
    if (this.viewFlag === 'decor') {
      this.getFormingLinesFromAPI(2);
      this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 2);
      this.loadDataofSimulationFromAPI(this.weekStartday, 2);
    } else if (this.viewFlag === 'vap') {
      this.getFormingLinesFromAPI(4);
      this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 4);
      this.loadDataofSimulationFromAPI(this.weekStartday, 4);
    } else if (this.viewFlag === 'primary') {
      this.getFormingLinesFromAPI(1);
      this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 1);
      this.loadDataofSimulationFromAPI(this.weekStartday, 1);
    } else if (this.viewFlag === 'miscellaneous') {
      this.getFormingLinesFromAPI(5);
      this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 5);
      this.loadDataofSimulationFromAPI(this.weekStartday, 5);
    }
    this.getReasonForChangeFromAPI();
    localStorage.removeItem('weekStartday');
  }

  onFreezeSchedule(): void {
    if (this.freezeScheduleLbl === 'Freeze Schedule') {
      this.freezeScheduleLbl = 'Unfreeze Schedule'
    } else {
      this.freezeScheduleLbl = 'Freeze Schedule'
    }
  }

  getUnscheduledTasksDetailsFromAPI(dateString, type): void {
    // this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getUnscheduledTasksDetails(reqBody, type, response => {
      // this.loading = false;
      if (response.responseCode === 200) {
        // console.log(response);
        this.unscheduledTasksItems = response.data;
      } else {
        // console.log(response);
      }
    }, error => {
      // this.loading = false;
    });
  }

  getRescheduledTasksDetailsFromAPI(dateString, selectedUnscheduledTask): void {
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getRescheduledTasksDetails(reqBody, selectedUnscheduledTask, response => {
      // this.loading = false;
      if (response.responseCode === 200) {
        // console.log(response);
        this.loading = false;
        this.rescheduledTaskItems = response.data;
        this.timeInMinutes = response.data.TotalMinutes;
      } else {
        // console.log(response);
      }
    }, error => {
      // this.loading = false;
    });
  }

  getReasonForChangeFromAPI(): void {
    // this.loading = true;
    this.productionService.getReasonForChangeFromAPIDetails('', response => {
      // this.loading = false;
      if (response.responseCode === 200) {
        // console.log(response);
        this.reasonforChangeList = response.data;
      } else {
        // console.log(response);
      }
    }, error => {
      // this.loading = false;
    });
  }

  getFormingLinesFromAPI(type): void {
    // this.loading = true;
    this.productionService.getFormingLinesDetails('', type, response => {
      // this.loading = false;
      if (response.responseCode === 200) {
        // console.log(response);
        this.formingLineList = response.data;
      } else {
        // console.log(response);
      }
    }, error => {
      // this.loading = false;
    });
  }

  onChangeSummary(simu): void {
    this.showEditTaskPopUp = false;
    this.taskNumber = '';
    if (this.viewFlag === 'decor') {
      this.getChangeSummary(2, simu);
    } else if (this.viewFlag === 'vap') {
      this.getChangeSummary(4, simu);
    } else if (this.viewFlag === 'primary') {
      this.getChangeSummary(1, simu);
    } else if (this.viewFlag === 'miscellaneous') {
      this.getChangeSummary(5, simu);
    }
  }

  getChangeSummary(type, simu): void {
    this.loading = true;
    this.productionService.getChangeSummary(this.weekStartday, type, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        this.changeConsolidated = response.data;
        this.isChangeSummary = true;
      } else {
        this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
      this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }

  closeChangeSummary(): void {
    this.isChangeSummary = false;
    this.constant.editFromChangeSummary = false;
  }

  // viewChangeSummaryDetails(taskId): void {
  //   if (this.viewFlag === 'decor') {
  //     this.getDetailedChangeSummary(2, taskId);
  //   } else if (this.viewFlag === 'vap') {
  //     this.getDetailedChangeSummary(4, taskId);
  //   } else if (this.viewFlag === 'primary') {
  //     this.getDetailedChangeSummary(1, taskId);
  //   } else if (this.viewFlag === 'miscellaneous') {
  //     this.getDetailedChangeSummary(5, taskId);
  //   }
  // }
  cancelEditTaskPopup() {
    this.showEditTaskPopUp = false;
    this.taskNumber = '';
  }
  getEditTaskPopper() {
    this.showEditTaskPopUp = true;
  }
  viewEditTask(taskId): void {
    localStorage.setItem('weekStartday', this.weekStartday);
    this.constant.editFromChangeSummary = true;
    if (this.simulateFlag) {
      // this.constant.fromSimulateChange = true;
      // this.constant.weekStartday = this.weekStartday;
    }
    // if (this.isEdit) {
    //this.constant.fromSimulateChange = true;
    //this.constant.weekStartday = this.weekStartday;
    this.isEdit = true;
    localStorage.setItem('editOrCreate', 'true');
    const link = [this.router.url + '/editTask/' + taskId];
    this.router.navigate(link);
    // } else {
    //   this.toastr.error('Editing or unscheduling  of tasks on this line is not allowed.', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    // }
  }
  viewChangeSummaryDetails(taskId): void {
    this.loading = true;
    this.productionService.getChangeSummaryDetail(taskId, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        this.changeSummaryDetails = response.data;
        this.prodTaskDetails = this.changeSummaryDetails.ProdTask[0];
        this.prodTaskDetails.newValues[0].BeginDate = this.sharedService.getDateAMPMFormat(this.prodTaskDetails.newValues[0].BeginDate);
        this.prodTaskDetails.oldValues[0].BeginDate = this.sharedService.getDateAMPMFormat(this.prodTaskDetails.oldValues[0].BeginDate);
        this.prodTaskDetails.newValues[0].EndDate = this.sharedService.getDateAMPMFormat(this.prodTaskDetails.newValues[0].EndDate);
        this.prodTaskDetails.oldValues[0].EndDate = this.sharedService.getDateAMPMFormat(this.prodTaskDetails.oldValues[0].EndDate);
        if (this.changeSummaryDetails.PackTask.length === 0) {
          this.noPackTask = true;
        } else {
          if (this.changeSummaryDetails.PackTask[0].newValues.length === 0) {
            this.noPackTask = true;
          } else {
            this.noPackTask = false;
            this.packTaskDetails = this.changeSummaryDetails.PackTask[0];
            for (var i = 0; i < this.packTaskDetails.oldValues.length; i++) {
              this.packTaskDetails.oldValues[i].BeginDate = this.sharedService.getDateAMPMFormat(this.packTaskDetails.oldValues[i].BeginDate);
              this.packTaskDetails.oldValues[i].EndDate = this.sharedService.getDateAMPMFormat(this.packTaskDetails.oldValues[i].EndDate);
            }
            for (var j = 0; j < this.packTaskDetails.newValues.length; j++) {
              this.packTaskDetails.newValues[j].BeginDate = this.sharedService.getDateAMPMFormat(this.packTaskDetails.newValues[j].BeginDate);
              this.packTaskDetails.newValues[j].EndDate = this.sharedService.getDateAMPMFormat(this.packTaskDetails.newValues[j].EndDate);
            }
          }
        }
        this.detailedChangeSummary = true;
      } else {
        this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
      this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }

  closeChangeDetails(): void {
    this.detailedChangeSummary = false;
  }

  onRefrersh(): void {
    // console.log('onRefrersh');
    this.loading = true;

    this.productionService.getProdTaskRefresh(response => {
      this.formLines = [];
      this.loading = false;
      // console.log(response);
      if (response.responseCode === 200) {

        var currentDateString = this.getDateStringFormat(new Date());
        if (this.viewFlag === 'primary') {
          this.loading = true;
          this.loadDataofPrimaryProductionFromAPI(this.weekStartday);
        } else if (this.viewFlag === 'decor') {
          this.loading = true;
          this.loadDataofDecorProductionFromAPI(this.weekStartday);
        } else if (this.viewFlag === 'vap') {
          this.loading = true;
          this.loadDataofVAPProductionFromAPI(this.weekStartday);
        } else if (this.viewFlag === 'miscellaneous') {
          this.loading = true;
          this.loadDataofMiscellaneousProductionFromAPI(this.weekStartday);
        }

      } else {
      }
    }, error => {
      this.loading = false;
    });
  }

  onConfigureFurnaceCapacity(): void {
    localStorage.setItem('weekStartMonday', this.weekStartday);
    const link = [this.router.url + '/configurefurnacecapacity'];
    this.router.navigate(link);

  }

  onExport(): void {
    this.loading = true;
    this.productionService.loadExportDetails(response => {
      if (response.responseCode === 200) {
        this.ExportpopupDetails = response.data.SchGroups;
        for (var i = 0; i < this.ExportpopupDetails.length; i++) {
          if (this.ExportpopupDetails[i].Name == 'Primary') {
            if (this.viewFlag == 'primary') {
              this.export.Primary = true;
            } else {
              this.export.Primary = false;
            }
          }
          if (this.ExportpopupDetails[i].Name == 'Décor') {
            if (this.viewFlag == 'decor') {
              this.export.Décor = true;
            } else {
              this.export.Décor = false;
            }
          }
          if (this.ExportpopupDetails[i].Name == 'VAP') {
            if (this.viewFlag == 'vap') {
              this.export.VAP = true;
            } else {
              this.export.VAP = false;
            }
          }
          if (this.ExportpopupDetails[i].Name == 'Miscellaneous') {
            if (this.viewFlag == 'miscellaneous') {
              this.export.Miscellaneous = true;
            } else {
              this.export.Miscellaneous = false;
            }
          }
        }
        this.createExport = true;
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, error => {
      this.loading = false;
    });
  }
  cancelExport(): void {
    this.createExport = false;
    this.export = {
      Primary: false,
      Décor: false,
      VAP: false,
      Miscellaneous: false
    }
    this.weekcountExport = 1;
    this.exportDate = new Date();
  }
  continueExport(): void {
    if ((this.export.Primary == true || this.export.Décor == true || this.export.VAP == true || this.export.Miscellaneous == true)) {
      var weekCount = Number(this.weekcountExport);
      if (Number.isInteger(weekCount)) {
        if (weekCount <= 5 && weekCount > 0) {
          this.selectedArray = [
            {
              "Name": (this.export.Primary == true) ? "Primary" : ''
            },
            {
              "Name": (this.export.Décor == true) ? "Décor" : ''
            },
            {
              "Name": (this.export.VAP == true) ? "VAP" : ''
            },
            {
              "Name": (this.export.Miscellaneous == true) ? "Miscellaneous" : ''
            }
          ];
          for (var i = 0; i < this.selectedArray.length; i++) {
            if (this.selectedArray[i].Name !== '') {
              this.selectedArrays.push(this.selectedArray[i]);
            }
          }
          var PrintModelData = {
            "SchGroups": this.selectedArrays,
            "BeginingWeekStartDate": this.exportDate,
            "NoOfWeeks": this.weekcountExport
          }
          let printModeldata: any = PrintModelData;
          localStorage.setItem("printModelData", btoa(JSON.stringify(printModeldata)));
          const link = [this.router.url + '/exportpage'];
          this.router.navigate(link);
        } else {
          this.toastr.error('Number of weeks should be an integer less than 6', '', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        }
      } else {
        this.toastr.error('Number of weeks should be an integer less than 6', '', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    } else {
      this.toastr.error('Please Select Lines', '', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
  }

  getDateStringFormat(dateVar): any {
    /** Timezone fix */
    if (typeof dateVar == 'string') {
      var newDate = new Date(dateVar.replace(/-/g, '\/').replace(/T.+/, ''));
    } else {
      var newDate = new Date(dateVar);
    }
    /** */
    var newYear = newDate.getFullYear(),
      newMonth = newDate.getMonth() + 1,
      newDay = newDate.getDate();
    var newDateString = newMonth + '/' + newDay + '/' + newYear;
    return newDateString;
  }

  parseChartData(data) {
    let startDate: any, endDate: any;
    if (typeof data.ProductionWeekStartDate == 'string') {
      startDate = new Date(data.ProductionWeekStartDate.replace(/-/g, '\/').replace(/T.+/, ''));
    } else {
      startDate = new Date(data.ProductionWeekStartDate);
    }
    if (typeof data.ProductionWeekEndDate == 'string') {
      endDate = new Date(data.ProductionWeekEndDate.replace(/-/g, '\/').replace(/T.+/, ''));
    } else {
      endDate = new Date(data.ProductionWeekEndDate);
    }
    startDate.setHours(0, 0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 0, 0);
    let dateDiff: number = endDate - startDate;//to get diffr b/w chart plotting date
    let chartData = data.FormingLines;
    for (let i = 0; i < chartData.length; i++) {
      for (let j = 0; j < chartData[i].Days.length; ++j) {
        for (let k = 0; k < chartData[i].Days[j].Tasks.length; ++k) {
          // if (!chartData[i].Days[j].Tasks[k].IsContinueation) {// avoid continuation data
          /** Time Zone Fix */
          let taskStart: any, taskEndDate: any;
          if (typeof chartData[i].Days[j].Tasks[k].BeginDate == 'string') {
            taskStart = this.dateTimeFormatForTimeZone(chartData[i].Days[j].Tasks[k].BeginDate);
          } else {
            taskStart = new Date(chartData[i].Days[j].Tasks[k].BeginDate);
          }
          if (typeof chartData[i].Days[j].Tasks[k].EndDate == 'string') {
            taskEndDate = this.dateTimeFormatForTimeZone(chartData[i].Days[j].Tasks[k].EndDate);
          } else {
            taskEndDate = new Date(chartData[i].Days[j].Tasks[k].EndDate);
          }
          /** */
          if (taskStart <= endDate && taskEndDate >= startDate) {//to check the date range inside the plotting date range
            let obj: any
            if (taskStart - startDate >= 0) {
              obj = {
                left: (taskStart - startDate) * 100 / dateDiff + '%',
              };
            } else {
              obj = {
                left: 0,
              };
            }
            if (endDate - taskEndDate >= 0) {
              obj.right = (100 - (dateDiff - (endDate - taskEndDate)) * 100 / dateDiff) + '%';
            } else {
              obj.right = 0;
            }

            if (chartData[i].Days[j].Tasks[k].CurrentTaskStatus !== undefined) {
              obj.background = chartData[i].Days[j].Tasks[k].CurrentTaskStatus.TaskStatusColor;
              obj.color = chartData[i].Days[j].Tasks[k].CurrentTaskStatus.TaskStatusTextColor;
              chartData[i].Days[j].Tasks[k].style = obj;
              let objbreif: any;
              objbreif = {
                background: chartData[i].Days[j].Tasks[k].CurrentTaskStatus.TaskStatusBriefColor,
              };
              chartData[i].Days[j].Tasks[k].stylebreif = objbreif;

              /* If brief section is not there then padding */
              if (!chartData[i].IsFurnaceTagged) {
                chartData[i].Days[j].Tasks[k].className = 'p-l-10';
              }
            }
          }
        }
      }
    }
  };

  dateTimeFormatForTimeZone(value) {
    var date = new Date();
    var newDate = value.split('T')[0].split('-');
    date.setFullYear(parseInt(newDate[0]));
    date.setDate(parseInt(newDate[2]));
    date.setMonth(parseInt(newDate[1]) - 1);
    date.setDate(parseInt(newDate[2]));

    try {
      date.setHours(value.split('T')[1].split(':')[0]);
      date.setMinutes(value.split('T')[1].split(':')[1]);
      date.setSeconds(value.split('T')[1].split(':')[2].split('.')[0]);
    } catch (e) {
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
    }
    return date;
  }

  addNewTask() {
    this.createTaskVisible = true;
    this.showEditTaskPopUp = false;
    this.taskNumber = '';
    localStorage.removeItem("taskDate");
    localStorage.removeItem("taskLine");
    localStorage.removeItem('lineId');
  }
  gotoCreateTaskWithGamme() {
    localStorage.setItem('weekStartday', this.weekStartday);
    this.constant.fromSimulateChange = true;
    localStorage.setItem('fromSimulateChange', 'true');
    this.constant.weekStartday = this.weekStartday;
    this.isEdit = false;
    localStorage.setItem('editOrCreate', 'false');
    const link = [this.router.url + '/create/task'];
    this.router.navigate(link);
  }
  gotoCreateTaskWithoutGamme() {
    localStorage.setItem('editOrCreate', 'false');
    this.createTaskVisible = false;
    this.createTaskWithoutGamme = true;
  }
  closeCreateTask() {
    this.createTaskVisible = false;
  }

  cancelNewTask() {
    this.createTaskWithoutGamme = false;
    this.addNewTaskObject.startDate = '';
    this.addNewTaskObject.startTime = '';
    this.addNewTaskObject.selectLine = '';
    this.addNewTaskObject.endDate = '';
    this.addNewTaskObject.endTime = ''
    this.addNewTaskObject.pullTonsPerDay = '';
    this.addNewTaskObject.speed = '100';
    this.addNewTaskObject.yieldFactor = '1';
    this.addNewTaskObject.quantity = '';
    this.addNewTaskObject.createPacktaskStatus = false;
    this.addNewTaskObject.createPacktaskManning = '';
    this.addNewTaskObject.createPacktaskStatusQuantity = '';
    this.addNewTaskObject.createPacktaskStatusItemNumber = '';
    this.dateStatus = false;
    this.addValidation = false;
    this.yieldFactorValidation = false;
    this.addNewTaskObject.startTimeHour = '00';
    this.addNewTaskObject.startTimeminute = '00';
    this.addNewTaskObject.startTimeminuteType = '0';
    this.addNewTaskObject.endTimeHour = '00';
    this.addNewTaskObject.endTimeminute = '00';
    this.addNewTaskObject.endTimeminuteType = '0';
    this.onCreateOk = false;
  };

  onOKCreateNewTask() {
    // console.log(this.addNewTaskObject);
    this.onCreateOk = true;
    this.dateStatus = false;
    this.addValidation = false;
    this.yieldFactorValidation = false;
    this.isEndDatevalid = false;
    this.addNewtaskdata = this.addNewTaskObject;

    if (this.addNewtaskdata.yieldFactor > 1 || this.addNewtaskdata.yieldFactor < 0) {
      this.yieldFactorValidation = true;
    }

    if (this.addNewtaskdata.selectLine == '' || parseInt(this.addNewtaskdata.selectLine) === 0 || this.addNewtaskdata.startDate == {} || this.addNewtaskdata.endDate == {} || this.addNewtaskdata.quantity == '' || this.addNewtaskdata.createPacktaskStatusItemNumber == '' || this.addNewtaskdata.pullTonsPerDay == '' ||

      this.addNewtaskdata.speed == '' || this.addNewtaskdata.yieldFactor == '') {
      this.addValidation = true;
    }

    if (this.addNewtaskdata.createPacktaskStatus == true && this.addNewtaskdata.createPacktaskManning == '') {
      this.addValidation = true;
    }

    if (this.addNewtaskdata.endDate !== {}) {
      if (new Date(this.addNewtaskdata.startDate).getTime() >= new Date(this.addNewtaskdata.endDate).getTime() || new Date(this.addNewtaskdata.startDate).getTime() === new Date(this.addNewtaskdata.endDate).getTime()) {
        this.isEndDatevalid = true;
      }
    }

    if (!this.addValidation && !this.yieldFactorValidation) {
      if (!this.isEndDatevalid) {
        this.productionService.addNewTaskAPI(this.addNewtaskdata, this.addNewTaskObject, response => {
          this.loading = false;
          if (response.responseCode === 200) {
            // console.log(response);
            const currentDateString = this.getDateStringFormat(new Date());
            if (this.viewFlag === 'decor') {
              this.loadDataofSimulationFromAPI(this.weekStartday, 2);
            } else if (this.viewFlag === 'vap') {
              this.loadDataofSimulationFromAPI(this.weekStartday, 4);
            } else if (this.viewFlag === 'primary') {
              this.loadDataofSimulationFromAPI(this.weekStartday, 1);
            } else if (this.viewFlag === 'miscellaneous') {
              this.loadDataofSimulationFromAPI(this.weekStartday, 5);
            }
            // this.addNewTaskObject.selectLine
            this.addNewTaskObject.startDate = '';
            this.addNewTaskObject.startTime = '';
            this.addNewTaskObject.selectLine = '';
            this.addNewTaskObject.endDate = '';
            this.addNewTaskObject.endTime = ''
            this.addNewTaskObject.pullTonsPerDay = '';
            this.addNewTaskObject.speed = '100';
            this.addNewTaskObject.yieldFactor = '1';
            this.addNewTaskObject.quantity = '';
            this.addNewTaskObject.createPacktaskManning = '';
            this.addNewTaskObject.createPacktaskStatus = false;
            this.addNewTaskObject.createPacktaskStatusQuantity = '';
            this.addNewTaskObject.createPacktaskStatusItemNumber = '';
            this.editTaskVisible = false;
            this.createTaskWithoutGamme = false;
            this.isEndDatevalid = false;
            this.dateStatus = false;
            this.addValidation = false;
            this.yieldFactorValidation = false;
            this.addNewTaskObject.startTimeHour = '00';
            this.addNewTaskObject.startTimeminute = '00';
            this.addNewTaskObject.startTimeminuteType = '0';
            this.addNewTaskObject.endTimeHour = '00';
            this.addNewTaskObject.endTimeminute = '00';
            this.addNewTaskObject.endTimeminuteType = '0';
            this.onCreateOk = false;
            this.toastr.success(response.responseMsg, 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
          } else {
            this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
          }
        }, error => {
          this.loading = false;
          this.toastr.error(this.constant.serverError, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        });
      } else {
        this.loading = false;
        this.dateStatus = true;
        this.addNewTaskObject.startDate = '';
        this.addNewTaskObject.startTime = '';
        this.addNewTaskObject.endDate = '';
        this.addNewTaskObject.endTime = '';
        this.addNewTaskObject.startTimeHour = '00';
        this.addNewTaskObject.startTimeminute = '00';
        this.addNewTaskObject.startTimeminuteType = '0';
        this.addNewTaskObject.endTimeHour = '00';
        this.addNewTaskObject.endTimeminute = '00';
        this.addNewTaskObject.endTimeminuteType = '0';
      }
    }
  };

  backFromSimulate() {
    this.simulateFlag = false;
    this.showEditTaskPopUp = false;
    this.constant.isSimulated = false;
    this.taskNumber = '';
    if (this.router.url === '/dashboard/productions/primary') {
      this.onLiBtnclick('Primary Production', 0);
    } else if (this.router.url === '/dashboard/productions/decor') {
      this.onLiBtnclick('Decor Production', 2);
    } else if (this.router.url === '/dashboard/productions/vap') {
      this.onLiBtnclick('VAP Production', 4);
    } else if (this.router.url === '/dashboard/productions/miscellaneous') {
      this.onLiBtnclick('Miscellaneous Production', 6);
    } else {
      this.onLiBtnclick('Primary Production', 0);
    }
  };

  emptySlotClick(daysValue, time, formingLine) {
    if(new Date(daysValue.Date).getDate() === (new Date().getDate() - 1)) {
      return;
    }
    localStorage.removeItem('taskDate');
    localStorage.removeItem('taskLine');
    localStorage.removeItem('lineId');
    this.showEditTaskPopUp = false;
    this.taskNumber = '';
    if (this.simulateFlag) {
      if (formingLine.SIMU === 'Y') {
        this.createTaskVisible = true;
        this.isEdit = false;
        localStorage.setItem('taskDate', btoa(daysValue.Date));
        localStorage.setItem('taskLine', btoa(formingLine.LineName));
        localStorage.setItem('lineId', btoa(formingLine.Id));
      } else {
        this.toastr.error('Adding new task, editing or unscheduling existing tasks on this line is not allowed.', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }

    this.addNewTaskObject = {
      selectLine: formingLine.Id,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      pullTonsPerDay: '',
      speed: '100',
      yieldFactor: '1',
      quantity: '',
      itemNumber: '',
      createPacktaskManning: '',
      createPacktaskStatus: false,
      createPacktaskStatusQuantity: '',
      createPacktaskStatusItemNumber: '',
      startTimeHour: '00',
      startTimeminute: '00',
      startTimeminuteType: '0',
      endTimeHour: '00',
      endTimeminute: '00',
      endTimeminuteType: '0'
    }
  }
  onTap(event): void {
    event.preventDefault();
    event.stopPropagation();
  }
  onEachScheduleTap(FormingLine, FormingLineObject, LineName, LineId, SIMU, DaysVal): void {
    this.showEditTaskPopUp = false;
    this.taskNumber = '';
    this.constant.onEachScheduleTap = FormingLineObject
    // console.log(FormingLineObject);
    this.dateStatusError = true;
    this.selectedTask = FormingLineObject;

    const startDate = FormingLineObject.BeginDate.replace('T', ' ');
    const startTimeObj1 = startDate.split(' ');
    const startTimeObj2 = startTimeObj1[1];
    const startTimeFormat = startTimeObj2.split(':');
    const startTime = startTimeFormat[0];
    var startTimeType = "AM";
    var startHour = startTime;
    if (startHour >= 13) {
      startHour = startTime - 12;
      startTimeType = "PM";
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else if (startHour == 0) {
      startHour = 12;
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else if (startHour == 12) {
      startTimeType = "PM";
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else {
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    const endDate = FormingLineObject.EndDate.replace('T', ' ');
    const endTimeObj1 = endDate.split(' ');
    const endTimeObj2 = endTimeObj1[1];
    const endTimeFormat = endTimeObj2.split(':');
    const endTime = endTimeFormat[0];
    var endTimeType = "AM";
    var endHour = endTime;
    if (endHour >= 13) {
      endHour = endTime - 12;
      endTimeType = "PM";
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }
    else if (endHour == 0) {
      endHour = 12;
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }
    else if (endHour == 12) {
      endTimeType = "PM";
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }
    else {
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }

    let startTimeTypeVal = '0';
    if (startTimeType === 'PM') {
      startTimeTypeVal = '1';
    } else {
      startTimeTypeVal = '0';
    }

    let endTimeTypeVal = '0';
    if (endTimeType === 'PM') {
      endTimeTypeVal = '1';
    } else {
      endTimeTypeVal = '0';
    }

    // diffMs: any;
    const sDate = startDate.replace('-', '/');
    const eDate = endDate.replace('-', '/');
    const startDateFormat: any = new Date(sDate);
    const endDateFormat: any = new Date(eDate);

    const hourDiff = endDateFormat - startDateFormat;
    const diffHrs = Math.round((hourDiff % 86400000) / 3600000);
    const hDiff = hourDiff / 3600 / 1000; // in hours
    this.taskHourVal = hDiff;
    const diffMins = Math.round(((hourDiff % 86400000) % 3600000) / 60000);
    const diff: any = Math.abs((endDateFormat) - (startDateFormat));
    const minutes: any = Math.floor((diff / 1000) / 60);
    this.taskHourMinVal = minutes;

    this.lineName = LineName;
    if (this.simulateFlag) {
      if (FormingLineObject.AllowEdit === true
        && FormingLineObject.CurrentTaskStatus.TaskStatusName !== 'Completed'
        && FormingLineObject.CurrentTaskStatus.TaskStatusName !== 'Suspended') {
        this.isEdit = true;
        this.editTaskVisible = true;
      } else {
        this.isEdit = false;
        var lineId = '';
        for (var i = 0; i < FormingLine.ParallelLinesList.length; i++) {
          if (FormingLine.ParallelLinesList[i].Master) {
            lineId = FormingLine.ParallelLinesList[i].LineID;
            break;
          }
        }
        if (FormingLineObject.CurrentTaskStatus.TaskStatusName === 'Completed') {
          this.toastr.error('Editing or unscheduling of completed tasks  is not allowed.', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        }
        else if (FormingLineObject.CurrentTaskStatus.TaskStatusName === 'Suspended') {
          this.toastr.error('Editing or unscheduling of suspended tasks  is not allowed.', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        }
        else if (lineId !== '') {
          this.toastr.error('This is a parallel/sequential task, please edit it from ' + lineId + ' line.', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        }
        else {
          this.toastr.error('Adding new task, editing or unscheduling existing tasks on this line is not allowed.', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });

        }
      }
      //this.editTaskVisible = true;
      const modifyTaskDuration = FormingLineObject;
      const currentStartDateSplit = this.getDateStringFormat(modifyTaskDuration.BeginDate).split('/');
      const currentEndDateSplit = this.getDateStringFormat(modifyTaskDuration.EndDate).split('/');
      this.modifyTaskDurationObject = {
        modiTaskName: modifyTaskDuration.Description,
        modiItemName: FormingLineObject.CurrentTaskStatus.TaskStatusName,
        currentStartDate: this.getDateStringFormat(modifyTaskDuration.BeginDate),
        currentEndDate: this.getDateStringFormat(modifyTaskDuration.EndDate),
        currentQuantity: modifyTaskDuration.QuantItems,
        newStartDate: new Date(modifyTaskDuration.BeginDate),
        startTime: startHour,
        newEndDate: new Date(modifyTaskDuration.EndDate),
        endTime: endHour,
        newQuantity: modifyTaskDuration.QuantItems,
        reasonforChange: '0',
        taskNumber: modifyTaskDuration.TaskNumber,
        itemNumber: modifyTaskDuration.ItemNumber,
        PONumber: modifyTaskDuration.ProductionOrder,
        startTimeHour: startHour,
        startTimeminute: startTimeFormat[1],
        startTimeminuteType: startTimeTypeVal,
        endTimeHour: endHour,
        endTimeminute: endTimeFormat[1],
        endTimeminuteType: endTimeTypeVal,
        keepDurationConstantStatus: true
      }

      if (modifyTaskDuration.CurrentTaskStatus.TaskStatusCode !== 2) {
        this.editTaskVisibleLiItem = true;
        this.newStartDateDisableStatus = false;
        this.modifyTaskDurationObject.keepDurationConstantStatus = true;
      } else {
        this.editTaskVisibleLiItem = false;
        this.newStartDateDisableStatus = true;
        this.modifyTaskDurationObject.keepDurationConstantStatus = false;
      }

      this.changeOperatingModeObject = {
        comTaskName: this.selectedTask.Description,
        currentFormingLine: LineId,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        alternateGammeOptions: [],
        availableStartDate: '11 Sep - 17 Sep',
        availableEndDate: '18 Sep -24 Sep',
        startTimeHour: '00',
        startTimeminute: '00',
        startTimeminuteType: '0',
        endTimeHour: '00',
        endTimeminute: '00',
        endTimeminuteType: '0'
      }

      this.addViewCommentsObject = {
        comments: []
      }

      this.unscheduleTaskObject = {
        unTaskName: modifyTaskDuration.Description,
      }
    }
  }

  onEnter(event) {
    if (event.keyCode == 13) {
      this.getTaskID();
    }
  }

  getTaskID(): void {
    if (this.taskNumber === undefined ||this.taskNumber ==='' ) {
      this.toastr.error('Please enter Task Number', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      return;
    }
    this.productionService.goToEditTaskURL(this.taskNumber, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        this.taskNumber = '';
        if (response.data === 0) {
          this.toastr.error('Please enter valid Task Number', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
          return;
        }
        this.isEdit = true;
        localStorage.setItem('editOrCreate', 'true');
        localStorage.setItem('weekStartday', this.weekStartday);
        this.constant.fromSimulateChange = true;
        localStorage.setItem('fromSimulateChange','true');
        this.constant.weekStartday = this.weekStartday;
        let taskID = response.data;
        const link = [this.router.url + '/editTask/' + taskID];
        this.router.navigate(link);

      } else {
        this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
    });
  }
  gotoEditTask(): void {
    this.loading = true;
    localStorage.setItem('weekStartday', this.weekStartday);
    if (this.isEdit) {
      localStorage.setItem('editOrCreate', 'true');
      this.constant.fromSimulateChange = true;
      localStorage.setItem('fromSimulateChange','true');
      this.constant.weekStartday = this.weekStartday;
      const link = [this.router.url + '/editTask/' + this.constant.onEachScheduleTap.TaskId];
      this.router.navigate(link);
    } else {
      this.toastr.error('Editing or unscheduling  of tasks on this line is not allowed.', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
  }

  OnRescheduleTask(unscheduledTasks): void {
    // console.log('reScheduleTask');
    this.rescheduleTask = true;
    this.minDate = new Date();
    this.selectedUnscheduledTask = unscheduledTasks;
    const startDate = unscheduledTasks.BeginDate.replace('T', ' ');
    const startTimeObj1 = startDate.split(' ');
    const startTimeObj2 = startTimeObj1[1];
    const startTimeFormat = startTimeObj2.split(':');
    const startTime = startTimeFormat[0];
    var startTimeType = "AM";
    var startHour = startTime;
    if (startHour >= 13) {
      startHour = startTime - 12;
      startTimeType = "PM";
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else if (startHour == 0) {
      startHour = 12;
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else if (startHour == 12) {
      startTimeType = "PM";
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else {
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }

    const endDate = unscheduledTasks.EndDate.replace('T', ' ');
    const endTimeObj1 = endDate.split(' ');
    const endTimeObj2 = endTimeObj1[1];
    const endTimeFormat = endTimeObj2.split(':');
    const endTime = endTimeFormat[0];
    var endTimeType = "AM";
    var endHour = endTime;
    if (endHour >= 13) {
      endHour = endTime - 12;
      endTimeType = "PM";
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }
    else if (endHour == 0) {
      endHour = 12;
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }
    else if (endHour == 12) {
      endTimeType = "PM";
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }
    else {
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }

    let startTimeTypeVal = '0';
    if (startTimeType === 'PM') {
      startTimeTypeVal = '1';
    } else {
      startTimeTypeVal = '0';
    }

    let endTimeTypeVal = '0';
    if (endTimeType === 'PM') {
      endTimeTypeVal = '1';
    } else {
      endTimeTypeVal = '0';
    }
    const currentStartDateSplit = this.getDateStringFormat(unscheduledTasks.BeginDate).split('/');
    const currentEndDateSplit = this.getDateStringFormat(unscheduledTasks.EndDate).split('/');
    this.getRescheduledTasksDetailsFromAPI(this.weekStartday, this.selectedUnscheduledTask);

    this.rescheduleTaskObject = {
      startDate: '',
      endDate: '',
      currentFormingLine: unscheduledTasks.MachineDescription,
      startTimeHour: startHour,
      startTimeminute: startTimeFormat[1],
      startTimeminuteType: startTimeTypeVal,
      endTimeHour: endHour,
      endTimeminute: endTimeFormat[1],
      endTimeminuteType: endTimeTypeVal
    }
  }

  OnRescheduleCancel(unscheduledTasks): void {
    this.rescheduleTask = false;
    this.rescheduleTaskOk = false;
    this.rescheduleTaskObject.startDate = '',
      this.rescheduleTaskObject.endDate = '',
      this.rescheduleTaskObject.currentFormingLine = '',
      this.rescheduleTaskObject.startTimeHour = '00',
      this.rescheduleTaskObject.startTimeminute = '00',
      this.rescheduleTaskObject.startTimeminuteType = '0',
      this.rescheduleTaskObject.endTimeHour = '00',
      this.rescheduleTaskObject.endTimeminute = '00',
      this.rescheduleTaskObject.endTimeminuteType = '0'
    this.rescheduleEndDate = '';
  }
  OnRescheduleOk(): void {
    this.rescheduleTaskOk = true;
    if (this.rescheduleTaskObject.startDate !== "") {
      this.RescheduleTask(this.rescheduleTaskObject);
    }
  }

  RescheduleTask(rescheduleTaskObject): void {
    this.loading = true;
    this.rescheduleTaskdata = this.rescheduleTaskObject;
    this.rescheduleTaskdata.endDate = this.rescheduleEndDate;
    this.productionService.getupdateReScheduleTask(this.rescheduledTaskItems, this.rescheduleTaskdata, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        // console.log(response);
        var currentDateString = this.getDateStringFormat(new Date());
        if (this.viewFlag === 'primary') {
          this.loading = true;
          this.loadDataofSimulationFromAPI(this.weekStartday, 1);
          this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 1);
        } else if (this.viewFlag === 'decor') {
          this.loading = true;
          this.loadDataofSimulationFromAPI(this.weekStartday, 2);
          this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 2);
        } else if (this.viewFlag === 'vap') {
          this.loading = true;
          this.loadDataofSimulationFromAPI(this.weekStartday, 4);
          this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 4);
        } else if (this.viewFlag === 'miscellaneous') {
          this.loading = true;
          this.loadDataofSimulationFromAPI(this.weekStartday, 5);
          this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 5);
        }
        this.rescheduleTask = false;
        this.rescheduleTaskOk = false;
        this.rescheduleTaskObject.startDate = '';
        this.rescheduleTaskObject.endDate = '';
        this.rescheduleTaskObject.currentFormingLine = '';
        this.rescheduleTaskObject.startTimeHour = '00';
        this.rescheduleTaskObject.startTimeminute = '00';
        this.rescheduleTaskObject.startTimeminuteType = '0';
        this.rescheduleTaskObject.endTimeHour = '00';
        this.rescheduleTaskObject.endTimeminute = '00';
        this.rescheduleTaskObject.endTimeminuteType = '0';
        this.rescheduleEndDate = '';
        this.toastr.success(response.responseMsg, 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      } else {
        this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
      this.toastr.error(this.constant.serverError, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }

  editTaskClose(): void {
    // console.log('editTaskClose');
    this.editTaskVisible = false;
  }

  modifyTaskDuration(): void {
    // console.log('modifyTaskDuration');
    this.modifyTaskDurationStatus = true;
    this.getReasonForChangeFromAPI();
  }

  modifyTaskDurationCancel(): void {
    this.onModifyTaskDurationOk = false;
    this.dateStatus = false;
    this.modifyValidation = false;
    this.modifyTaskDurationStatus = false;
    const startDate = this.selectedTask.BeginDate.replace('T', ' ');
    const startTimeObj1 = startDate.split(' ');
    const startTimeObj2 = startTimeObj1[1];
    const startTimeFormat = startTimeObj2.split(':');
    const startTime = startTimeFormat[0];
    var startTimeType = "AM";
    var startHour = startTime;
    if (startHour >= 13) {
      startHour = startTime - 12;
      startTimeType = "PM";
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else if (startHour == 0) {
      startHour = 12;
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else if (startHour == 12) {
      startTimeType = "PM";
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else {
      this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }

    const endDate = this.selectedTask.EndDate.replace('T', ' ');
    const endTimeObj1 = endDate.split(' ');
    const endTimeObj2 = endTimeObj1[1];
    const endTimeFormat = endTimeObj2.split(':');
    const endTime = endTimeFormat[0];
    var endTimeType = "AM";
    var endHour = endTime;
    if (endHour >= 13) {
      endHour = endTime - 12;
      endTimeType = "PM";
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }
    else if (endHour == 0) {
      endHour = 12;
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }
    else if (endHour == 12) {
      endTimeType = "PM";
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }
    else {
      this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
    }

    let startTimeTypeVal = '0';
    if (startTimeType === 'PM') {
      startTimeTypeVal = '1';
    } else {
      startTimeTypeVal = '0';
    }

    let endTimeTypeVal = '0';
    if (endTimeType === 'PM') {
      endTimeTypeVal = '1';
    } else {
      endTimeTypeVal = '0';
    }

    // diffMs: any;
    const startDateFormat: any = new Date(startDate);
    const endDateFormat: any = new Date(endDate);
    const hourDiff = endDateFormat - startDateFormat;
    const diffHrs = Math.round((hourDiff % 86400000) / 3600000);
    const hDiff = hourDiff / 3600 / 1000; // in hours
    this.taskHourVal = hDiff;
    const diffMins = Math.round(((hourDiff % 86400000) % 3600000) / 60000);
    if (this.simulateFlag) {
      this.editTaskVisible = true;
      const modifyTaskDuration = this.selectedTask;
      const currentStartDateSplit = this.getDateStringFormat(modifyTaskDuration.BeginDate).split('/');
      const currentEndDateSplit = this.getDateStringFormat(modifyTaskDuration.EndDate).split('/');
      this.modifyTaskDurationObject = {
        modiTaskName: modifyTaskDuration.Description,
        modiItemName: this.selectedTask.CurrentTaskStatus.TaskStatusName,
        currentStartDate: this.getDateStringFormat(modifyTaskDuration.BeginDate),
        currentEndDate: this.getDateStringFormat(modifyTaskDuration.EndDate),
        currentQuantity: modifyTaskDuration.QuantItems,
        newStartDate: new Date(modifyTaskDuration.BeginDate),
        startTime: startHour,
        newEndDate: new Date(modifyTaskDuration.EndDate),
        endTime: endHour,
        newQuantity: modifyTaskDuration.QuantItems,
        reasonforChange: '0',
        taskNumber: modifyTaskDuration.TaskNumber,
        itemNumber: modifyTaskDuration.ItemNumber,
        PONumber: modifyTaskDuration.ProductionOrder,
        startTimeHour: startHour,
        startTimeminute: startTimeFormat[1],
        startTimeminuteType: startTimeTypeVal,
        endTimeHour: endHour,
        endTimeminute: endTimeFormat[1],
        endTimeminuteType: endTimeTypeVal,
        keepDurationConstantStatus: true
      }

      if (modifyTaskDuration.CurrentTaskStatus.TaskStatusCode !== 2) {
        this.editTaskVisibleLiItem = true;
        this.newStartDateDisableStatus = false;
        this.modifyTaskDurationObject.keepDurationConstantStatus = true;
      } else {
        this.editTaskVisibleLiItem = false;
        this.newStartDateDisableStatus = true;
        this.modifyTaskDurationObject.keepDurationConstantStatus = false;
      }
    }
  }

  modifyTaskDurationOk(): void {
    this.onModifyTaskDurationOk = true;
    if (this.modifyTaskDurationObject.keepDurationConstantStatus) {
      // if (this.modifyTaskDurationObject.newStartDate !== {} && this.modifyTaskDurationObject.newQuantity !== '' &&
      //   this.modifyTaskDurationObject.startTimeHour !== '00') {
      //   this.updateModifyScheduleTask(this.modifyTaskDurationObject);
      // } else {
      //   this.modifyValidation = true;
      // }
    } else {
      // if (this.modifyTaskDurationObject.newEndDate !== {} && this.modifyTaskDurationObject.newStartDate !== {} && this.modifyTaskDurationObject.newQuantity !== '' &&
      //   this.modifyTaskDurationObject.startTimeHour !== '00' && this.modifyTaskDurationObject.endTimeHour !== '00') {
      //   this.updateModifyScheduleTask(this.modifyTaskDurationObject);
      // } else {
      //   this.modifyValidation = true;
      // }
    }
  }

  changeOperatingMode(): void {
    // console.log('changeOperatingMode');
    this.loadGetGammeOption();
    this.changeOperatingModeStatus = true;
  }

  changeOperatingGammeOptions(): void {
    this.gammeSelected = true;
  }

  loadGetGammeOption(): void {
    this.productionService.loadGetGammeOptionData(this.selectedTask, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        // console.log(response);
        this.changeOperatingModeObject.alternateGammeOptions = response.data;
      } else {
        // console.log(response);
      }
    }, error => {
      this.loading = false;
    });
  }
  changeOperatingModeCancel(): void {
    this.gammeSelected = false;
    this.changeOperatingModeStatus = false;
    this.isChangeEndDatevalid = false;
    this.changeOperatingModeObject.startDate = '';
    this.changeOperatingModeObject.endDate = '';
    this.changeOperatingModeObject.startTimeHour = '00',
      this.changeOperatingModeObject.startTimeminute = '00',
      this.changeOperatingModeObject.startTimeminuteType = '0',
      this.changeOperatingModeObject.endTimeHour = '00',
      this.changeOperatingModeObject.endTimeminute = '00',
      this.changeOperatingModeObject.endTimeminuteType = '0'
    this.onchangeOk = false;
    this.changeValidation = true;
    this.changeDateStatus = false;
  }

  changeOperatingModeOk(): void {
    this.onchangeOk = true;
    this.isChangeEndDatevalid = false;
    this.changeValidation = true;
    this.changeDateStatus = false;
    // console.log(this.changeOperatingModeObject);
    if (this.changeOperatingModeObject.startDate !== "" && this.changeOperatingModeObject.endDate !== "") {
      this.updateChangeOperatingMode(this.changeOperatingModeObject);
    } else {
      this.changeValidation = false;
    }
  }

  addViewComments(): void {
    // console.log('addViewComments');
    this.addViewCommentsStatus = true;
  }

  addViewCommentsCancel(): void {
    this.addViewCommentsStatus = false;
  }

  addViewCommentsOk(): void {
    this.addViewCommentsStatus = false;
  }

  unscheduleTask(): void {
    if (this.isEdit) {
      // console.log('unscheduleTask');
      this.unscheduleTaskStatus = true;
    } else {
      this.toastr.error('Editing or unscheduling of tasks on this line is not allowed.', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
  }

  unscheduleTaskCancel(): void {
    this.unscheduleTaskStatus = false;
  }

  unscheduleTaskDelete(): void {

    this.unscheduleTaskStatus = false;
    // console.log(this.selectedTask);
    this.deleteScheduleTask();

  }
  RescheduleStartTimeChange(): void {
    this.getRescheduleEndTimeChange(parseInt(this.rescheduleTaskObject.startTimeHour), parseInt(this.rescheduleTaskObject.startTimeminute), this.rescheduleTaskObject.startTimeminuteType)
  }

  getRescheduleEndTimeChange(RescheduleStartTimeHour, RescheduleStartTimeMinute, RescheduleStartTimeMinuteType): void {

    const DurationinMins = this.timeInMinutes;
    const newHour = Math.floor(DurationinMins / 60);
    let hours: any = newHour;
    const Minute = Math.floor(DurationinMins % 60);
    let minutes: any = Minute;
    let ampm = '0';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let newEndHours = RescheduleStartTimeHour + hours;
    let newEndminutes = RescheduleStartTimeMinute + parseInt(minutes);
    if (newEndminutes >= 60) {
      newEndHours++;
      newEndminutes = newEndminutes % 60;
      newEndminutes = newEndminutes < 10 ? '0' + newEndminutes.toString() : newEndminutes.toString();
    } else {
      newEndminutes = newEndminutes < 10 ? '0' + newEndminutes.toString() : newEndminutes.toString();
    }
    if (newEndHours > 12) {
      newEndHours = newEndHours - 12;
      newEndHours = newEndHours < 10 ? '0' + newEndHours.toString() : newEndHours.toString();
      ampm = '1';
    } else {
      newEndHours = newEndHours < 10 ? '0' + newEndHours.toString() : newEndHours.toString();
    }

    this.rescheduleTaskObject.endTimeHour = newEndHours.toString();
    this.rescheduleTaskObject.endTimeminute = newEndminutes.toString();
    this.rescheduleTaskObject.endTimeminuteType = ampm;
  }
  RescheduleStartDateChange(): void {
    this.getRescheduleEndDateChange(this.rescheduleTaskObject.startDate);
    this.minDate = new Date(this.rescheduleTaskObject.startDate);
  }
  getRescheduleEndDateChange(RescheduleStartdate): void {
    const DurationinMins = this.timeInMinutes;
    this.startNewDateVal = RescheduleStartdate;
    const createdDate: any = new Date(this.startNewDateVal);

    createdDate.setMinutes(createdDate.getMinutes() + Math.round(DurationinMins));
    const dateObj = createdDate;
    const month = dateObj.getUTCMonth() + 1; // months from 1-12
    const day = dateObj.getDate(); //dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    this.rescheduleEndDate = new Date(createdDate);
    // console.log(createdDate);
  }

  newDurationStartDateChange(): void {
    const mstart: any = new Date(this.modifyTaskDurationObject.newStartDate);
    const mend: any = new Date(this.modifyTaskDurationObject.newEndDate);
    if (this.modifyTaskDurationObject.keepDurationConstantStatus) {
      this.startNewDateValOnkeepDurationConstantStatus(mstart, mend);
    } else {
      this.getNewQuantity(mstart, mend);
    }
  }

  newDurationEndDateChange(): void {
    if (this.modifyTaskDurationObject.keepDurationConstantStatus) {

    } else {
      const start: any = new Date(this.modifyTaskDurationObject.newStartDate);
      const end: any = new Date(this.modifyTaskDurationObject.newEndDate);
      this.getNewQuantity(start, end);
    }
  }

  keepDurationConstantChange(): void {
    const mstart: any = new Date(this.modifyTaskDurationObject.newStartDate);
    const mend: any = new Date(this.modifyTaskDurationObject.newEndDate);
    // console.log(this.modifyTaskDurationObject.keepDurationConstantStatus);
    if (this.modifyTaskDurationObject.keepDurationConstantStatus) {
      // this.modifyTaskDurationObject.newQuantity = this.selectedTask.QuantItems;
      this.startNewDateValOnkeepDurationConstantStatus(mstart, mend);
    } else {
      this.getNewQuantity(mstart, mend);
    }
  }

  startNewDateValOnkeepDurationConstantStatus(startNewDate, startNewEnddate): void {
    // console.log(this.startNewDateVal);
    this.getNewStartandEndDate(this.modifyTaskDurationObject.newQuantity, this.modifyTaskDurationObject.keepDurationConstantStatus);
  }

  getNewQuantity(startNewDate, startNewEnddate): void {
    // if (this.startNewDateVal !== undefined) {
    // https://stackoverflow.com/questions/7709803/javascript-get-minutes-between-two-dates
    // https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object

    const diffMs = (startNewEnddate - startNewDate); // milliseconds between now & Christmas
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if (diffMs >= 0) {
      // const diff: any = Math.abs(new Date('2011/10/09 12:00') - new Date('2011/10/09 00:00'));
      const diff: any = Math.abs((startNewDate) - (startNewEnddate));
      const minutes: any = Math.floor((diff / 1000) / 60);
      if (this.selectedTask !== undefined) {
        if (this.selectedTask.Speed !== 0 && this.selectedTask.Yield !== 0 && this.selectedTask.SpeedFactor !== 0) {
          const newQuantity = this.selectedTask.Speed * minutes * (this.selectedTask.Yield / 100) * this.selectedTask.SpeedFactor;
          this.modifyTaskDurationObject.newQuantity = String(Math.round(newQuantity));
        } else {
          const newQuantity = 0;
          this.modifyTaskDurationObject.newQuantity = String(Math.round(newQuantity));
        }
      }
    } else {
      this.toastr.error('End date should be greater than Start date', 'Information', { showCloseButton: true, maxShown: 1 });
    }
  }

  newQuantityChange(): void {
    // console.log(this.modifyTaskDurationObject.newQuantity);
    if (!this.modifyTaskDurationObject.keepDurationConstantStatus) {
      this.getNewStartandEndDate(this.modifyTaskDurationObject.newQuantity, undefined);
    }
  }

  onBlurNewQuantityChange(): void {
    // if (!this.modifyTaskDurationObject.keepDurationConstantStatus) {
    //   this.getNewStartandEndDate(this.modifyTaskDurationObject.newQuantity, undefined);
    // }
  }

  getNewStartandEndDate(newQuantityVal, constStatus): void {
    let DurationinMins: any;
    if (constStatus) {
      if (this.selectedTask !== undefined) {
        if (this.selectedTask.Speed !== 0 && this.selectedTask.Yield !== 0 && this.selectedTask.SpeedFactor !== 0) {
          DurationinMins = this.taskHourMinVal;
        } else {
          DurationinMins = 0;
        }
      }
    } else {
      if (this.selectedTask !== undefined) {
        if (this.selectedTask.Speed !== 0 && this.selectedTask.Yield !== 0 && this.selectedTask.SpeedFactor !== 0) {
          DurationinMins = Number(newQuantityVal) / (this.selectedTask.Speed * (this.selectedTask.Yield / 100) * this.selectedTask.SpeedFactor);
        } else {
          DurationinMins = 0;
        }
      }
    }
    this.startNewDateVal = new Date(this.modifyTaskDurationObject.newStartDate);
    this.startNewEnddateVal = new Date(this.modifyTaskDurationObject.newEndDate);
    const mcreatedDate: any = this.startNewDateVal;
    mcreatedDate.setMinutes(this.startNewDateVal.getMinutes() + Math.round(DurationinMins));
    const dateObj = mcreatedDate;
    const month = dateObj.getUTCMonth() + 1; // months from 1-12
    const day = dateObj.getDate(); // dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    this.modifyTaskDurationObject.newEndDate = new Date(mcreatedDate);

    if (constStatus && this.selectedTask !== undefined) {
      const mstartDate = new Date(this.modifyTaskDurationObject.newStartDate);
      const mendDate = new Date(this.modifyTaskDurationObject.newEndDate)
      this.getNewQuantity(mstartDate, mendDate);
    }
  }

  deleteScheduleTask(): void {
    this.loading = true;
    this.productionService.geDeleteScheduleTask(this.selectedTask, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        // console.log(response);
        const currentDateString = this.getDateStringFormat(new Date());
        if (this.viewFlag === 'decor') {
          this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 2);
          this.loadDataofSimulationFromAPI(this.weekStartday, 2);
        } else if (this.viewFlag === 'vap') {
          this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 4);
          this.loadDataofSimulationFromAPI(this.weekStartday, 4);
        } else if (this.viewFlag === 'primary') {
          this.loadDataofSimulationFromAPI(this.weekStartday, 1);
          this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 1);
        } else if (this.viewFlag === 'miscellaneous') {
          this.getUnscheduledTasksDetailsFromAPI(this.weekStartday, 5);
          this.loadDataofSimulationFromAPI(this.weekStartday, 5);
        }
        this.rescheduleEndDate = '';
        this.editTaskVisible = false;
        this.toastr.success(response.responseMsg, 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      } else {
        this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
      this.toastr.error(this.constant.serverError, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }

  updateModifyScheduleTask(modifyTaskDurationObject): void {
    this.loading = true;
    this.dateStatus = false;
    this.isEndDatevalid = false;
    this.modifyTaskDurationdata = this.modifyTaskDurationObject;
    const currentStartDate = new Date(this.modifyTaskDurationdata.currentStartDate).getTime();
    const currentEndDate = new Date(this.modifyTaskDurationdata.currentEndDate).getTime();

    if (this.modifyTaskDurationdata.newStartDate !== '') {
      if (this.modifyTaskDurationdata.newStartDate.formatted !== undefined) {
        this.modifyTaskDurationdata.newStartDate = this.getDateStringFormat(this.modifyTaskDurationdata.newStartDate.formatted);// + ' ' + this.modifyTaskDurationdata.startTime;
      } else {
        this.modifyTaskDurationdata.newStartDate = this.modifyTaskDurationdata.newStartDate;
      }
    }
    if (this.modifyTaskDurationdata.newEndDate !== '') {
      if (this.modifyTaskDurationdata.newEndDate.formatted !== undefined) {
        this.modifyTaskDurationdata.newEndDate = this.getDateStringFormat(this.modifyTaskDurationdata.newEndDate.formatted);//  + ' ' + this.modifyTaskDurationdata.endTime;

      } else {
        this.modifyTaskDurationdata.newEndDate = this.modifyTaskDurationdata.newEndDate;
      }
    }

    if (this.modifyTaskDurationdata.newStartDate !== '') {
      if (new Date(this.modifyTaskDurationdata.newStartDate).getTime() <= new Date(this.modifyTaskDurationdata.newEndDate).getTime() && currentStartDate <= new Date(this.modifyTaskDurationdata.newEndDate).getTime()) {
        this.isEndDatevalid = true;
      }
    } else if (this.modifyTaskDurationdata.newEndDate !== '') {
      if (currentStartDate <= new Date(this.modifyTaskDurationdata.newEndDate).getTime()) {
        this.isEndDatevalid = true;
      }
    }
    // if (this.modifyTaskDurationObject.newStartDate === {} || this.modifyTaskDurationObject.newEndDate === {} || this.modifyTaskDurationObject.newQuantity !== '') {
    //   this.isEndDatevalid = true;
    // }

    if (this.isEndDatevalid) {
      let start = new Date(this.modifyTaskDurationdata.newStartDate).getTime();
      let end = new Date(this.modifyTaskDurationdata.newEndDate).getTime();
      if (end < start) {
        this.dateStatus = true;
        this.loading = false;
      } else {
        this.productionService.getupdateModifyScheduleTask(this.selectedTask, this.modifyTaskDurationdata, response => {
          this.loading = false;
          if (response.responseCode === 200) {
            // console.log(response);
            const currentDateString = this.getDateStringFormat(new Date());
            if (this.viewFlag === 'decor') {
              this.loadDataofSimulationFromAPI(this.weekStartday, 2);
            } else if (this.viewFlag === 'vap') {
              this.loadDataofSimulationFromAPI(this.weekStartday, 4);
            } else if (this.viewFlag === 'primary') {
              this.loadDataofSimulationFromAPI(this.weekStartday, 1);
            } else if (this.viewFlag === 'miscellaneous') {
              this.loadDataofSimulationFromAPI(this.weekStartday, 5);
            }
            this.onModifyTaskDurationOk = false;
            this.modifyTaskDurationdata.startTime = '';
            this.modifyTaskDurationdata.endTime = '';
            this.editTaskVisible = false;
            this.modifyTaskDurationStatus = false;
            this.dateStatus = false;
            this.modifyValidation = false;
          } else {
            // console.log(response);
            this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            this.modifyTaskDurationdata = this.selectedTask;
            this.editTaskVisible = false;
            this.onModifyTaskDurationOk = false;
            this.dateStatus = false;
            this.modifyValidation = false;
            const startDate = this.modifyTaskDurationdata.BeginDate.replace('T', ' ');
            const startTimeObj1 = startDate.split(' ');
            const startTimeObj2 = startTimeObj1[1];
            const startTimeFormat = startTimeObj2.split(':');
            const startTime = startTimeFormat[0];
            var startTimeType = "AM";
            var startHour = startTime;
            if (startHour >= 13) {
              startHour = startTime - 12;
              startTimeType = "PM";
              this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
            }
            else if (startHour == 0) {
              startHour = 12;
              this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
            }
            else if (startHour == 12) {
              startTimeType = "PM";
              this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
            }
            else {
              this.startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
            }
            const endDate = this.modifyTaskDurationdata.EndDate.replace('T', ' ');
            const endTimeObj1 = endDate.split(' ');
            const endTimeObj2 = endTimeObj1[1];
            const endTimeFormat = endTimeObj2.split(':');
            const endTime = endTimeFormat[0];
            var endTimeType = "AM";
            var endHour = endTime;
            if (endHour >= 13) {
              endHour = endTime - 12;
              endTimeType = "PM";
              this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
            }
            else if (endHour == 0) {
              endHour = 12;
              this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
            }
            else if (endHour == 12) {
              endTimeType = "PM";
              this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
            }
            else {
              this.endTimeFinal = endHour + ':' + endTimeFormat[1] + ' ' + endTimeType;
            }

            let startTimeTypeVal = '0';
            if (startTimeType === 'PM') {
              startTimeTypeVal = '1';
            } else {
              startTimeTypeVal = '0';
            }

            let endTimeTypeVal = '0';
            if (endTimeType === 'PM') {
              endTimeTypeVal = '1';
            } else {
              endTimeTypeVal = '0';
            }

            // diffMs: any;
            const startDateFormat: any = new Date(startDate);
            const endDateFormat: any = new Date(endDate);
            const hourDiff = endDateFormat - startDateFormat;
            const diffHrs = Math.round((hourDiff % 86400000) / 3600000);
            const hDiff = hourDiff / 3600 / 1000; // in hours
            this.taskHourVal = hDiff;
            const diffMins = Math.round(((hourDiff % 86400000) % 3600000) / 60000);
            // this.lineName = LineName;
            if (this.simulateFlag) {
              this.editTaskVisible = true;
              const modifyTaskDuration = this.modifyTaskDurationdata; // FormingLineObject.Days[0].Tasks[FormingLineObject.Days[0].Tasks.length - 1];

              const currentStartDateSplit = this.getDateStringFormat(modifyTaskDuration.BeginDate).split('/');
              const currentEndDateSplit = this.getDateStringFormat(modifyTaskDuration.EndDate).split('/');
              this.modifyTaskDurationObject = {
                modiTaskName: modifyTaskDuration.Description,
                modiItemName: this.selectedTask.CurrentTaskStatus.TaskStatusName,
                currentStartDate: this.getDateStringFormat(modifyTaskDuration.BeginDate),
                currentEndDate: this.getDateStringFormat(modifyTaskDuration.EndDate),
                currentQuantity: modifyTaskDuration.QuantItems,
                newStartDate: new Date(modifyTaskDuration.BeginDate),
                startTime: startHour,
                newEndDate: new Date(modifyTaskDuration.EndDate),
                endTime: endHour,
                newQuantity: modifyTaskDuration.QuantItems,
                reasonforChange: '0',
                taskNumber: modifyTaskDuration.TaskNumber,
                itemNumber: modifyTaskDuration.ItemNumber,
                PONumber: modifyTaskDuration.ProductionOrder,
                startTimeHour: startHour,
                startTimeminute: startTimeFormat[1],
                startTimeminuteType: startTimeTypeVal,
                endTimeHour: endHour,
                endTimeminute: endTimeFormat[1],
                endTimeminuteType: endTimeTypeVal,
                keepDurationConstantStatus: true
              }

              if (modifyTaskDuration.CurrentTaskStatus.TaskStatusCode !== 2) {
                this.editTaskVisibleLiItem = true;
                this.newStartDateDisableStatus = false;
                this.modifyTaskDurationObject.keepDurationConstantStatus = true;
              } else {
                this.editTaskVisibleLiItem = false;
                this.newStartDateDisableStatus = true;
                this.modifyTaskDurationObject.keepDurationConstantStatus = false;
              }
            }
          }

        }, error => {
          this.loading = false;
        });
      }
    } else {
      this.loading = false;
      this.dateStatus = true;
    }
  }

  changeOperatingModeFromAPI(): void {
    this.productionService.getchangeOperatingMode('', response => {
      if (response.responseCode === 200) {
        // console.log(response);
        this.alternateGammeOptions = response.data;
      } else {
        // console.log(response);
      }
    }, error => {
      // this.loading = false;
    });
  }

  jobChangesPopUpshow(Day, PressTask): void {
    if (PressTask.CoGroupType == 1) {
      if (PressTask.PressTaskCount > 3 && !PressTask.ApprovalStatus) {
        // if (PressTask.PressTaskCount > 3) {
        this.approveJobChanges = true;
        this.taskCount = PressTask.PressTaskCount;
      } else {
        this.approveJobChanges = false;
      }
    } else if (PressTask.CoGroupType == 2) {
      if (PressTask.BlowTaskCount > 3 && !PressTask.ApprovalStatus) {
        // if (PressTask.BlowTaskCount > 3) {
        this.approveJobChanges = true;
        this.taskCount = PressTask.BlowTaskCount;
      } else {
        this.approveJobChanges = false;
      }
    } else {
      this.approveJobChanges = false;
    }

    this.jobChangesPopUp = true;
    this.approveClick = false;
    this.userName = '';
    this.date = Day.split('T')[0];
    // console.log(Day, PressTask);
    if (this.simulateFlag) {
      this.jobchangeurlconstant = 'SIMULATE';
    } else {
      this.jobchangeurlconstant = 'PROD';
    }
    this.loading = true;
    let reqBody = {
      SelectedDate: this.date
    };
    this.approvePopUpDetails = [];
    this.popUpDetails = [];
    this.popUpDetailsdate = '';
    this.popUpDetailsgroupId = '';
    this.approvedDate = null;
    this.approvedBy = null;
    this.productionService.getPopupJobchangeDetails(reqBody, PressTask, this.jobchangeurlconstant, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        this.approvePopUpDetails = response.data;
        this.popUpDetails = response.data.JobChangeDetails;
        this.popUpDetailsdate = response.data.JobChangeDetails[0].Date;
        this.popUpDetailsgroupId = response.data.JobChangeDetails[0].GroupId;
        if (response.data.LastApprovedOn !== null) {
          this.approvedDate = this.sharedService.getDateAMPMFormat(response.data.LastApprovedOn);
        }       
        this.approvedBy = response.data.LastApproverName;
      } else {
        this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
    });
  }

  canceljobChangesPopUp(): void {
    this.jobChangesPopUp = false;
  }

  approvejobChanges(): void {
    this.approveClick = true;
    if (this.userName !== '' && this.userName !== null) {
      this.approvePopUpShow = true;
    } else {
      this.toastr.error("Please enter approver's name", 'Warning', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
  }

  onApproveYes(): void {
    this.loading = true;
    let groupId = null;
    if (this.popUpDetailsgroupId == 'Press') {
      groupId = 1;
    } else if (this.popUpDetailsgroupId == 'Blown') {
      groupId = 2;
    }
    let jobChangeDetails = JSON.parse(JSON.stringify(this.popUpDetails));
    for (let i = 0; i < jobChangeDetails.length; i++) {
      delete jobChangeDetails[i]['Date'];
      delete jobChangeDetails[i]['GroupId'];
    }
    // this.approvePopUpDetails
    let jobChangeObject = {
      'ProductionDate': this.popUpDetailsdate,
      'CoGroupID': groupId,
      'ApproverId': null,
      'ApproverName': this.userName,
      'ApprovedJobChangeDetails': jobChangeDetails
    };
    this.productionService.approveJobChangesAPI(jobChangeObject, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        /**Only primary schedule have Job Changes */
        if (this.simulateFlag) {
          this.loadDataofSimulationFromAPI(this.weekStartday, 1);
        } else {
          this.loadDataofPrimaryProductionFromAPI(this.weekStartday);
        }
        this.approvePopUpShow = false;
        this.jobChangesPopUp = false;
      } else {
        this.toastr.error(response.responseMsg, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
      this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }

  onApproveNo(): void {
    this.approvePopUpShow = false;
  }

  clearUserName(e) {
  }

  getUserDescription(user) {
    var userArray = this.userNameList;
    var selectedObj = {
      'Id': null
    };
    for (var i = 0; i < userArray.length; i++) {
      if (userArray[i]['Id'] === user) {
        selectedObj = userArray[i];
        break;
      }
    }
    this.userID = selectedObj.Id;
  }

  updateChangeOperatingMode(changeOperatingModeObject): void {
    // this.loading = true;
    this.changeOperatingModedata = this.changeOperatingModeObject;
    this.changeDateStatus = false;
    this.isChangeEndDatevalid = false;
    // if (this.changeOperatingModeObject.startDate !== {} && this.changeOperatingModeObject.endDate !== {}) {
    //   if (new Date(this.changeOperatingModeObject.startDate).getTime() >= new Date(this.changeOperatingModeObject.endDate).getTime() || new Date(this.changeOperatingModeObject.startDate).getTime() === new Date(this.changeOperatingModeObject.endDate).getTime()) {
    //     this.isChangeEndDatevalid = true;
    //   }
    // }

    if (!this.isChangeEndDatevalid && this.changeValidation) {
      this.loading = true;
      this.productionService.changeOperatingModeAPI(this.selectedTask, this.changeOperatingModeObject, this.alternateGammeOptionsSelectedData, response => {
        this.loading = false;
        if (response.responseCode === 200) {
          // console.log(response);
          if (this.viewFlag === 'decor') {
            this.loadDataofSimulationFromAPI(this.weekStartday, 2);
          } else if (this.viewFlag === 'vap') {
            this.loadDataofSimulationFromAPI(this.weekStartday, 4);
          } else if (this.viewFlag === 'primary') {
            this.loadDataofSimulationFromAPI(this.weekStartday, 1);
          } else if (this.viewFlag === 'miscellaneous') {
            this.loadDataofSimulationFromAPI(this.weekStartday, 5);
          }
          this.editTaskVisible = false;
          this.gammeSelected = false;
          this.changeValidation = true;
          this.changeDateStatus = false;
          this.onchangeOk = false;
          this.isChangeEndDatevalid = false;
          this.changeOperatingModeStatus = false;
          this.changeOperatingModeObject.startDate = '';
          this.changeOperatingModeObject.endDate = '';
          this.changeOperatingModeObject.startTimeHour = '00',
            this.changeOperatingModeObject.startTimeminute = '00',
            this.changeOperatingModeObject.startTimeminuteType = '0',
            this.changeOperatingModeObject.endTimeHour = '00',
            this.changeOperatingModeObject.endTimeminute = '00',
            this.changeOperatingModeObject.endTimeminuteType = '0',
            this.onchangeOk = false;
        } else {
          // console.log(response);
          this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        }
      }, error => {
        this.loading = false;

      });
    } else {
      this.loading = false;
      this.changeDateStatus = true;
      this.onchangeOk = false;
    }
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
  * @desc show error toast messages
  * @param {Object} error response object
  **/
  noAccessToastMessage(): void {
    this.loading = false;
    this.toastr.error(this.constant.noAccessMsg, 'Failure!', {
      showCloseButton: true, maxShown: 1
    });
  }

}