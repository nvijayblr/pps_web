import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { TaskService } from '../../../../../services/home/task.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Constant } from '../../../../../utill/constants/constant';
import { SharedtaskService } from '../../../../../services/home/sharedtask.service';
import { Subject } from "rxjs/Subject";

@Component({
  selector: 'app-gammeoption',
  templateUrl: './gammeoption.component.html',
  styleUrls: ['./gammeoption.component.css']
})

export class GammeoptionComponent implements OnInit {

  @Input() gammeData;
  @Output() shareGammeChangeEvent = new EventEmitter();
  @Output() shareGammeLoadEvent = new EventEmitter();
  @Output() gammeSelection = new EventEmitter();
  @Output() gammeEmpty = new EventEmitter();
  @Output() selectedLineID = new EventEmitter();

  public loading = false;
  public taskId;
  public modifyTaskDurationObject;
  public isGammeOption = false;
  public taskData;
  public showMachineListPopUp = false;
  public selectLineList = [];
  public selectedLine = '0';
  public selectedLineName;
  public isSpecialGamme = false;
  public isGammePresentForCreate = false;
  public specialGamme = {
    NChannel: '',
    MacDescription: '',
    Speed: '',
    Yield: '',
    PullTonsPerDay: '',
    Manning: '',
    Cost: '',
    Preference: '',
  };
  public selectedGamme = {
    NChannel: '',
    MacDescription: '',
    Speed: '',
    Yield: '',
    PullTonsPerDay: '',
    Manning: '',
    Cost: '',
    Preference: '',
    IsSelected: '',
    Nom: '',
    GammeId: '',
    Machine_LineId: '',
    COLD_END_MANNING_NBR: '',
    SpeedFactor: '',
    ItemNumber: '',
    LChannel: ''
  };
  private unsubscribe: Subject<void> = new Subject<void>();
  public gammeSelectedStatus = false;
  public speedFactorFlag = false;
  public descriptionArray = [];
  public descriptionArrayForAmp = [];
  public isEditMode = false;
  public itemNumber = '';
  constructor(
    private taskService: TaskService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private constant: Constant,
    private sharedTask: SharedtaskService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.sharedTask.prodSummaryToBeAssigned$.takeUntil(this.unsubscribe).subscribe(
      data => {
        if (data != null && data != undefined) {
          this.isEditMode = data.isEditMode;
          this.taskData = data;
          if (this.isEditMode) {
            this.getGammeOptionsFromAPI();
          }
        }
      });
    this.sharedTask.prodAndPackDetailsToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          data.gammeoption = this.selectedGamme;
          data.specialGamme = this.specialGamme ? this.specialGamme : [];
          data.speedFactors = this.descriptionArray;
          data.ampData = this.descriptionArrayForAmp;
          data.isGammePresentForCreate = this.isGammePresentForCreate;
        }
      });
    /*Get gamme options when select the Itemnumber from summary component*/
    this.sharedTask.itemNumberToGetGamme$.subscribe(data => {
      if (data != null && data != undefined) {
        this.itemNumber = data;
        if (!this.isEditMode) {
          this.getGammeOptionsFromAPI();
        }
      }
    });
  }

  ngOnInit() { }

  itemNumberCleared(msg) {
    this.modifyTaskDurationObject = [];
    this.isGammeOption = false;
    this.isSpecialGamme = false;
    this.selectedGamme = {
      NChannel: '',
      MacDescription: '',
      Speed: '',
      Yield: '',
      PullTonsPerDay: '',
      Manning: '',
      Cost: '',
      Preference: '',
      IsSelected: '',
      Nom: '',
      GammeId: '',
      Machine_LineId: '',
      COLD_END_MANNING_NBR: '',
      SpeedFactor: '',
      ItemNumber: '',
      LChannel: ''
    };
  }

  onCancel(): void {
    this.showMachineListPopUp = false;
    this.getGammeOptionsFromAPI();
  }

  onSave(selectedline): void {
    if (selectedline === '0') {
      this.toastr.error('Please select Line.', this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    } else {
      this.showMachineListPopUp = false;
      this.selectedLineName = selectedline.Description;
      this.sharedTask.sendSelectedLineToBeAssigned(this.selectedLineName);
      this.sendAcknowledgement(this.selectedGamme, this.selectedLineName);
    }
  }

  sendAcknowledgement(selectedGamme, selectedLineName) {
    this.loading = true
    this.taskService.sendAcknowledgementFromAPIURL(selectedGamme, this.taskData, selectedLineName, response => {
      this.loading = false;
      if (response.responseCode === 200) {
      } else {
        this.toastr.error(response.responseMsg, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }, error => {
      this.loading = false;
      this.toastr.clearAllToasts();
      this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }

  getGammeOptionsFromAPI() {
    if (this.taskData) {
      if (this.taskData.ItemNumber !== "" && this.taskData.ItemNumber !== null) {
        this.loading = true;
        this.activatedRoute.params.subscribe((params: Params) => {
          this.taskId = params['taskId'];
        });
        this.taskService.ProdTaskGammeAPI(this.taskId, this.taskData, response => {
          this.loading = false;
          if (response.responseCode === 200) {
            this.processingGammeOptions(response.data);
            if (this.isEditMode && response.data.length === 0) {
              this.isGammePresentForCreate = true;
            }
            if (!this.isEditMode && response.data.length !== 0) {
              this.checkForLineId(response.data);
            }
            if (!this.isEditMode && response.data.length === 0) {
              this.isGammePresentForCreate = true;
              this.gammeEmpty.emit('gammeempty');
              this.toastr.error('Gamme options does not exist for this item number in master table. Please contact administrator', this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            } else {
              this.gammeEmpty.emit('gammeexist')
            }
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
    }
  }

  processingGammeOptions(gammeResponse) {
    this.modifyTaskDurationObject = gammeResponse;
    if (this.modifyTaskDurationObject !== null && this.modifyTaskDurationObject.length > 0) {
      this.isGammeOption = true;
      var gammeCount = 0;
      for (var i = 0; i < this.modifyTaskDurationObject.length; i++) {
        var gamme = this.modifyTaskDurationObject[i];
        if (gamme.IsSelected) {
          localStorage.setItem('savedNChannel', btoa(gamme.NChannel));
          localStorage.setItem('savedNom', btoa(gamme.Nom));
          this.selectedGamme.NChannel = gamme.NChannel;
          this.selectedGamme.MacDescription = gamme.MacDescription;
          this.selectedGamme.Speed = gamme.Speed;
          this.selectedGamme.Yield = gamme.Yield;
          this.selectedGamme.PullTonsPerDay = gamme.PullTonsPerDay;
          this.selectedGamme.Manning = gamme.Manning;
          this.selectedGamme.Cost = gamme.Cost;
          this.selectedGamme.Preference = gamme.Preference;
          this.selectedGamme.IsSelected = gamme.IsSelected;
          this.selectedGamme.Nom = gamme.Nom;
          this.selectedGamme.GammeId = gamme.GammeId;
          this.selectedGamme.Machine_LineId = gamme.Machine_LineId;
          this.selectedGamme.COLD_END_MANNING_NBR = gamme.COLD_END_MANNING_NBR;
          this.selectedGamme.SpeedFactor = gamme.SpeedFactor;
          this.selectedGamme.ItemNumber = gamme.ItemNumber;
          this.selectedGamme.LChannel = gamme.LChannel;
          this.gammeData.selectedTask.Speed = Number(gamme.Speed);
          this.gammeData.selectedTask.Yield = Number(gamme.Yield);
          this.gammeData.selectedTask.SpeedFactor = Number(atob(localStorage.getItem('speedFactor')));
          this.gammeData.selectedTask.Nom = gamme.Nom;
          this.gammeData.selectedTask.NChannel = gamme.NChannel;
          this.gammeData.selectedTask.selection = true;
          this.gammeData.selectedTask.Machine_LineId = gamme.Machine_LineId;
          this.descriptionArrayForAmp = [];
          this.checkForParallelLine(gamme);
          this.checkForAmp(gamme);
          // if (gamme.isSpecialGamme === true) {
          this.getSpecialGammeDetailsOnGammeSelectionByDefault(this.selectedGamme);
          // } else {
          //   this.getMachineListDetailsOnGammeSelection(this.selectedGamme);
          //   this.specialGamme = {
          //     NChannel: '',
          //     MacDescription: '',
          //     Speed: '',
          //     Yield: '',
          //     PullTonsPerDay: '',
          //     Manning: '',
          //     Cost: '',
          //     Preference: '',
          //   };
          //   /** Send select gamme options (speed, yield, speedfactor) to Production task*/
          //   this.sharedTask.sendInitialGammeToBeAssigned(this.gammeData.selectedTask);
          //   this.shareGammeLoadEvent.emit(this.gammeData.selectedTask);
          // }
        } else {
          gammeCount = gammeCount + 1;
        }
      }
      if (gammeCount === this.modifyTaskDurationObject.length) {
        if (this.isEditMode) {
          this.gammeData.selectedTask = this.taskData;
          this.gammeData.selectedTask.Speed = Number(this.taskData.Speed);
          this.gammeData.selectedTask.Yield = Number(this.taskData.Yield);
          this.gammeData.selectedTask.SpeedFactor = Number(atob(localStorage.getItem('speedFactor')));
          /**Check if there is no gamme selected */
          this.gammeData.selectedTask.Nom = this.taskData.NOM;
          this.gammeData.selectedTask.NChannel = this.taskData.Nchannel;
          this.gammeData.selectedTask.selection = false;
          this.sharedTask.sendInitialGammeToBeAssigned(this.gammeData.selectedTask);
          this.shareGammeLoadEvent.emit(this.gammeData.selectedTask);
        }
      }
    } else {
      /**There is no gamme option table */
      if (this.isEditMode) {
        this.isGammeOption = false;
        this.gammeData.selectedTask = this.taskData;
        this.gammeData.selectedTask.Speed = Number(this.taskData.Speed);
        this.gammeData.selectedTask.Yield = Number(this.taskData.Yield);
        this.gammeData.selectedTask.SpeedFactor = Number(atob(localStorage.getItem('speedFactor')));
        this.gammeData.selectedTask.Nom = this.taskData.NOM;
        this.gammeData.selectedTask.NChannel = this.taskData.Nchannel;
        this.gammeData.selectedTask.selection = false;
        this.sharedTask.sendInitialGammeToBeAssigned(this.gammeData.selectedTask);
        this.shareGammeLoadEvent.emit(this.gammeData.selectedTask);
      }
    }
  }

  checkForLineId(gammeData) {
    let selectedLine = atob(localStorage.getItem('lineId'));
    for (let i = 0; i < gammeData.length; i++) {
      if (selectedLine === gammeData[i].Machine_LineId) {
        gammeData[i].IsSelectedLine = true;
      } else {
        gammeData[i].IsSelectedLine = false;
      }
    }
  }

  getSpecialGammeDetailsOnGammeSelection(selectedGamme) {
    this.loading = true;
    this.taskService.SpecialGammeDetailsOnGammeSelectionFromAPI(selectedGamme, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        if (response.data.length === 0) {
          this.isSpecialGamme = false;
          this.getMachineListDetailsOnGammeSelection(this.selectedGamme);
          // this.shareGammeLoadEvent.emit(this.gammeData.selectedTask);
          this.specialGamme = {
            NChannel: '',
            MacDescription: '',
            Speed: '',
            Yield: '',
            PullTonsPerDay: '',
            Manning: '',
            Cost: '',
            Preference: '',
          };
          /** Send select gamme options (speed, yield, speedfactor) to Production task*/
          this.gammeData.selectedTask.isEditMode = this.isEditMode;
          this.sharedTask.sendGammeToBeAssigned(this.gammeData.selectedTask);
          return;
        } else {
          this.isSpecialGamme = true;
        }
        this.specialGamme = response.data ? response.data : [];
        this.sharedTask.sendSpecialGammeToBeAssigned(this.specialGamme);
        for (let i = 0; i < response.data.length; i++) {
          var productionPONo = localStorage.getItem("productionPONumber");
          const taskNumber = localStorage.getItem("taskNumber");
          let afterPONumberSplit: any = productionPONo.split(taskNumber);
          afterPONumberSplit = Number(afterPONumberSplit[1]);
          let newProductionPONo: any = afterPONumberSplit + 1;
          newProductionPONo = (newProductionPONo >= 10) ? (newProductionPONo) : '0' + (newProductionPONo);
          newProductionPONo = localStorage.getItem("taskNumber") + newProductionPONo;

          //productionPONo = productionPONo +1;
          this.specialGamme[i].POnumber = newProductionPONo;
          localStorage.setItem('productionPONumber', newProductionPONo.toString());
          localStorage.setItem('originalProductionPONumber', newProductionPONo.toString());
        }
        this.sharedTask.sendSelectedLineToBeAssigned(this.selectedLineName);
        this.gammeSelection.emit("this is a test");
        /** Send select gamme options (speed, yield, speedfactor) to Production task*/
        this.gammeData.selectedTask.isEditMode = this.isEditMode;
        this.sharedTask.sendGammeToBeAssigned(this.gammeData.selectedTask);
        this.getMachineListDetailsOnGammeSelection(this.selectedGamme);

        //this.sharedTask.sendSelectedLineToBeAssigned(this.selectedLineName);
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
  getSpecialGammeDetailsOnGammeSelectionByDefault(selectedGamme) {
    this.loading = true;
    this.taskService.SpecialGammeDetailsOnGammeSelectionFromAPI(selectedGamme, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        if (response.data.length === 0) {
          this.isSpecialGamme = false;
          this.getMachineListDetailsOnGammeSelection(this.selectedGamme);
          // this.shareGammeLoadEvent.emit(this.gammeData.selectedTask);
          this.specialGamme = {
            NChannel: '',
            MacDescription: '',
            Speed: '',
            Yield: '',
            PullTonsPerDay: '',
            Manning: '',
            Cost: '',
            Preference: '',
          };
          this.sharedTask.sendInitialGammeToBeAssigned(this.gammeData.selectedTask);
          this.shareGammeLoadEvent.emit(this.gammeData.selectedTask);
          return;
        } else {
          this.isSpecialGamme = true;
        }
        this.specialGamme = response.data ? response.data : [];
        this.sharedTask.sendSpecialGammeToBeAssigned(this.specialGamme);
        for (let i = 0; i < response.data.length; i++) {
          var productionPONo = localStorage.getItem("productionPONumber");
          const taskNumber = localStorage.getItem("taskNumber");
          let afterPONumberSplit: any = productionPONo.split(taskNumber);
          afterPONumberSplit = Number(afterPONumberSplit[1]);
          let newProductionPONo: any = afterPONumberSplit + 1;
          newProductionPONo = (newProductionPONo >= 10) ? (newProductionPONo) : '0' + (newProductionPONo);
          newProductionPONo = localStorage.getItem("taskNumber") + newProductionPONo;

          //productionPONo = productionPONo +1;
          this.specialGamme[i].POnumber = newProductionPONo;
          localStorage.setItem('productionPONumber', newProductionPONo.toString());
          localStorage.setItem('originalProductionPONumber', newProductionPONo.toString());
        }
        this.getMachineListDetailsOnGammeSelection(this.selectedGamme);

        /** Send select gamme options (speed, yield, speedfactor) to Production task*/
        this.sharedTask.sendInitialGammeToBeAssigned(this.gammeData.selectedTask);
        this.shareGammeLoadEvent.emit(this.gammeData.selectedTask);

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
  getMachineListDetailsOnGammeSelection(selectedGamme) {
    this.loading = true;
    this.selectedLine = '0';
    this.taskService.MachineListDetailsOnGammeSelectionFromAPI(selectedGamme, this.taskData, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        if (response.data.length !== 0) {
          this.selectLineList = response.data;
          this.showMachineListPopUp = true;
        }
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

  onGammeSelectionChange(gamme): void {
    this.shareGammeChangeEvent.emit(this.gammeData.selectedTask);
    this.gammeSelectedStatus = true;
    gamme.IsSelected = true;
    this.selectedGamme.NChannel = gamme.NChannel;
    this.selectedGamme.MacDescription = gamme.MacDescription;
    this.selectedLineID.emit(gamme.MacDescription);
    this.selectedGamme.Speed = gamme.Speed;
    this.selectedGamme.Yield = gamme.Yield;
    this.selectedGamme.PullTonsPerDay = gamme.PullTonsPerDay;
    this.selectedGamme.Manning = gamme.Manning;
    this.selectedGamme.Cost = gamme.Cost;
    this.selectedGamme.Preference = gamme.Preference;
    this.selectedGamme.IsSelected = gamme.IsSelected;
    this.selectedGamme.ItemNumber = gamme.ItemNumber;
    this.selectedGamme.LChannel = gamme.LChannel;

    this.gammeData.selectedTask.Speed = gamme.Speed;
    this.gammeData.selectedTask.Yield = gamme.Yield;
    this.gammeData.selectedTask.SpeedFactor = Number(atob(localStorage.getItem('speedFactor')));
    this.selectedGamme.Nom = gamme.Nom;
    this.selectedGamme.GammeId = gamme.GammeId;
    this.selectedGamme.Machine_LineId = gamme.Machine_LineId;
    this.selectedGamme.COLD_END_MANNING_NBR = gamme.COLD_END_MANNING_NBR;
    this.selectedGamme.SpeedFactor = gamme.SpeedFactor;
    this.gammeData.selectedTask.Nom = gamme.Nom;
    this.gammeData.selectedTask.NChannel = gamme.NChannel;
    this.gammeData.selectedTask.ItemNumber = gamme.ItemNumber;
    this.gammeData.selectedTask.Machine_LineId = gamme.Machine_LineId;
    this.selectedLineName = '';
    this.descriptionArrayForAmp = [];
    localStorage.setItem('productionPONumber', localStorage.getItem('MaxVcaPoNumber'));
    localStorage.setItem('originalProductionPONumber', localStorage.getItem('MaxVcaPoNumber'));
    this.checkForParallelLine(gamme);
    this.checkForAmp(gamme);
    // if (gamme.isSpecialGamme === true) {
    this.getSpecialGammeDetailsOnGammeSelection(this.selectedGamme);
    // } else {
    //   this.specialGamme = {
    //     NChannel: '',
    //     MacDescription: '',
    //     Speed: '',
    //     Yield: '',
    //     PullTonsPerDay: '',
    //     Manning: '',
    //     Cost: '',
    //     Preference: '',
    //   };
    //   this.sharedTask.sendSelectedLineToBeAssigned(this.selectedLineName);
    //   this.gammeSelection.emit("this is a test");
    //   /** Send select gamme options (speed, yield, speedfactor) to Production task*/
    //   this.gammeData.selectedTask.isEditMode = this.isEditMode;
    //   this.sharedTask.sendGammeToBeAssigned(this.gammeData.selectedTask);
    //   this.isSpecialGamme = false;
    //   this.getMachineListDetailsOnGammeSelection(this.selectedGamme);
    // }
  }

  checkForParallelLine(gamme) {
    if (gamme.MacDescription.indexOf('//') !== -1) {
      this.speedFactorFlag = false;
      var descriptions = gamme.MacDescription.split('//');
      this.descriptionArray = [];

      for (var i = 0; i < descriptions.length; i++) {    // dont add po number to 1st part id only to 2nd part.need to update logichere and insave also
        var productionPONo = localStorage.getItem("productionPONumber");
        const taskNumber = localStorage.getItem("taskNumber");
        let afterPONumberSplit: any = productionPONo.split(taskNumber);
        afterPONumberSplit = Number(afterPONumberSplit[1]);

        let newProductionPONo: any = afterPONumberSplit + 1;
        newProductionPONo = (newProductionPONo >= 10) ? (newProductionPONo) : '0' + (newProductionPONo);
        newProductionPONo = localStorage.getItem("taskNumber") + newProductionPONo;
        var descriptionObj = {
          line: descriptions[i],
          speedFactor: '',
          POnumber: newProductionPONo
        }
        localStorage.setItem('productionPONumber', newProductionPONo.toString());
        localStorage.setItem('originalProductionPONumber', newProductionPONo.toString());
        this.descriptionArray.push(descriptionObj);
      }
    } else {
      this.speedFactorFlag = false;
    }
  }
  checkForAmp(gamme) {
    if (gamme.MacDescription.indexOf('&') !== -1) {
      let poNumber: any;
      var descriptions = gamme.MacDescription.split('&');
      this.descriptionArray = [];

      for (var i = 0; i < descriptions.length; i++) {
        if (descriptions[i] !== ' ' && i > 0) {
          var productionPONo = localStorage.getItem("productionPONumber");
          const taskNumber = localStorage.getItem("taskNumber");
          let afterPONumberSplit: any = productionPONo.split(taskNumber);
          afterPONumberSplit = Number(afterPONumberSplit[1]);

          let newProductionPONo: any = afterPONumberSplit + 1;
          newProductionPONo = (newProductionPONo >= 10) ? (newProductionPONo) : '0' + (newProductionPONo);
          newProductionPONo = localStorage.getItem("taskNumber") + newProductionPONo;
          poNumber = newProductionPONo;
          localStorage.setItem('productionPONumber', newProductionPONo.toString());
          localStorage.setItem('originalProductionPONumber', newProductionPONo.toString());
        }
        var descriptionObj = {
          line: descriptions[i],
          POnumber: poNumber ? poNumber : '',
        }

        if (descriptionObj.line !== ' ') {
          this.descriptionArrayForAmp.push(descriptionObj);
        }

      }
    } else {

    }
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    localStorage.removeItem('savedNChannel');
    localStorage.removeItem('savedNom');
  }

}
