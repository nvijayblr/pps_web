import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { DialogComponent } from '../../../../common/dialog/dialog.component';
import { ProductionService } from '../../../../services/home/production.service';
import { Languageconstant } from '../../../../utill/constants/languageconstant';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { Constant } from '../../../../utill/constants/constant';
import { LoginService } from '../../../../services/login/login.service';

@Component({
  selector: 'app-primary',
  templateUrl: './primary.component.html',
  styleUrls: ['./primary.component.css'],
  providers: [DatePipe]
})
export class PrimaryComponent implements OnInit {
  date2MinDate: any;

  public weekDays = [];
  public timeSlot = [];
  public weekDaysStatus = '';
  public timeSlotStatus = '';
  public loading = false;
  public apiData: any;
  public productionLiButtons = [];
  public isLiItemClicked = 'Primary Pack'
  public isLiItemClickedIndex = 1;
  public progressFurnaces = [];
  public formLines = [];
  public tonStates = [];
  public jobChanges = [];
  public packShifts = [];
  public packShiftsGrouped = [];
  public packShiftsByDay = [];
  public unscheduledTasksItems = [];
  public viewFlag = 'primary';
  public weekStartday;
  public weekEndday;
  public defaultDay;
  public selecedLine: String;
  public pageHeader: String;
  public simulatedPage: String;
  public legendData;
  public onViewLessMoreStatus = false;
  public toggleIcon = 'less';
  public ViewLessMoreTitle = 'View More';
  public hourList = [];
  public simulateFlag = false;
  public weekstart;
  public access = null; /* null=noAccess ; false=view; true=fullAccess */
  public primaryAccess = null; /* null=noAccess ; false=view; true=fullAccess */
  public decorAccess = null; /* null=noAccess ; false=view; true=fullAccess */
  public vapAccess = null; /* null=noAccess ; false=view; true=fullAccess */
  public miscAccess = null; /* null=noAccess ; false=view; true=fullAccess */
  public setPackAccess = null;/* null=noAccess ; false=view; true=fullAccess */
  public moduleName = '';
  constructor(
    private router: Router,
    private productionService: ProductionService,
    private languageconstant: Languageconstant,
    private toastr: ToastsManager,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    public constant: Constant,
    private vcr: ViewContainerRef,
    private loginService: LoginService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    if (localStorage.getItem("userData") === null) {
      this.onSessionToastMessage();
      this.gotoLogin();
    } else {
      this.getEachTabAccess();
      this.addProductionLiButtons();
      this.date2MinDate = new Date();
      this.date2MinDate.setDate(this.date2MinDate.getDate() - 1);
      // var currentDateString = this.getDateStringFormat(new Date());
      // this.loadDataofPrimaryPackFromAPI(currentDateString)

      // this.onLiBtnclick(this.isLiItemClicked, this.isLiItemClickedIndex);
      // this.onLiBtnclick(this.constant.priprodBtnStatusObject.btnName, this.constant.priprodBtnStatusObject.index);
      if (this.router.url === '/dashboard/packs/primary') {
        if (this.primaryAccess === null) {
          this.noAccess();
        } else {
          this.onLiBtnclick('Primary Pack', 1);
        }
      } else if (this.router.url === '/dashboard/packs/decor') {
        if (this.decorAccess === null) {
          this.noAccess();
        } else {
          this.onLiBtnclick('Decor Pack', 3);
        }
      } else if (this.router.url === '/dashboard/packs/vap') {
        if (this.vapAccess === null) {
          this.noAccess();
        } else {
          this.onLiBtnclick('VAP Pack', 5);
        }
      } else if (this.router.url === '/dashboard/packs/miscellaneous') {
        if (this.miscAccess === null) {
          this.noAccess();
        } else {
          this.onLiBtnclick('Miscellaneous Pack', 7);
        }
      } else if (this.router.url === '/dashboard/packs/repack') {
        if (this.setPackAccess === null) {
          this.noAccess();
        } else {
          this.onLiBtnclick('Set and Pack', 9);
        }
      }
        else {
        var moduleName = this.checkingForLandingTab();
        var selectedTab = this.getFirstTab(moduleName);
        this.onLiBtnclick(selectedTab.name, selectedTab.value);
        // this.onLiBtnclick(this.constant.priprodBtnStatusObject.btnName, this.constant.priprodBtnStatusObject.index);
      }
      this.loadLegendsFromAPI();
    }
  }

  gotoLogin(): void {
    setTimeout(() => {
      const link = ['login'];
      this.router.navigate(link);
    }, this.constant.minToastLife);
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

  onLiBtnclick(name, index): void {
    this.simulateFlag = false;
    this.isLiItemClicked = name;
    const currentDateString = this.getDateStringFormat(new Date());
    this.constant.priprodBtnStatusObject.btnName = name;
    this.constant.priprodBtnStatusObject.index = index;
    if (name === 'Primary Production') {
      this.access = this.primaryAccess;
      this.loading = true;
      this.selecedLine = 'Forming Lines';
      this.pageHeader = 'Primary Production Schedule';
      // const link = ['dashboard/productions'];
      // this.router.navigate(link);
      this.router.navigate(['productions', 'primary'], { relativeTo: this.activatedRoute.parent });
    } else if (name === 'Primary Pack') {
      this.access = this.primaryAccess;
      this.loading = true;
      this.selecedLine = 'Forming Lines';
      this.pageHeader = 'Primary Pack Schedule';
      this.simulatedPage = 'Primary Pack Simulation';
       // const link = ['dashboard/packs'];
      // this.router.navigate(link);
      this.router.navigate(['packs', 'primary'], { relativeTo: this.activatedRoute.parent });
      this.loading = true;
      this.viewFlag = 'Primary Pack';
      this.loadDataofPrimaryPackFromAPI(currentDateString);
    } else if (name === 'Decor Production') {
      this.access = this.decorAccess;
      this.loading = true;
      this.selecedLine = 'Decor Lines';
      this.pageHeader = 'Decor Production Schedule';
      this.router.navigate(['productions', 'decor'], { relativeTo: this.activatedRoute.parent });
      // const link = ['dashboard/productions'];
      // this.router.navigate(link);
    } else if (name === 'Decor Pack') {
      this.access = this.decorAccess;
      this.loading = true;
      this.selecedLine = 'Decor Lines';
      this.simulatedPage = 'Decor Pack Simulation';
      this.pageHeader = 'Decor Pack Schedule';
      this.loading = true;
      this.viewFlag = 'decor Pack';
      // const link = ['dashboard/packs'];
      // this.router.navigate(link);
      this.router.navigate(['packs', 'decor'], { relativeTo: this.activatedRoute.parent });
      this.loadDataofDecorPackFromAPI(currentDateString);
    } else if (name === 'VAP Production') {
      this.access = this.vapAccess;
      this.loading = true;
      this.selecedLine = 'Vap Lines';
      this.pageHeader = 'VAP Production Schedule';
      // const link = ['dashboard/productions'];
      // this.router.navigate(link);
      this.router.navigate(['productions', 'vap'], { relativeTo: this.activatedRoute.parent });
    } else if (name === 'VAP Pack') {
      this.access = this.vapAccess;
      this.selecedLine = 'Vap Lines';
      this.pageHeader = 'VAP Pack Schedule';
      this.simulatedPage = 'VAP Pack Simulation';
      this.loading = true;
      this.viewFlag = 'VAP Pack';
      // const link = ['dashboard/packs'];
      // this.router.navigate(link);
      this.router.navigate(['packs', 'vap'], { relativeTo: this.activatedRoute.parent });
      this.loadDataofVapPackFromAPI(currentDateString);
    } else if (name === 'Miscellaneous Production') {
      this.access = this.miscAccess;
      this.selecedLine = 'MiscellaneousVap Lines';
      this.pageHeader = 'Miscellaneous Production Schedule';
      this.loading = true;
      // const link = ['dashboard/productions'];
      // this.router.navigate(link);
      this.router.navigate(['productions', 'miscellaneous'], { relativeTo: this.activatedRoute.parent });
    } else if (name === 'Miscellaneous Pack') {
      this.access = this.miscAccess;
      this.selecedLine = 'Miscellaneous Lines';
      this.simulatedPage = 'Miscellaneous Pack Simulation';
      // this.popUpLineName = 'Miscellaneous Line';
      this.pageHeader = 'Miscellaneous Pack Schedule';
      this.loading = true;
      this.viewFlag = 'Miscellaneous Pack';
      // const link = ['dashboard/packs'];
      // this.router.navigate(link);
      // this.loadDataofPrimaryProductionFromAPI();
      this.router.navigate(['packs', 'miscellaneous'], { relativeTo: this.activatedRoute.parent });
      this.loadDataofMiscellaneousPackFromAPI(currentDateString);
    } else if (name === 'Set and Pack') {
      this.access = this.setPackAccess;
      this.selecedLine = 'Repack Lines';
      //this.simulatedPage = 'Miscellaneous Pack Simulation';
      // this.popUpLineName = 'Miscellaneous Line';
      this.pageHeader = 'Set and Pack Schedule';
      this.loading = true;
      this.viewFlag = 'Set And Pack';
      // const link = ['dashboard/packs'];
      // this.router.navigate(link);
      this.router.navigate(['packs', 'repack'], { relativeTo: this.activatedRoute.parent });
      this.loadDataofSetAndPackFromAPI(currentDateString);
    }
  }
  onTap(event): void {
    //console.log(event);
    event.preventDefault();
    event.stopPropagation();
  }

  loadDaysTimeSlot(weekDays): void {
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

  loadDataofPrimaryPackFromAPI(dateString): void {
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getPrimaryPackDetails(reqBody, response => {
      this.formLines = [];
      this.loading = false;
      this.weekDays = [];
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
        this.packShifts = this.apiData.data.PackShifts;
        this.packShiftsGrouped = this.groupByObject(this.packShifts, 'ShiftDate');
        this.packShiftsByDay = [];
        for (let key of Object.keys(this.packShiftsGrouped)) {
          this.packShiftsByDay.push(this.packShiftsGrouped[key]);
        };
        this.hourList = this.packShifts.length ? this.packShifts[0].ManningHours : [];
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
  }

  groupByObject(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  loadDataofDecorPackFromAPI(dateString): void {
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getDecorPackDetails(reqBody, response => {
      this.formLines = [];
      this.loading = false;
      this.weekDays = [];
      console.log(response);
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
        this.packShifts = this.apiData.data.PackShifts;
        this.packShiftsGrouped = this.groupByObject(this.packShifts, 'ShiftDate');
        this.packShiftsByDay = [];
        for (let key of Object.keys(this.packShiftsGrouped)) {
          this.packShiftsByDay.push(this.packShiftsGrouped[key]);
        };
        this.hourList = this.packShifts.length ? this.packShifts[0].ManningHours : [];
        /*this.hourList = this.packShifts[0].ManningHours;*/
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
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
  loadDataofMiscellaneousPackFromAPI(dateString): void {
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getMiscellaneousPackDetails(reqBody, response => {
      this.formLines = [];
      this.loading = false;
      this.weekDays = [];
      console.log(response);
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
        this.packShifts = this.apiData.data.PackShifts;
        this.packShiftsGrouped = this.groupByObject(this.packShifts, 'ShiftDate');
        this.packShiftsByDay = [];
        for (let key of Object.keys(this.packShiftsGrouped)) {
          this.packShiftsByDay.push(this.packShiftsGrouped[key]);
        };
        this.hourList = this.packShifts.length ? this.packShifts[0].ManningHours : [];
        /*this.hourList = this.packShifts[0].ShiftsPerDay[0].ManningHours;*/
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
  }

  loadDataofVapPackFromAPI(dateString): void {
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getVapPackDetails(reqBody, response => {
      this.formLines = [];
      this.loading = false;
      this.weekDays = [];
      console.log(response);
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
        this.packShifts = this.apiData.data.PackShifts;
        this.packShiftsGrouped = this.groupByObject(this.packShifts, 'ShiftDate');
        this.packShiftsByDay = [];
        for (let key of Object.keys(this.packShiftsGrouped)) {
          this.packShiftsByDay.push(this.packShiftsGrouped[key]);
        };
        this.hourList = this.packShifts.length ? this.packShifts[0].ManningHours : [];
        /*this.hourList = this.packShifts[0].ShiftsPerDay[0].ManningHours;*/
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
  }
  loadDataofSetAndPackFromAPI(dateString): void {
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getSetAndPackDetails(reqBody, response => {
      this.formLines = [];
      this.loading = false;
      this.weekDays = [];
      console.log(response);
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
        this.packShifts = this.apiData.data.PackShifts;
        this.packShiftsGrouped = this.groupByObject(this.packShifts, 'ShiftDate');
        this.packShiftsByDay = [];
        for (let key of Object.keys(this.packShiftsGrouped)) {
          this.packShiftsByDay.push(this.packShiftsGrouped[key]);
        };
        this.hourList = this.packShifts.length ? this.packShifts[0].ManningHours : [];
        /*this.hourList = this.packShifts[0].ShiftsPerDay[0].ManningHours;*/
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
  }

  loadPackDataofSimulationFromAPI(dateString, type): void {
    this.formLines = [];
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getPackSimulationDetails(reqBody, type, response => {
      // this.apiData = response;
      this.weekDays = [];
      this.loading = false;
      if (response.responseCode === 200) {
        this.apiData = response;
        this.weekStartday = this.getDateStringFormat(this.apiData.data.ProductionWeekStartDate);
        this.weekstart = this.weekStartday;
        this.defaultDay = new Date(this.weekStartday);
        this.defaultDay.setDate(this.defaultDay.getDate());
        this.weekEndday = this.getDateStringFormat(this.apiData.data.ProductionWeekEndDate);
        this.weekDays = this.apiData.data.FormingLines[0].Days;
        this.formLines = this.apiData.data.FormingLines;

        this.tonStates = this.apiData.data.TonStates;
        this.jobChanges = this.apiData.data.JobChanges;
        this.packShifts = this.apiData.data.PackShifts;
        this.packShiftsGrouped = this.groupByObject(this.packShifts, 'ShiftDate');
        this.packShiftsByDay = [];
        for (let key of Object.keys(this.packShiftsGrouped)) {
          this.packShiftsByDay.push(this.packShiftsGrouped[key]);
        };
        if (this.packShifts) {
          this.hourList = this.packShifts.length ? this.packShifts[0].ManningHours : [];
          /*this.hourList = this.packShifts[0].ShiftsPerDay[0].ManningHours;*/
        }
        this.loadDaysTimeSlot(this.weekDays);
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
    });
  }

  weekPicker(selecetedDate): void {
    //if(this.weekstart !== Object){
      if(selecetedDate !== null ) {
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
		
		if(week!==undefined && year!==undefined){
			var startDate = this.getStartDateOfWeek(week, year);
		}
		var weekPeriod = this.getStartDateOfWeek(week, year);
		if(weekPeriod[0] != undefined && weekPeriod[1] != undefined){
      const newDate = weekPeriod[0] + " to "+ weekPeriod[1];
			//$scope.formData.dueDate = weekPeriod[0] + " to "+ weekPeriod[1];
    }
    if (this.simulateFlag) {
      // this.loadDataofSimulationFromAPI(nextDateString);
      if (this.viewFlag === 'decor Pack') {
        this.loadPackDataofSimulationFromAPI( weekPeriod[0], 2);
      } else if (this.viewFlag === 'VAP Pack') {
        this.loadPackDataofSimulationFromAPI( weekPeriod[0], 4);
      } else if (this.viewFlag === 'Primary Pack') {
        this.loadPackDataofSimulationFromAPI( weekPeriod[0], 1);
      } else if (this.viewFlag === 'Miscellaneous Pack') {
        this.loadPackDataofSimulationFromAPI( weekPeriod[0], 5);
      }
    } else {
    if (this.viewFlag === 'Primary Pack') {
      this.loadDataofPrimaryPackFromAPI( weekPeriod[0]);
      // this.loadDataofDecorProductionFromAPI(previousDateString);
    } else if (this.viewFlag === 'decor Pack') {
      this.loadDataofDecorPackFromAPI( weekPeriod[0]);
      //this.loadDataofVAPProductionFromAPI(previousDateString);
    } else if (this.viewFlag === 'VAP Pack') {
      this.loadDataofVapPackFromAPI( weekPeriod[0]);
    } else if (this.viewFlag === 'Miscellaneous Pack') {
      this.loadDataofMiscellaneousPackFromAPI( weekPeriod[0]);
    } else if (this.viewFlag === 'Set And Pack') {
      this.loadDataofSetAndPackFromAPI( weekPeriod[0]);
    }
   }
  }
  getWeekNumber(d) {
    d = new Date(+d);
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    let yearStart:any = new Date(d.getFullYear(), 0, 1);
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return [d.getFullYear(), weekNo];
  }

  getStartDateOfWeek(w, y) {
	  console.log(w,y);
		var simple = new Date(y, 0, 1 + (w - 1) * 7);
		var dow = simple.getDay();
		let ISOweekStart:any = simple;
		if (dow <= 4)
			ISOweekStart.setDate(simple.getDate() - simple.getDay());
		else
			ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay());
      ISOweekStart.setDate(ISOweekStart.getDate()+1);	
		let ISOweekEnd:any = new Date(ISOweekStart);
		ISOweekEnd.setDate(ISOweekEnd.getDate() + 6);
		
		ISOweekStart = (ISOweekStart.getMonth()+1)+'/'+ISOweekStart.getDate()+'/'+ISOweekStart.getFullYear();
		ISOweekEnd = (ISOweekEnd.getMonth()+1)+'/'+ISOweekEnd.getDate()+'/'+ISOweekEnd.getFullYear();
		return [ISOweekStart, ISOweekEnd];
	}
  onPreviousWeekdate(): void {
    // console.log('onPreviousWeekdate');
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
        if (this.viewFlag === 'decor Pack') {
          this.loadPackDataofSimulationFromAPI(previousDateString, 2);
        } else if (this.viewFlag === 'VAP Pack') {
          this.loadPackDataofSimulationFromAPI(previousDateString, 4);
        } else if (this.viewFlag === 'Primary Pack') {
          this.loadPackDataofSimulationFromAPI(previousDateString, 1);
        } else if (this.viewFlag === 'Miscellaneous Pack') {
          this.loadPackDataofSimulationFromAPI(previousDateString, 5);
        }
      } else {
      if (this.viewFlag === 'Primary Pack') {
        this.loadDataofPrimaryPackFromAPI(previousDateString);
        // this.loadDataofDecorProductionFromAPI(previousDateString);
      } else if (this.viewFlag === 'decor Pack') {
        this.loadDataofDecorPackFromAPI(previousDateString);
        //this.loadDataofVAPProductionFromAPI(previousDateString);
      } else if (this.viewFlag === 'VAP Pack') {
        this.loadDataofVapPackFromAPI(previousDateString);
      } else if (this.viewFlag === 'Miscellaneous Pack') {
        this.loadDataofMiscellaneousPackFromAPI(previousDateString);
      }else if (this.viewFlag === 'Set And Pack') {
        this.loadDataofSetAndPackFromAPI(previousDateString);
      }
     }
    } else {
      this.toastr.clearAllToasts();
      //this.toastr.error('Previous week data not available.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }

  }

  onFutureWeekdate(): void {
    //console.log('onFutureWeekdate');
    var myDate = new Date(this.apiData.data.ProductionWeekEndDate);
    var nextDay = new Date(myDate);
    nextDay.setDate(myDate.getDate() + 1);
    var nextDateString = this.getDateStringFormat(nextDay);
    this.loading = true;
    if (this.simulateFlag) {
      // this.loadDataofSimulationFromAPI(nextDateString);
      if (this.viewFlag === 'decor Pack') {
        this.loadPackDataofSimulationFromAPI(nextDateString, 2);
      } else if (this.viewFlag === 'VAP Pack') {
        this.loadPackDataofSimulationFromAPI(nextDateString, 4);
      } else if (this.viewFlag === 'Primary Pack') {
        this.loadPackDataofSimulationFromAPI(nextDateString, 1);
      } else if (this.viewFlag === 'Miscellaneous Pack') {
        this.loadPackDataofSimulationFromAPI(nextDateString, 5);
      }
    } else {
    if (this.viewFlag === 'Primary Pack') {
      this.loadDataofPrimaryPackFromAPI(nextDateString);
    } else if (this.viewFlag === 'decor Pack') {
      this.loadDataofDecorPackFromAPI(nextDateString);
    } else if (this.viewFlag === 'VAP Pack') {
      this.loadDataofVapPackFromAPI(nextDateString);
    } else if (this.viewFlag === 'Miscellaneous Pack') {
      this.loadDataofMiscellaneousPackFromAPI(nextDateString);
    }  else if (this.viewFlag === 'Set And Pack') {
      this.loadDataofSetAndPackFromAPI(nextDateString);
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
    console.log('onSimulateChange', this.viewFlag);
    this.loading = true;
    this.simulateFlag = true;
    const currentDateString = this.getDateStringFormat(new Date());
    //this.getUnscheduledTasksDetailsFromAPI();
    // this.loadDataofSimulationFromAPI(nextDateString);
    if (this.viewFlag === 'decor Pack') {
      this.loadPackDataofSimulationFromAPI(this.weekStartday, 2);
    } else if (this.viewFlag === 'VAP Pack') {
      this.loadPackDataofSimulationFromAPI(this.weekStartday, 4);
    } else if (this.viewFlag === 'Primary Pack') {
    this.loadPackDataofSimulationFromAPI(this.weekStartday, 1);
    } else if (this.viewFlag === 'Miscellaneous Pack') {
    this.loadPackDataofSimulationFromAPI(this.weekStartday, 5);
    }
  }

  backFromSimulate() {
    this.simulateFlag = false;
    if (this.router.url === '/dashboard/packs/primary') {
      this.onLiBtnclick('Primary Pack', 1);
    } else if (this.router.url === '/dashboard/packs/decor') {
      this.onLiBtnclick('Decor Pack', 3);
    } else if (this.router.url === '/dashboard/packs/vap') {
      this.onLiBtnclick('VAP Pack', 5);
    } else if (this.router.url === '/dashboard/packs/miscellaneous') {
      this.onLiBtnclick('Miscellaneous Pack', 7);
    } else {
      this.onLiBtnclick('Primary Pack', 1);
    }
  };
  onRefrersh(): void {
    console.log('onRefrersh');
    this.loading = true;
    this.productionService.getProdTaskRefresh(response => {
      this.formLines = [];
      this.loading = false;
      console.log(response);
      if (response.responseCode === 200) {

        var currentDateString = this.getDateStringFormat(new Date());
        if (this.viewFlag === 'Primary Pack') {
          this.loading = true;
          this.loadDataofPrimaryPackFromAPI(this.weekStartday);
        } else if (this.viewFlag === 'decor Pack') {
          this.loading = true;
          this.loadDataofDecorPackFromAPI(this.weekStartday);
        } else if (this.viewFlag === 'VAP Pack') {
          this.loading = true;
          this.loadDataofVapPackFromAPI(this.weekStartday);
        } else if (this.viewFlag === 'Miscellaneous Pack') {
          this.loadDataofMiscellaneousPackFromAPI(this.weekStartday);
        } else if (this.viewFlag === 'Set And Pack') {
          this.loadDataofSetAndPackFromAPI(this.weekStartday);
        }
      } else {
      }
    }, error => {
      this.loading = false;
    });
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
        if (chartData[i].Days[j].PackTasks) {
          for (let k = 0; k < chartData[i].Days[j].PackTasks.length; ++k) {
            // if (!chartData[i].Days[j].Tasks[k].IsContinueation) {// avoid continuation data
            /** Time Zone Fix */
            let taskStart: any, taskEndDate: any;
            if (typeof chartData[i].Days[j].PackTasks[k].BeginDate == 'string') {
              taskStart = this.dateTimeFormatForTimeZone(chartData[i].Days[j].PackTasks[k].BeginDate);
            } else {
              taskStart = new Date(chartData[i].Days[j].PackTasks[k].BeginDate);
            }
            if (typeof chartData[i].Days[j].PackTasks[k].EndDate == 'string') {
              taskEndDate = this.dateTimeFormatForTimeZone(chartData[i].Days[j].PackTasks[k].EndDate);
            } else {
              taskEndDate = new Date(chartData[i].Days[j].PackTasks[k].EndDate);
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
              if (chartData[i].Days[j].PackTasks[k].CurrentTaskStatus !== undefined && chartData[i].Days[j].PackTasks[k].CurrentTaskStatus) {
                obj.background = chartData[i].Days[j].PackTasks[k].CurrentTaskStatus.TaskStatusColor;
                obj.color = chartData[i].Days[j].PackTasks[k].CurrentTaskStatus.TaskStatusTextColor;
                chartData[i].Days[j].PackTasks[k].style = obj;
                let objbreif: any;
                objbreif = {
                  background: chartData[i].Days[j].PackTasks[k].CurrentTaskStatus.TaskStatusBriefColor,
                };
                chartData[i].Days[j].PackTasks[k].stylebreif = objbreif;
              }
            }
            // }
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

  onViewLessMore(): void {
    this.onViewLessMoreStatus = !this.onViewLessMoreStatus;
    if (this.onViewLessMoreStatus) {
      this.toggleIcon = 'more';
      this.ViewLessMoreTitle = 'View Less';
    } else {
      this.toggleIcon = 'less';
      this.ViewLessMoreTitle = 'View More';
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
