import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ManningService } from '../../../../services/home/manning.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../../../../utill/constants/constant';
import { LoginService } from '../../../../services/login/login.service';

@Component({
  selector: 'app-master-inputs',
  templateUrl: './master-inputs.component.html',
  styleUrls: ['./master-inputs.component.css']
})
export class MasterInputsComponent implements OnInit {
  date2MinDate: any;

  public errorDates = [];
  public manningLiButtons = [];
  public isLiItemClicked = 'Master Inputs';
  public loading = false;
  public isEditManningRole = false;
  public apiData: any;
  public weekStartday;
  public weekEndday;
  public defaultDay;
  public weekDays = [];
  public timeSlot = [];
  public crewDetail: any;
  public crewDetailsDay = [];
  public isEditManningCrew = false;
  public crewList = [];
  public selectedCrew = '0';
  public selectedCrewName = '';
  public loadingRole = false;
  public loadingCrew = false;
  public weekstart;
  public sumA = 0;
  public sumB = 0;
  public sumC = 0;
  public sumD = 0;
  public isCrewSumValid = false;
  public manningAccess = null; /* null=noAccess ; false=viewAccess; true=fullAccess */

  constructor(
    private router: Router,
    private manningService: ManningService,
    private toastr: ToastsManager,
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
      this.checkAccess();
      this.manningAccess = this.loginService.getUserTransaction(this.constant.moduleArray[5]);
      this.date2MinDate = new Date();
      this.date2MinDate.setDate(this.date2MinDate.getDate() - 1);
      this.addManningLiButtons();
      this.loadManningCrew();
      const currentDateString = this.getDateStringFormat(new Date());
      this.loadDataOfManningRole(currentDateString);
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

  /*Tab click event for view switching*/
  onLiBtnclick(name): void {
    this.isLiItemClicked = name;
    if (name === 'Calculate Manning') {
      const link = ['dashboard/manning'];
      this.router.navigate(link);
    }
    else if (name === 'Master Inputs') {
      const link = ['dashboard/masterInputs'];
      this.router.navigate(link);
    }
  }

  /*For loading crew list*/
  loadManningCrew(): void {
    this.loading = true;
    this.manningService.getManningCrew(response => {
      this.loading = false;
      if (response.responseCode === 200) {
        this.crewList = response.data;
        this.selectedCrew = response.data[0].CrewId;
        this.selectedCrewName = response.data[0].CrewisplayName;
        const currentDateString = this.getDateStringFormat(new Date());
        this.loadDataOfManningCrew(currentDateString);
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

  /*For loading manning role details*/
  loadDataOfManningRole(dateString): void {
    this.loadingRole = true;
    let reqBody = {
      FromDate: dateString
    };
    this.manningService.getManningRoleDetails(reqBody, response => {
      this.loadingRole = false;
      this.weekDays = [];
      if (response.responseCode === 200) {
        this.apiData = response;
        this.weekStartday = this.getDateStringFormat(this.apiData.data.FromDate);
        this.weekstart = this.weekStartday;
        this.defaultDay = new Date(this.weekStartday);
        this.defaultDay.setDate(this.defaultDay.getDate());
        this.weekEndday = this.getDateStringFormat(this.apiData.data.ToDate);
        this.weekDays = this.apiData.data.ManningRoleMasterDay;

        for (let i = 0; i < this.apiData.data.ManningRoleMasterDay.length; i++) {
          for (let j = 0; j < this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift.length; j++) {
            // For disabling crew A
            if (this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewName === 'CrewA') {
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].enableEdit = true;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewA_Vaccation = this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].Vacation;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewA_Absent = this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].Absence;

            } else {
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].enableEdit = false;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewA_Vaccation = '';
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewA_Absent = '';
            }
            // For disabling crew D
            if (this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewName === 'CrewD') {
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].enableEditD = true;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewD_Vaccation = this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].Vacation;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewD_Absent = this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].Absence;

            } else {
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].enableEditD = false;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewD_Vaccation = '';
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewD_Absent = '';

            }
            // For disabling crew C
            if (this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewName === 'CrewC') {
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].enableEditC = true;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewC_Vaccation = this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].Vacation;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewC_Absent = this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].Absence;

            } else {
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].enableEditC = false;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewC_Vaccation = '';
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewC_Absent = '';


            }
            // For disabling crew B
            if (this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewName === 'CrewB') {
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].enableEditB = true;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewB_Vaccation = this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].Vacation;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewB_Absent = this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].Absence;

            } else {
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].enableEditB = false;
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewB_Vaccation = '';
              this.apiData.data.ManningRoleMasterDay[i].ManningRoleShift[j].CrewB_Absent = '';

            }
          }


        }

        this.loadDaysTimeSlot(this.weekDays);
      } else {
        this.toastr.clearAllToasts();
        this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loadingRole = false;
      this.toastr.clearAllToasts();
      this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }

  /*For loading manning crew details*/
  loadDataOfManningCrew(dateString): void {
    this.loadingCrew = true;
    let reqBody = {
      FromDate: dateString
    };
    this.manningService.getManningCrewDetails(reqBody, this.selectedCrew, response => {
      this.loadingCrew = false;
      if (response.responseCode === 200) {
        this.crewDetail = response;
        this.crewDetailsDay = this.crewDetail.data;
      } else {
        this.toastr.clearAllToasts();
        this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loadingCrew = false;
      this.toastr.clearAllToasts();
      this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }

  /*Crew selection event */
  selectedCrewChange(): void {
    for (var i = 0; i < this.crewList.length; i++) {
      if (this.crewList[i].CrewId == this.selectedCrew) {
        this.selectedCrewName = this.crewList[i].CrewisplayName;
      }
    }
    var fromDate = new Date(this.apiData.data.FromDate);
    var fromDateString = this.getDateStringFormat(fromDate);
    this.loadDataOfManningCrew(fromDateString);
  }

  /*Master input role edit event */
  masterInputEdit(): void {
    this.isEditManningRole = true;
  }

  /*Master input role details edit and save functionality */
  masterInputSave(): void {
    this.errorDates = [];
    this.sumA = 0;
    this.sumB = 0;
    this.sumC = 0;
    this.sumD = 0;
    this.isCrewSumValid = false;


    for (var i = 0; i < this.weekDays.length; i++) {
      for (var j = 0; j < this.weekDays[i].ManningRoleShift.length; j++) {
        if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewA') {
          this.sumA = Number(this.weekDays[i].ManningRoleShift[j].CrewA_Absent) +
            Number(this.weekDays[i].ManningRoleShift[j].CrewA_Vaccation);
          if (this.sumA > this.crewDetailsDay[i].CrewDetails[0].CrewLevel) {
            this.errorDates.push(this.getDateStringFormat(this.crewDetailsDay[i].CrewDetailsDate));
            this.toastr.error('Sum of people on vacation and absent for crew A is more than crew level on ' + this.errorDates, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            this.isCrewSumValid = true;
            return;
          }
        }
        else if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewB') {
          this.sumB = Number(this.weekDays[i].ManningRoleShift[j].CrewB_Absent) +
            Number(this.weekDays[i].ManningRoleShift[j].CrewB_Vaccation);
          if (this.sumB > this.crewDetailsDay[i].CrewDetails[1].CrewLevel) {
            this.errorDates.push(this.getDateStringFormat(this.crewDetailsDay[i].CrewDetailsDate));
            this.toastr.error('Sum of people on vacation and absent for crew B is more than crew level on ' + this.errorDates, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            this.isCrewSumValid = true;
            return;
          }
        }
        else if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewC') {
          this.sumC = Number(this.weekDays[i].ManningRoleShift[j].CrewC_Absent) +
            Number(this.weekDays[i].ManningRoleShift[j].CrewC_Vaccation);
          if (this.sumC > this.crewDetailsDay[i].CrewDetails[2].CrewLevel) {
            this.errorDates.push(this.getDateStringFormat(this.crewDetailsDay[i].CrewDetailsDate));
            this.toastr.error('Sum of people on vacation and absent for crew C is more than crew level on ' + this.errorDates, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            this.isCrewSumValid = true;
            return;
          }
        }
        else if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewD') {
          this.sumD = Number(this.weekDays[i].ManningRoleShift[j].CrewD_Absent) +
            Number(this.weekDays[i].ManningRoleShift[j].CrewD_Vaccation);
          if (this.sumD > this.crewDetailsDay[i].CrewDetails[3].CrewLevel) {
            this.errorDates.push(this.getDateStringFormat(this.crewDetailsDay[i].CrewDetailsDate));
            this.toastr.error('Sum of people on vacation and absent for crew D is more than crew level on ' + this.errorDates, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            this.isCrewSumValid = true;
            return;
          }
        }
      }
    }
    for (var i = 0; i < this.weekDays.length; i++) {
      for (var j = 0; j < this.weekDays[i].ManningRoleShift.length; j++) {
        if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewA') {
          this.weekDays[i].ManningRoleShift[j].Vacation = this.weekDays[i].ManningRoleShift[j].CrewA_Vaccation;
          delete this.weekDays[i].ManningRoleShift[j].CrewA_Vaccation;
          this.weekDays[i].ManningRoleShift[j].Absence = this.weekDays[i].ManningRoleShift[j].CrewA_Absent;
          delete this.weekDays[i].ManningRoleShift[j].CrewA_Absent;

          delete this.weekDays[i].ManningRoleShift[j]['CrewB_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewB_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewC_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewC_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewD_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewD_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEdit'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditB'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditC'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditD'];
        }
        if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewB') {
          this.weekDays[i].ManningRoleShift[j].Vacation = this.weekDays[i].ManningRoleShift[j].CrewB_Vaccation;
          delete this.weekDays[i].ManningRoleShift[j].CrewB_Vaccation;
          this.weekDays[i].ManningRoleShift[j].Absence = this.weekDays[i].ManningRoleShift[j].CrewB_Absent;
          delete this.weekDays[i].ManningRoleShift[j].CrewB_Absent;

          delete this.weekDays[i].ManningRoleShift[j]['CrewA_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewA_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewC_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewC_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewD_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewD_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEdit'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditB'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditC'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditD'];
        }
        if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewC') {
          this.weekDays[i].ManningRoleShift[j].Vacation = this.weekDays[i].ManningRoleShift[j].CrewC_Vaccation;
          delete this.weekDays[i].ManningRoleShift[j].CrewC_Vaccation;
          this.weekDays[i].ManningRoleShift[j].Absence = this.weekDays[i].ManningRoleShift[j].CrewC_Absent;
          delete this.weekDays[i].ManningRoleShift[j].CrewC_Absent;

          delete this.weekDays[i].ManningRoleShift[j]['CrewA_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewA_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewB_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewB_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewD_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewD_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEdit'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditB'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditC'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditD'];
        }
        if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewD') {
          this.weekDays[i].ManningRoleShift[j].Vacation = this.weekDays[i].ManningRoleShift[j].CrewD_Vaccation;
          delete this.weekDays[i].ManningRoleShift[j].CrewD_Vaccation;
          this.weekDays[i].ManningRoleShift[j].Absence = this.weekDays[i].ManningRoleShift[j].CrewD_Absent;
          delete this.weekDays[i].ManningRoleShift[j].CrewD_Absent;

          delete this.weekDays[i].ManningRoleShift[j]['CrewA_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewA_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewB_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewB_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewC_Vaccation'];
          delete this.weekDays[i].ManningRoleShift[j]['CrewC_Absent'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEdit'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditB'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditC'];
          delete this.weekDays[i].ManningRoleShift[j]['enableEditD'];
        }
      }
    }
    if (!this.isCrewSumValid) {
    this.loadingRole = true;
    this.manningService.editManningRoles(this.weekDays, response => {
      this.loadingRole = false;
      if (response.responseCode === 200) {
        this.toastr.success(response.responseMsg, 'Manning Role Details saved successfully!', { showCloseButton: true, maxShown: 1 });
        var fromDate = new Date(this.apiData.data.FromDate);
        var fromDateString = this.getDateStringFormat(fromDate);
        this.loadDataOfManningRole(fromDateString);
      } else {
        this.toastr.clearAllToasts();
        this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loadingRole = false;
      this.toastr.clearAllToasts();
      this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
    this.isEditManningRole = false;
  }
}

  /*Master input role edit cancel */
  masterInputCancel(): void {
    this.isEditManningRole = false;
    var fromDate = new Date(this.apiData.data.FromDate);
    var fromDateString = this.getDateStringFormat(fromDate);
    this.loadDataOfManningRole(fromDateString);
  }

  /*Master input crew edit event */
  masterInputCrewEdit(): void {
    this.isEditManningCrew = true;
  }

  /*Master input crew details edit and save functionality */
  masterInputCrewSave(): void {
    this.errorDates = [];
    this.sumA = 0;
    this.sumB = 0;
    this.sumC = 0;
    this.sumD = 0;
    this.isCrewSumValid = false;


    for (var i = 0; i < this.weekDays.length; i++) {
      for (var j = 0; j < this.weekDays[i].ManningRoleShift.length; j++) {
        if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewA') {
          this.sumA = Number(this.weekDays[i].ManningRoleShift[j].CrewA_Absent) +
            Number(this.weekDays[i].ManningRoleShift[j].CrewA_Vaccation);
          if (this.sumA > this.crewDetailsDay[i].CrewDetails[0].CrewLevel) {
            this.errorDates.push(this.getDateStringFormat(this.crewDetailsDay[i].CrewDetailsDate));
            this.toastr.error('Crew level of Crew A should be greater than the sum of Vacation and Absent on  ' + this.errorDates, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            this.isCrewSumValid = true;
            return;
          }
        }
        else if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewB') {
          this.sumB = Number(this.weekDays[i].ManningRoleShift[j].CrewB_Absent) +
            Number(this.weekDays[i].ManningRoleShift[j].CrewB_Vaccation);
          if (this.sumB > this.crewDetailsDay[i].CrewDetails[1].CrewLevel) {
            this.errorDates.push(this.getDateStringFormat(this.crewDetailsDay[i].CrewDetailsDate));
            this.toastr.error('Crew level of Crew B should be greater than the sum of Vacation and Absent on  ' + this.errorDates, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            this.isCrewSumValid = true;
            return;
          }
        }
        else if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewC') {
          this.sumC = Number(this.weekDays[i].ManningRoleShift[j].CrewC_Absent) +
            Number(this.weekDays[i].ManningRoleShift[j].CrewC_Vaccation);
          if (this.sumC > this.crewDetailsDay[i].CrewDetails[2].CrewLevel) {
            this.errorDates.push(this.getDateStringFormat(this.crewDetailsDay[i].CrewDetailsDate));
            this.toastr.error('Crew level of Crew C should be greater than the sum of Vacation and Absent on  ' + this.errorDates, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            this.isCrewSumValid = true;
            return;
          }
        }
        else if (this.weekDays[i].ManningRoleShift[j].CrewName === 'CrewD') {
          this.sumD = Number(this.weekDays[i].ManningRoleShift[j].CrewD_Absent) +
            Number(this.weekDays[i].ManningRoleShift[j].CrewD_Vaccation);
          if (this.sumD > this.crewDetailsDay[i].CrewDetails[3].CrewLevel) {
            this.errorDates.push(this.getDateStringFormat(this.crewDetailsDay[i].CrewDetailsDate));
            this.toastr.error('Crew level of Crew D should be greater than the sum of Vacation and Absent on  ' + this.errorDates, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            this.isCrewSumValid = true;
            return;
          }
        }
      }
    }
    // for (var i = 0; i < this.crewDetailsDay.length; i++) {
    //   if (this.crewDetailsDay[i].CrewAlevel < (parseInt(this.crewDetailsDay[i].Vaccation) + parseInt(this.crewDetailsDay[i].Absent))) {
    //     this.errorDates.push(this.getDateStringFormat(this.crewDetailsDay[i].CrewDetailsDate));
    //   }
    // }
    // if (!this.errorDates.length) {
    let a = false;
    if (!this.isCrewSumValid) {
      this.loadingCrew = true;
      this.isEditManningCrew = false;
      this.manningService.editCrewDetils(this.crewDetailsDay, response => {
        this.loadingCrew = false;
        if (response.responseCode === 200) {
          this.toastr.success(response.responseMsg, 'Crew Details saved successfully!', { showCloseButton: true, maxShown: 1 });
          var fromDate = new Date(this.apiData.data.FromDate);
          var fromDateString = this.getDateStringFormat(fromDate);
          this.loadDataOfManningCrew(fromDateString);
        } else {
          this.toastr.clearAllToasts();
          this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        }
      }, error => {
        this.loadingCrew = false;
        this.toastr.clearAllToasts();
        this.toastr.error('Internal server error.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      });
    }
    // } else {
    //   this.toastr.clearAllToasts();
    //   this.toastr.error('Sum of people on vacation and absent is more than crew level on ' + this.errorDates, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    // }
  }

  /*Master input crew edit cancel */
  masterInputCrewCancel(): void {
    this.isEditManningCrew = false;
    var fromDate = new Date(this.apiData.data.FromDate);
    var fromDateString = this.getDateStringFormat(fromDate);
    this.loadDataOfManningCrew(fromDateString);
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
    this.loadDataOfManningRole(weekPeriod[0]);
    this.loadDataOfManningCrew(weekPeriod[0]);

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
  /*For getting previous week data */
  onPreviousWeekdate(): void {
    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    if (new Date(this.apiData.data.FromDate).getTime() > prevMonday.getTime()) {
      var myDate = new Date(this.apiData.data.FromDate);
      var previousDay = new Date(myDate);
      previousDay.setDate(myDate.getDate() - 2);
      var previousDateString = this.getDateStringFormat(previousDay);
      this.loadDataOfManningRole(previousDateString);
      this.loadDataOfManningCrew(previousDateString);
    } else {
      this.toastr.clearAllToasts();
      // this.toastr.error('Previous week data not available.', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
  }

  /*For getting future week data */
  onFutureWeekdate(): void {
    var myDate = new Date(this.apiData.data.ToDate);
    var nextDay = new Date(myDate);
    nextDay.setDate(myDate.getDate() + 1);
    var nextDateString = this.getDateStringFormat(nextDay);
    this.loadDataOfManningRole(nextDateString);
    this.loadDataOfManningCrew(nextDateString);
  }

  /*For getting date in string format */
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

  /*For display time slots */
  loadDaysTimeSlot(weekDays): void {
    this.timeSlot = [];
    for (let i = 0; i < weekDays.length; i++) {
      this.timeSlot.push({
        first12: '12 AM',
        middle8: '8 AM',
        last4: '4 PM'
      })
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
}
