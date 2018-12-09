import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ManningService } from '../../../../services/home/manning.service';
import { ProductionService } from '../../../../services/home/production.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../../../../utill/constants/constant';
import { LoginService } from '../../../../services/login/login.service';
import * as moment from 'moment';

@Component({
  selector: 'app-manning',
  templateUrl: './manning.component.html',
  styleUrls: ['./manning.component.css']
})
export class ManningComponent implements OnInit {
  date2MinDate: any;
  ExportpopupDetails: any;

  public manningLiButtons = [];
  public isLiItemClicked = 'Calculate Manning';
  public loading = true;
  public weekDays = [];
  public apiData: any;
  public weekStartday;
  public weekEndday;
  public defaultDay;
  public formLines = [];
  public packShifts = [];
  public packShiftsByDay = [];
  public packShiftsGrouped = [];
  public totalForShift;
  public timeSlot = [];
  public timeSlotStatus = '';
  public legendData;
  public onViewLessMoreStatus = false;
  public toggleIcon = 'less';
  public ViewLessMoreTitle = 'View More';
  public hourList = [];
  public simulate;
  public weekstart;
  public manningAccess = null; /* null=noAccess ; false=viewAccess; true=fullAccess */
  public createExport = false;
  public export = {
    Primary: false,
    Décor: false,
    VAP: false,
    Miscellaneous: false
  }
  public selectedArray = [];
  public selectedArrays = [];
  public weekcountExport = 1;
  weekstartExport: String;
  weekendExport: String;
  exportDate = new Date();
  date1: moment.Moment;
  constructor(
    private router: Router,
    private manningService: ManningService,
    private productionService: ProductionService,
    private vcr: ViewContainerRef,
    private toastr: ToastsManager,
    public constant: Constant,
    private loginService: LoginService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    if (localStorage.getItem("userData") === null) {
      this.onSessionToastMessage();
      this.gotoLogin();
    } else {
      this.checkAccess();
      this.manningAccess = this.loginService.getUserTransaction(this.constant.moduleArray[5]);
      this.date1 = moment();
      this.date2MinDate = new Date();
      this.date2MinDate.setDate(this.date2MinDate.getDate() - 1);
      this.addManningLiButtons();
      this.loadLegendsFromAPI();
      const currentDateString = this.getDateStringFormat(new Date());
      this.loadDataOfMinningFromAPI(currentDateString);
    }
  }

  addManningLiButtons(): void {
    this.manningLiButtons.push(
      { name: 'Calculate Manning' }
    );
    if (this.manningAccess === true) {
      this.manningLiButtons.push(
        { name: 'Master Inputs' }
      );
    }
  }

  checkAccess(): void {
    if (this.router.url.indexOf('manning') !== -1) {
      let manningAccess = this.loginService.getUserTransaction(this.constant.moduleArray[5]);
      if (manningAccess === null) {
        this.noAccess();
      }
    } else if (this.router.url.indexOf('masterInputs') !== -1) {
      let manningAccess = this.loginService.getUserTransaction(this.constant.moduleArray[5]);
      if (manningAccess !== true) {
        this.noAccess();
      }
    }
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

  /**
* @desc show error toast messages
**/
  noAccessToastMessage(): void {
    this.loading = false;
    this.toastr.error(this.constant.noAccessMsg, 'Failure!', {
      showCloseButton: true, maxShown: 1
    });
  }

  onLiBtnclick(name): void {
    this.isLiItemClicked = name;
    if (name === 'Calculate Manning') {
      const link = ['dashboard/manning'];
      this.loadDataOfMinningFromAPI(this.weekStartday);
      this.router.navigate(link);

    }
    else if (name === 'Master Inputs') {
      const link = ['dashboard/masterInputs'];
      this.router.navigate(link);
    }
  }

  loadDataOfMinningFromAPI(dateString): void {
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.manningService.getManningDetails(reqBody, response => {
      this.loading = false;
      this.weekDays = [];
      if (response.responseCode === 200) {
        this.apiData = response;
        this.weekStartday = this.getDateStringFormat(this.apiData.data.ProductionWeekStartDate);
        this.defaultDay = new Date(this.weekStartday);
        this.defaultDay.setDate(this.defaultDay.getDate());
        this.weekEndday = this.getDateStringFormat(this.apiData.data.ProductionWeekEndDate);
        this.weekDays = this.apiData.data.FormingLines[0].Days;
        this.loadDaysTimeSlot(this.weekDays);
        this.formLines = this.apiData.data.FormingLines;
        this.packShifts = this.apiData.data.PackShifts;
        this.packShiftsGrouped = this.groupByObject(this.packShifts, 'ShiftDate');
        this.packShiftsByDay = [];
        for (let key of Object.keys(this.packShiftsGrouped)) {
          this.packShiftsByDay.push(this.packShiftsGrouped[key]);
        };
        this.hourList = this.packShifts[0].ManningHours;
        this.totalForShift = this.apiData.data.PackShifts[0].ShiftsPerDay;
        this.parseChartData(this.apiData.data);
      } else {
        this.toastr.clearAllToasts();
        this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
      this.toastr.clearAllToasts();
      this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }

  groupByObject(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
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
    /*to get diffr b/w chart plotting date*/
    let dateDiff: number = endDate - startDate;
    let chartData = data.FormingLines;
    for (let i = 0; i < chartData.length; i++) {
      for (let j = 0; j < chartData[i].Days.length; ++j) {
        for (let k = 0; k < chartData[i].Days[j].PackTasks.length; ++k) {
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
          if (taskStart <= endDate && taskEndDate >= startDate) {
            /*to check the date range inside the plotting date range*/
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
            if (chartData[i].Days[j].PackTasks[k].CurrentTaskStatus !== undefined) {
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
        }
      }
    }
  }

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

  loadLegendsFromAPI(): void {
    this.productionService.getLegendDetails('', response => {
      if (response.responseCode === 200) {
        this.legendData = response.data
      } else {
        this.toastr.clearAllToasts();
        this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.toastr.clearAllToasts();
      this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }
  onTap(event): void {
    event.preventDefault();
    event.stopPropagation();
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
      if(selecetedDate !== null) {
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
    //this.loadDataOfMinningFromAPI(weekPeriod[0]);
    if (this.simulate) {
      this.loadManningDataofSimulationFromAPI(weekPeriod[0])
    } else {
      this.loadDataOfMinningFromAPI(weekPeriod[0]);
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
    console.log(w, y);
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
      if (this.simulate) {
        this.loadManningDataofSimulationFromAPI(previousDateString);
      } else {
        this.loadDataOfMinningFromAPI(previousDateString);
      }
    } else {
      this.toastr.clearAllToasts();
      // this.toastr.error('Previous week data not available.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
  }

  onFutureWeekdate(): void {
    var myDate = new Date(this.apiData.data.ProductionWeekEndDate);
    var nextDay = new Date(myDate);
    nextDay.setDate(myDate.getDate() + 1);
    var nextDateString = this.getDateStringFormat(nextDay);
    this.loading = true;
    if (this.simulate) {
      this.loadManningDataofSimulationFromAPI(nextDateString)
    } else {
      this.loadDataOfMinningFromAPI(nextDateString);
    }
  }
  viewSimulation(): void {
    this.simulate = true;
    this.loadManningDataofSimulationFromAPI(this.weekStartday)

  }

  backFromSimulation(): void {
    this.simulate = false;
    if (this.router.url === '/dashboard/manning') {
      this.onLiBtnclick('Calculate Manning');
    }

  }

  refreshManning(): void {
    this.loading = true;
    this.productionService.getProdTaskRefresh(response => {
      this.loading = false;
      if (response.responseCode === 200) {
        this.loading = true;
        if (this.simulate) {
          this.loadManningDataofSimulationFromAPI(this.weekStartday)
        } else {
          this.loadDataOfMinningFromAPI(this.weekStartday);
        }
        //this.loadDataOfMinningFromAPI(this.weekStartday);
      } else {
        this.toastr.clearAllToasts();
        this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
      this.toastr.clearAllToasts();
      this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }

  /* This function is to get simulation data of manning page.*/
  loadManningDataofSimulationFromAPI(dateString): void {
    this.formLines = [];
    this.loading = true;
    let reqBody = {
      FromDate: dateString
    };
    this.productionService.getPackSimulationDetailsForManning(reqBody, response => {
      // this.apiData = response;
      this.weekDays = [];
      this.loading = false;
      console.log(response);
      if (response.responseCode === 200) {
        this.apiData = response;
        this.weekStartday = this.getDateStringFormat(this.apiData.data.ProductionWeekStartDate);
        this.defaultDay = new Date(this.weekStartday);
        this.defaultDay.setDate(this.defaultDay.getDate());
        this.weekEndday = this.getDateStringFormat(this.apiData.data.ProductionWeekEndDate);
        this.weekDays = this.apiData.data.FormingLines[0].Days;
        this.formLines = this.apiData.data.FormingLines;
        this.packShifts = this.apiData.data.PackShifts;
        this.packShiftsGrouped = this.groupByObject(this.packShifts, 'ShiftDate');
        this.packShiftsByDay = [];
        for (let key of Object.keys(this.packShiftsGrouped)) {
          this.packShiftsByDay.push(this.packShiftsGrouped[key]);
        };
        this.hourList = this.packShifts[0].ManningHours;
        this.loadDaysTimeSlot(this.weekDays);
        this.parseChartData(this.apiData.data);
      } else {
      }
    }, error => {
      this.loading = false;
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

  onPrint() {
    this.loading = true;
    this.productionService.loadExportDetails(response => {
      if (response.responseCode === 200) {
        this.ExportpopupDetails = response.data.SchGroups;
        //for (var i = 0; i < this.ExportpopupDetails.length; i++) {
        // if (this.ExportpopupDetails[i].Name == 'Primary') {
        //   if (this.viewFlag == 'primary') {
        this.export.Primary = true;
        //   } else {
        //     this.export.Primary = false;
        //   }
        // }
        // if (this.ExportpopupDetails[i].Name == 'Décor') {
        //   if (this.viewFlag == 'decor') {
        this.export.Décor = true;
        //   } else {
        //     this.export.Décor = false;
        //   }
        // }
        // if (this.ExportpopupDetails[i].Name == 'VAP') {
        //   if (this.viewFlag == 'vap') {
        this.export.VAP = true;
        //   } else {
        //     this.export.VAP = false;
        //   }
        // }
        // if (this.ExportpopupDetails[i].Name == 'Miscellaneous') {
        //   if (this.viewFlag == 'miscellaneous') {
        this.export.Miscellaneous = true;
        //   } else {
        //     this.export.Miscellaneous = false;
        //   }
        // }
        //}
        this.createExport = true;
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, error => {
      this.loading = false;
    });
  }
  cancelExport() {
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
  continueExport() {
    var PrintModelData = {
      "FromDate": this.exportDate
    }
    let printModeldata: any = PrintModelData;
    localStorage.setItem("printManningData", btoa(JSON.stringify(printModeldata)));
    const link = [this.router.url + '/manningprint'];
    this.router.navigate(link);
  }
}