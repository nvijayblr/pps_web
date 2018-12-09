import { Component, OnInit, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { ProductionService } from '../services/home/production.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../utill/constants/constant';
// import * as html2canvas from "html2canvas";
import jsPDF from 'jspdf'
// import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';

import * as moment from 'moment';

@Component({
  selector: 'app-exportpage',
  templateUrl: './exportpage.component.html',
  styleUrls: ['./exportpage.component.scss']
})
export class ExportpageComponent implements OnInit {

  date: Date;
  count: number;
  PrintModelData: any;
  username: string;
  total: any;
  value: number = 0;
  today: String;
  totalPages: Number = 0;
  hours: Number;
  percent: any;
  progressFurnaces: any;
  fullList: any;
  fullLiss: any;
  pagecontent: any;
  pagecount: number;
  formlinesnamelist: any;
  Furnaces: any;
  daylist: any;
  formlines: any;
  y: any;
  test: any;
  // num:number = 5;
  datelist: any;
  Arr = Array;
  // public datelist={};
  public exportDetails = {};
  public loading = true;
  constructor(
    private router: Router,
    private productionService: ProductionService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    public constant: Constant,
    // private pdfmake: PdfmakeService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    if (localStorage.getItem("userName") !== null) {
      this.username = atob(localStorage.getItem("userName"));
    }
    let PrintModelData1: any = JSON.parse(atob(localStorage.getItem("printModelData")));
    this.PrintModelData = JSON.parse(atob(localStorage.getItem("printModelData")));
    this.fullList = [];

    // for (let i = 0; i < this.PrintModelData.NoOfWeeks; i++) {
    //   let beginDate = new Date(this.getDateStringFormat(this.PrintModelData.BeginingWeekStartDate));
    //   beginDate.setDate(beginDate.getDate() + i * 7)
    //   this.ExportSchedules(this.getDateStringFormat(beginDate));
    // }

    // for (let i = 0; i < this.PrintModelData.NoOfWeeks; i++) {
    this.count = 1;
    console.log('this.PrintModelData', this.PrintModelData);
    let beginDate = new Date(this.getDateStringFormat(this.PrintModelData.BeginingWeekStartDate));
    // beginDate.setDate(beginDate.getDate() + i * 7)
    this.ExportSchedules(this.getDateStringFormat(beginDate));
    // }
    this.getDateAMPMExportFormat();

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
    // for (let m = 0; m < data.length; m++) {
    // let chartData = data[m].FormingLines;
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
                left: ((taskStart - startDate) * 100 / dateDiff) + '%',
              };
            } else {
              obj = {
                left: 0,
              };
            }
            if (endDate - taskEndDate >= 0) {
              obj.right = ((100 - (dateDiff - (endDate - taskEndDate)) * 100 / dateDiff)) + '%';
            } else {
              obj.right = 0;
            }

            if (chartData[i].Days[j].Tasks[k].CurrentTaskStatus !== undefined) {
              // obj.background = chartData[i].Days[j].Tasks[k].CurrentTaskStatus.TaskStatusColor;
              // obj.color = chartData[i].Days[j].Tasks[k].CurrentTaskStatus.TaskStatusTextColor;
              chartData[i].Days[j].Tasks[k].style = obj;
              // let objbreif: any;
              // objbreif = {
              //   background: chartData[i].Days[j].Tasks[k].CurrentTaskStatus.TaskStatusBriefColor,
              // };
              // chartData[i].Days[j].Tasks[k].stylebreif = objbreif;

              /* If brief section is not there then padding */
              // if (!chartData[i].IsFurnaceTagged) {
              //   chartData[i].Days[j].Tasks[k].className = 'p-l-10';
              // }
            }
          }
        }
      }
    }
    // }
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

  ExportSchedules(selectedDate): void {
    let PrintModelData: any = JSON.parse(atob(localStorage.getItem("printModelData")));
    PrintModelData.BeginingWeekStartDate = selectedDate;
    this.loading = true;
    this.productionService.exportSchedulesSaveAPI('', PrintModelData, response => {
      if (response.responseCode === 200) {
        this.loading = false;
        this.exportDetails = response.data;
        this.datelist = this.exportDetails;
        console.log('this.datelist', this.datelist);
        // this.test = this.datelist;

        for (var i = 0; i < this.datelist.SchGroups.length; i++) {
          for (var j = 0; j < this.datelist.SchGroups[i].pages.length; j++) {
            this.totalPages = this.totalPages + (this.datelist.SchGroups[i].NoOfPages);
          }
          this.datelist.SchGroups[i].startDay = this.datelist.BeginingWeekStartDate;
          this.datelist.SchGroups[i].endday = this.datelist.BeginingWeekEndDate;
        }

        for (var i = 0; i < this.datelist.SchGroups.length; i++) {
          for (var j = 0; j < this.datelist.SchGroups[i].pages.length; j++) {
            for (var m = 0; m < this.datelist.SchGroups[i].pages[j].FormingLines.length; m++) {
              for (var n = 0; n < this.datelist.SchGroups[i].pages[j].FormingLines[m].Days.length; n++) {
                this.datelist.SchGroups[i].weekdays = (this.datelist.SchGroups[i].pages[j].FormingLines[m].Days);
              }
            }

          }
        }
        this.test = this.datelist;
        // console.log(this.test);
        // for(var t=this.test.length;t>0;t--){
        //   this.fullList.push(this.test[t].SchGroups);      
        // }

        this.formlines = this.datelist.SchGroups[0].pages[0].FormingLines[0];
        if (response.data.SchGroups[0].ProductionType == 'Primary') {
          if (this.datelist.SchGroups[0].pages[0].TonStates[0]) {
            this.progressFurnaces = this.datelist.SchGroups[0].pages[0].TonStates[0].Furnaces;
          }
        }
        for (var i = 0; i < this.datelist.SchGroups.length; i++) {

          for (var j = 0; j < this.datelist.SchGroups[i].pages.length; j++) {
            this.parseChartData(this.datelist.SchGroups[i].pages[j]);
          }
        }
        console.log('datelist', this.datelist);

        for (var i = 0; i < this.datelist.SchGroups.length; i++) {
          for (var j = 0; j < this.datelist.SchGroups[i].pages.length; j++) {
            // this.parseChartData(this.datelist.SchGroups[i].pages[j]);
            // this.totalPages=this.totalPages + (this.datelist.SchGroups[i].NoOfPages);
            // this.value=this.value+1;
            // (this.datelist.SchGroups[i].pages[j].pagenumber)=this.value;

            for (var m = 0; m < this.datelist.SchGroups[i].pages[j].FormingLines.length; m++) {

              for (var n = 0; n < this.datelist.SchGroups[i].pages[j].FormingLines[m].Days.length; n++) {
                for (var v = 0; v < this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks.length; v++) {
                  // console.log(this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v]);
                  if (this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v].BeginDate < this.datelist.SchGroups[i].pages[j].ProductionWeekStartDate) {
                    // this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v].BeginDate = this.datelist.SchGroups[i].pages[j].ProductionWeekStartDate;
                    this.hours = (new Date(this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v].EndDate).valueOf() - new Date(this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v].BeginDate).valueOf()) / 36e5;
                    this.percent = (Number(this.hours) / 8) * 100;
                    this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v].percent = this.percent;
                    // console.log(this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v]);              
                  } else {
                    // this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v].BeginDate = this.datelist.SchGroups[i].pages[j].ProductionWeekStartDate;
                    this.hours = (new Date(this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v].EndDate).valueOf() - new Date(this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v].BeginDate).valueOf()) / 36e5;
                    this.percent = (Number(this.hours) / 8) * 100;
                    this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v].percent = this.percent;
                    // console.log(this.datelist.SchGroups[i].pages[j].FormingLines[m].Days[n].Tasks[v]);
                  }
                }
              }
            }

          }
        }

        this.test = this.datelist.SchGroups;
        console.log(this.test);
        for (let i = 0; i < this.test.length; i++) {
          for (let j = 0; j < this.test[i].pages.length; j++) {
           // for (let k = 0; k < this.test[i].pages[j].length; k++) {
              for (let l = 0; l < this.test[i].pages[j].TonStates.length; l++) {
                for (let m = 0; m < this.test[i].pages[j].TonStates[l].Furnaces.length; m++) {
                  this.test[i].pages[j].TonStates[l].Furnaces[3] = {
                    Country:null,
                    CurrentUtilization: this.test[i].pages[j].TonStates[l].Furnaces[0].CurrentUtilization+
                                        this.test[i].pages[j].TonStates[l].Furnaces[1].CurrentUtilization+
                                        this.test[i].pages[j].TonStates[l].Furnaces[2].CurrentUtilization,
                    DefaultCapacity:this.test[i].pages[j].TonStates[l].Furnaces[0].DefaultCapacity+
                                    this.test[i].pages[j].TonStates[l].Furnaces[1].DefaultCapacity+
                                    this.test[i].pages[j].TonStates[l].Furnaces[2].DefaultCapacity,
                    FurnaceCapacityDetails:null,
                    FurnaceId:3,
                    FurnaceName:"Total US1-3"
                  };
                }

              }

            //}

          }
        }
        this.fullList.push(this.test);
        console.log(this.fullList);
        this.value = 0;
        for (var i = 0; i < this.fullList.length; i++) {
          for (var j = 0; j < this.fullList[i].length; j++) {
            for (var k = 0; k < this.fullList[i][j].pages.length; k++) {
              // console.log('11',this.fullList[i][j].pages[k]);
              this.value = this.value + 1;
              this.fullList[i][j].pages[k].pagenumber = this.value;
              this.total = this.fullList[i][j].pages[k].pagenumber;


            }

          }
        }
        // this.fullList.reverse();
        if (this.count < this.PrintModelData.NoOfWeeks) {
          let beginDate = new Date(this.getDateStringFormat(this.PrintModelData.BeginingWeekStartDate));
          beginDate.setDate(beginDate.getDate() + this.count * 7)
          this.ExportSchedules(this.getDateStringFormat(beginDate));
          this.count = this.count + 1;

        }



        // for (let i = 1; i < this.PrintModelData.NoOfWeeks; i++) {
        //   let beginDate = new Date(this.getDateStringFormat(this.PrintModelData.BeginingWeekStartDate));
        //   beginDate.setDate(beginDate.getDate() + i * 7)
        //   this.ExportSchedules(this.getDateStringFormat(beginDate));
        // }

      } else {
        this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        this.loading = false;
      }

    }, error => {
      this.loading = false;
    });
    // console.log('ListArray',this.fullList);
  }

  onPrint() {
    var header = document.getElementById("headerContainer");
    header.style.display = "none";
    window.print();
    setTimeout(() => {
      if (header.style.display === "none") {
        header.style.display = "block";
      }
    }, 100);
  }
  download() {
    let doc = new jsPDF();
    const elementToPrint = document.getElementById('test2'); //The html element to become a pdf

    doc.addHTML(elementToPrint, () => {
      doc.save('web.pdf');
    });

  }

  closeExport() {
    const link: any = [this.router.url.replace(/\/exportpage.*/, '')];
    this.router.navigate(link);
  }
  getDateAMPMExportFormat(): any {
    /*var beginDate = new Date();
    const startTime = beginDate.getHours();
    var startTimeType = 'AM';
    var startHour = startTime;
    var startTimeFinal;
    if (startHour >= 13) {
    startHour = startTime - 12;
    startTimeType = 'PM';
    startTimeFinal = startHour + ':' + beginDate.getMinutes() + ' ' + startTimeType;
    }
    else if (startHour === 0) {
    startHour = 12;
    startTimeFinal = startHour + ':' + beginDate.getMinutes() + ' ' + startTimeType;
    }
    else if (startHour === 12) {
    startTimeType = 'PM';
    startTimeFinal = startHour + ':' + beginDate.getMinutes() + ' ' + startTimeType;
    }
    else {
    startTimeFinal = startHour + ':' + beginDate.getMinutes() + ' ' + startTimeType;
    }
    
    if (startTimeFinal === "00:00 AM") {
    startTimeFinal = '12:00 AM';
    }
    else if(startTimeFinal === "12:00 AM") {
    startTimeFinal = '12:00 PM';
    }
    var newDate = new Date(beginDate),
    newYear = newDate.getFullYear(),
    newMonth = ((newDate.getMonth() + 1) >= 10) ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1),
    newDay = ((newDate.getDate()) >= 10) ? (newDate.getDate()) : '0' + (newDate.getDate());
    var newDateString = newMonth + '.' + newDay + '.' + newYear + ' ' + startTimeFinal;
    this.today = newDateString;*/

    this.today = moment().format('MM.DD.YYYY hh:mm A');
  }
}
