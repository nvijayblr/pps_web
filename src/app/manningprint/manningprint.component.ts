import { Component, OnInit, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SharedService } from '../services/home/shared.service';
import { ManningService } from '../services/home/manning.service';
import { Constant } from '../utill/constants/constant';

import * as moment from 'moment';

@Component({
  selector: 'app-manningprint',
  templateUrl: './manningprint.component.html',
  styleUrls: ['./manningprint.component.css']
})
export class ManningprintComponent implements OnInit {

  public loading = false;
  public printModelData: any;
  public exportDetails = [];
  public today: String;
  public username: string;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private manningService: ManningService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    public constant: Constant
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    if (localStorage.getItem("userData") === null) {
      this.onSessionToastMessage();
      this.gotoLogin();
    }
    if (localStorage.getItem("userName") !== null) {
      this.username = atob(localStorage.getItem("userName"));
    }
    this.today = moment().format('MM.DD.YYYY hh:mm A');
    this.printModelData = JSON.parse(atob(localStorage.getItem("printManningData")));
    let beginDate = new Date(this.getDateStringFormat(this.printModelData.FromDate));
    this.ExportSchedules(this.getDateStringFormat(beginDate));
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

  gotoLogin(): void {
    setTimeout(() => {
      const link = ['login'];
      this.router.navigate(link);
    }, this.constant.minToastLife);
  }

  closeExport() {
    const link: any = [this.router.url.replace(/\/manningprint.*/, '')];
    this.router.navigate(link);
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

  ExportSchedules(selectedDate): void {
    let printModelData: any = JSON.parse(atob(localStorage.getItem("printManningData")));
    printModelData.FromDate = selectedDate;
    this.loading = true;
    this.manningService.exportManningPacks(printModelData, response => {
      if (response.responseCode === 200) {
        this.loading = false;
        this.exportDetails = response.data.data;
        for (var i = 0; i < this.exportDetails.length; i++) {
          this.exportDetails[i].weekdays = (this.exportDetails[i].Estimations);
        }
      } else {
        this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        this.loading = false;
      }
    }, error => {
      this.loading = false;
    });
  }

}
