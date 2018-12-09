import { Component, OnInit, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import * as moment from 'moment';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../../../../utill/constants/constant';
import { ProductionService } from '../../../../services/home/production.service';
import { SharedService } from '../../../../services/home/shared.service';
import { LoginService } from '../../../../services/login/login.service';

@Component({
  selector: 'app-configurefurnacecapacity',
  templateUrl: './configurefurnacecapacity.component.html',
  styleUrls: ['./configurefurnacecapacity.component.css']
})
export class ConfigurefurnacecapacityComponent implements OnInit {

  public isEditDefaultFurnaceCapacity = false;
  public minDate: any;
  public loading = false;
  public furnace;
  public editFurnacePopUp = false;
  public defaultFurnacePopUp = false;
  public defaultFurnaceListCopy: any;
  public US1Show = false;
  public US2Show = false;
  public US3Show = false;
  public deletePopUpShow = false;
  public deleteData;
  public defaultDate;
  public retreiveData = [
    {
      "FurnaceId": 1,
      "FurnaceName": "US1",
      "DefaultCapacity": '',
      "CurrentUtilization": 0,
      "Country": null,
      "FurnaceCapacityDetails": null
    }
  ]
  public furnaceHistoryDetails: any;
  public defaultFurnaceList = [
    {
      "FurnaceId": 1,
      "FurnaceName": "US1",
      "DefaultCapacity": 100,
      "CurrentUtilization": 0,
      "Country": null,
      "FurnaceCapacityDetails": null
    },
    {
      "FurnaceId": 2,
      "FurnaceName": "US2",
      "DefaultCapacity": 100,
      "CurrentUtilization": 0,
      "Country": null,
      "FurnaceCapacityDetails": null
    },
    {
      "FurnaceId": 3,
      "FurnaceName": "US3",
      "DefaultCapacity": 234,
      "CurrentUtilization": 100,
      "Country": null,
      "FurnaceCapacityDetails": null
    }
  ]



  public editFurnaceCapacityObject = {
    startDate: '',
    endDate: '',
    furanceId: '0',
    newCapacity: ''
  }

  constructor(
    private router: Router,
    private toastr: ToastsManager,
    public constant: Constant,
    private productionService: ProductionService,
    private vcr: ViewContainerRef,
    private sharedService: SharedService,
    private loginService: LoginService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    if (localStorage.getItem("userData") === null) {
      this.onSessionToastMessage();
      this.gotoLogin();
    } else {
      this.minDate = new Date();
      this.minDate.setDate(this.minDate.getDate() - 1);
      this.defaultDate = new Date();
      this.getDefaultFurnaceListFromAPI();
      this.getFurnaceHistoryDetailsFromAPI();
    }
  }

  gotoLogin(): void {
    setTimeout(() => {
      const link = ['login'];
      this.router.navigate(link);
    }, this.constant.minToastLife);
  }

  checkAccess(): void {
    if (this.router.url.indexOf('primary') !== -1) {
      let primaryAccess = this.loginService.getUserTransaction(this.constant.moduleArray[0]);
      if (primaryAccess !== true) {
        this.noAccess();
      }
    }
  }

  noAccess(): void {
    this.noAccessToastMessage();
    this.gotoLogin();
  }

  noAccessToastMessage(): void {
    this.loading = false;
    this.toastr.error(this.constant.noAccessMsg, 'Failure!', {
      showCloseButton: true, maxShown: 1
    });
  }

  onSessionToastMessage(): void {
    this.loading = false;
    this.toastr.error(this.constant.sessionMsg, 'Failure!', {
      showCloseButton: true, maxShown: 1
    });
  }

  backFromConfigureFurnaceCapacity() {
    const link: any = [this.router.url.replace(/\/configurefurnacecapacity.*/, '')];
    this.router.navigate(link);
  }
  onActionEditButtonClick(details, j) {
    details.isEdit = true;

  }
  onActioncancelButtonClick(details) {
    details.isEdit = false;
    this.getFurnaceHistoryDetailsFromAPI();
  }
  onDeleteYes() {
    this.loading = true
    this.productionService.getFurnaceHistoryDeleteAPI(this.deleteData.FurnaceCapacityDetailsId, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        this.getFurnaceHistoryDetailsFromAPI();
        this.deletePopUpShow = false;
        this.toastr.success("Deleted Successfully", 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });

      }

      else {
        console.log(response);
        this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }

    }, error => {

    });

  }
  onDeleteNo() {
    this.deletePopUpShow = false;

  }
  onDeleteButtonClick(details) {
    this.deletePopUpShow = true;
    this.deleteData = details;
    // this.loading = true
    // this.productionService.getFurnaceHistoryDeleteAPI(details.FurnaceCapacityDetailsId, response => {
    //   this.loading = false;
    //   if (response.responseCode === 200) {
    //     this.getFurnaceHistoryDetailsFromAPI();
    //          this.toastr.success("Deleted Successfully", 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });

    //   }

    //   else {
    //     console.log(response);
    //     this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    //   }

    // }, error => {

    // });

  }
  onActionSaveButtonClick(details) {
    this.loading = true
    this.productionService.saveFurnaceHistoryCapacityAPI(details, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        details.isEdit = false;
        this.getFurnaceHistoryDetailsFromAPI();
        this.toastr.success("Saved Successfully", 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });

      } else {
        // console.log(response);
        this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }

    }, error => {

    });
  }


  onOkClick() {
    this.editFurnacePopUp = false;
  }
  onRetrieveEditButtonClick() {
    this.retreiveData[0].DefaultCapacity = '';
    if (this.editFurnaceCapacityObject.furanceId === '0') {
      this.toastr.error("Please select Furnace", 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });

    }
    else if (!this.editFurnaceCapacityObject.startDate) {
      this.toastr.error("Please select From Date", 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
    else if (!this.editFurnaceCapacityObject.endDate) {
      this.toastr.error("Please select To Date", 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    } else if (new Date(this.editFurnaceCapacityObject.startDate).getTime() >= new Date(this.editFurnaceCapacityObject.endDate).getTime()) {
      this.toastr.error("From Date should not be greater than or equal to the To Date in Edit Furnace Capacity", 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
    else {
      this.loading = true
      this.productionService.retrieveButtonAPI(this.editFurnaceCapacityObject, response => {
        this.loading = false;
        if (response.responseCode === 200) {
          this.retreiveData = (response.data) ? response.data : [];

        } else if (response.responseCode === -403) {
          //this.editFurnacePopUp = true;
          this.toastr.error(this.furnace, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });

        }
        else {
          console.log(response);
          this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        }

      }, error => {

      });
    }

  }

  furnaceSelected() {
    if (this.editFurnaceCapacityObject.furanceId === "1") {
      this.furnace = "A custom value for US1 is already changed for dates in the selected range. Please select correct dates."
    }
    else if (this.editFurnaceCapacityObject.furanceId === "2") {
      this.furnace = "A custom value for US2 is already changed for dates in the selected range. Please select correct dates."
    } else if (this.editFurnaceCapacityObject.furanceId === "3") {
      this.furnace = "A custom value for US3 is already changed for dates in the selected range. Please select correct dates."
    }
  }
  defaultFurnaceCapacityEdit() {
    this.isEditDefaultFurnaceCapacity = true;
  }

  defaultFurnaceCapacityCancel() {
    this.isEditDefaultFurnaceCapacity = false;
    this.getDefaultFurnaceListFromAPI();
  }

  defaultFurnacePopUpCancel() {
    this.defaultFurnacePopUp = false;
  }
  defaultFurnaceCapacity() {
    this.US1Show = false;
    this.US2Show = false;
    this.US3Show = false;
    this.defaultFurnacePopUp = false;
    let a = parseInt(this.defaultFurnaceListCopy[0].DefaultCapacity);
    let b = parseInt(this.defaultFurnaceListCopy[1].DefaultCapacity);
    let c = parseInt(this.defaultFurnaceListCopy[2].DefaultCapacity);

    let d = (this.defaultFurnaceList[0].DefaultCapacity).toString();
    let e = (this.defaultFurnaceList[1].DefaultCapacity).toString(); 
    let f=(this.defaultFurnaceList[2].DefaultCapacity).toString(); 
    if (d === '' || e==='' ||f==='' ) {
      this.toastr.error('Fields cannot be left blank', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    } else{
    if (this.defaultFurnaceList[0].DefaultCapacity != a) {
      this.defaultFurnacePopUp = true;
      this.US1Show = true;
    }
    if (this.defaultFurnaceList[1].DefaultCapacity != b) {
      this.defaultFurnacePopUp = true;
      this.US2Show = true;
    }
    if (this.defaultFurnaceList[2].DefaultCapacity != c) {
      this.defaultFurnacePopUp = true;
      this.US3Show = true;
    }
    if (this.defaultFurnaceList[0].DefaultCapacity === a &&
      this.defaultFurnaceList[1].DefaultCapacity === b &&
      this.defaultFurnaceList[2].DefaultCapacity === c) {
      this.isEditDefaultFurnaceCapacity = false;
      // this.toastr.success("Saved Successfully", 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
  }
  }
  defaultFurnaceCapacitySave() {
    this.loading = true
    this.productionService.saveDefaultCapacityAPI(this.defaultFurnaceList, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        this.isEditDefaultFurnaceCapacity = false;
        this.defaultFurnacePopUp = false;
        this.getDefaultFurnaceListFromAPI();
        this.toastr.success("Saved Successfully", 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });

      } else {
        this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }

    }, error => {

    });

  }
  editFurnaceCapacityReset() {
    //this.defaultDate = new Date();
    this.editFurnaceCapacityObject = {
      startDate: '',
      endDate: '',
      furanceId: '0',
      newCapacity: ''
    }
    this.retreiveData = [{
      "FurnaceId": 1,
      "FurnaceName": "US1",
      "DefaultCapacity": '',
      "CurrentUtilization": 0,
      "Country": null,
      "FurnaceCapacityDetails": null
    }];
  }
  editFurnaceCapacitySave() {
    if (this.editFurnaceCapacityObject.furanceId === '0') {
      this.toastr.error("Please select Furnace", 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });

    }
    else if (!this.editFurnaceCapacityObject.startDate) {
      this.toastr.error("Please select From Date", 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
    else if (!this.editFurnaceCapacityObject.endDate) {
      this.toastr.error("Please select To Date", 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
    else if (!this.editFurnaceCapacityObject.newCapacity) {
      this.toastr.error("Please fill New Capacity", 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
    else if (new Date(this.editFurnaceCapacityObject.startDate).getTime() >= new Date(this.editFurnaceCapacityObject.endDate).getTime()) {
      this.toastr.error("From Date should not be greater than or equal to the To Date in Edit Furnace Capacity", 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    } else {
      this.loading = true
      this.productionService.saveFurnaceCapacityAPI(this.editFurnaceCapacityObject, response => {
        this.loading = false;
        if (response.responseCode === 200) {
          //location.reload();
          this.editFurnaceCapacityReset();
          this.getFurnaceHistoryDetailsFromAPI();

          //this.defaultDate = new Date();
          this.toastr.success("Saved Successfully", 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });

        } else if (response.responseCode === -403) {
          //this.editFurnacePopUp = true;
          this.toastr.error(this.furnace, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });

        } else {
          // console.log(response);
          this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        }

      }, error => {

      });
    }
  }

  getDefaultFurnaceListFromAPI(): void {
    this.loading = true;
    this.productionService.getDefaultFurnaceListFromAPIDetails('', response => {
      this.loading = false;
      if (response.responseCode === 200) {
        this.defaultFurnaceList = (response.data) ? response.data : [];
        this.defaultFurnaceListCopy = JSON.parse(JSON.stringify(response.data))
        //this.defaultFurnaceListCopy = Object.assign({}, response.data)
        //this.defaultFurnaceListCopy = (response.data) ? response.data : [];
      } else {
      }
    }, error => {
      // this.loading = false;
    });
  }

  getFurnaceHistoryDetailsFromAPI(): void {
    this.loading = true;
    this.productionService.getFurnaceHistoryFromAPIDetails('', response => {
      this.loading = false;
      if (response.responseCode === 200) {
        // console.log(response);
        this.furnaceHistoryDetails = (response.data) ? response.data : [];
        for (let i = 0; i < this.furnaceHistoryDetails.length; i++) {
          for (let j = 0; j < this.furnaceHistoryDetails[i].FurnaceCapacityDetails.length; j++) {
            this.furnaceHistoryDetails[i].FurnaceCapacityDetails[j].FurnaceCapacityFromDate = this.getDateAMPMFormat(this.furnaceHistoryDetails[i].FurnaceCapacityDetails[j].FurnaceCapacityFromDate);
            this.furnaceHistoryDetails[i].FurnaceCapacityDetails[j].FurnaceCapacityToDate = this.getDateAMPMFormat(this.furnaceHistoryDetails[i].FurnaceCapacityDetails[j].FurnaceCapacityToDate);
          }
        }
      } else {
        // console.log(response);
      }
    }, error => {
      // this.loading = false;
    });
  }

  /**Get AM PM date string format */
  getDateAMPMFormat(beginDate): any {
    const startDate = beginDate.replace('T', ' ');
    const startTimeObj1 = startDate.split(' ');
    const startTimeObj2 = startTimeObj1[1];
    const startTimeFormat = startTimeObj2.split(':');
    const startTime = startTimeFormat[0];
    var startTimeType = 'AM';
    var startHour = startTime;
    var startTimeFinal;
    if (startHour >= 13) {
      startHour = startTime - 12;
      startTimeType = 'PM';
      startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else if (startHour === 0) {
      startHour = 12;
      startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else if (startHour === 12) {
      startTimeType = 'PM';
      startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }
    else {
      startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
    }

    if (startTimeFinal === "00:00 AM") {
      startTimeFinal = '12:00 AM';
    }
    else if (startTimeFinal === "12:00 AM") {
      startTimeFinal = '12:00 PM';
    }

    var newDate = this.dateTimeFormatForTimeZone(beginDate);
    var newYear = newDate.getFullYear(),
      newMonth = ((newDate.getMonth() + 1) >= 10) ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1),
      newDay = ((newDate.getDate()) >= 10) ? (newDate.getDate()) : '0' + (newDate.getDate());
    var newDateString = newMonth + '/' + newDay + '/' + newYear;
    return newDateString;
  }
  dateTimeFormatForTimeZone(value) {
    var date = new Date();
    var newDate = value.split('T')[0].split('-');
    date.setFullYear(parseInt(newDate[0]));
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
}
