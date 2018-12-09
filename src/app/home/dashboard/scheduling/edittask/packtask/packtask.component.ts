import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { SharedtaskService } from '../../../../../services/home/sharedtask.service';
import { TaskService } from '../../../../../services/home/task.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Constant } from '../../../../../utill/constants/constant';
import { Subject } from "rxjs/Subject";

@Component({
  selector: 'app-packtask',
  templateUrl: './packtask.component.html',
  styleUrls: ['./packtask.component.css']
})

export class PacktaskComponent implements OnInit {

  @Input() packData;
  @Output() packMinQuantityChange = new EventEmitter<any>();
  @Output() packMaxQuantityChange = new EventEmitter<any>();
  @Output() packFirstStartDateChange = new EventEmitter<any>();
  @Output() calculatePackTaskDate = new EventEmitter<any>();

  public modifyTaskDurationObject = {
    listOfPackDetails: []
  };
  public startNewDateVal;
  public deltaStatus;
  public deltaValue;
  public prodData;
  public loading = false;
  public taskData;
  public adjustProductionTaskDuration = false;
  public keepQuantity = true;
  public afterSplit: any
  public isPackChecked;
  public packResponseData;
  private unsubscribe: Subject<void> = new Subject<void>();
  public maxQuantityCopy = [];
  public checkMaxQuantity = [];
  public checkMinQuantity = [];
  public withoutGamme = false;
  public date2MinDate: any;
  public isFirstStartDate = false;
  public productionData;
  public isEditMode = false;
  public warningMsg = 'Please provide production task data first';
  public warningLabel = 'Warning';
  public checkStartDate = [];
  public checkEndDate = [];
  public isProdDataAvailable = false;
  public shipDateDefault = [];
  constructor(
    private sharedTask: SharedtaskService,
    private taskService: TaskService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private constant: Constant
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.sharedTask.initialGammeToBeAssigned$.takeUntil(this.unsubscribe).subscribe(
      data => {
        if (data != null && data != undefined) {
          this.packData.selectedTask = data;
          if (data.selection) {
            this.getPackTasksFromAPI();
          }
          if (data.NOM === 0 && data.Nchannel === 0) {
            this.withoutGamme = true;
            this.getPackTasksFromAPI();
          }
        }
      });
    this.sharedTask.gammeToBeAssigned$.takeUntil(this.unsubscribe).subscribe(
      data => {
        if (data != null && data != undefined) {
          this.isEditMode = data.isEditMode;
          this.packData.selectedTask = data;
          this.getPackTasksFromAPI();
        }
      });
    this.sharedTask.prodDataToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.prodData = data;
          this.isProdDataAvailable = true;
        } else {
          this.isProdDataAvailable = false;
        }
      });
    this.sharedTask.packBeginDateToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          if (this.modifyTaskDurationObject.listOfPackDetails.length > 0) {
            this.modifyTaskDurationObject.listOfPackDetails[0].BeginDate = data;
            this.checkStartDate[0] = data;
          }
        }
      });
    this.sharedTask.prodSummaryToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.taskData = data;
          this.isEditMode = data.isEditMode;
        }
      });
    this.sharedTask.keepQuantityToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.adjustProductionTaskDuration = !(data.keepQuantityConstant);
          this.keepQuantity = data.keepQuantityConstant;
        }
      });
    this.sharedTask.prodAndPackDetailsToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.isEditMode = data.isEditMode;
          data.listOfPackDetails = this.modifyTaskDurationObject.listOfPackDetails;
        }
      });
    this.sharedTask.initialProdDataToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.productionData = data;
        }
      });
  }

  ngOnInit() {
    this.isProdDataAvailable = false;
    this.date2MinDate = new Date();
    this.date2MinDate.setDate(this.date2MinDate.getDate() - 1);
    if (!this.isEditMode) {
      this.adjustProductionTaskDuration = true;
    } else {
      this.adjustProductionTaskDuration = false;
    }
  }

  itemNumberCleared(msg) {
    this.modifyTaskDurationObject.listOfPackDetails = [];
  }

  onViewLessMore(listOfPackDetail): void {
    listOfPackDetail.onViewLessMoreStatus = !listOfPackDetail.onViewLessMoreStatus;
    if (listOfPackDetail.onViewLessMoreStatus) {
      listOfPackDetail.toggleIcon = '';
      listOfPackDetail.ViewLessMore = false;
    } else {
      listOfPackDetail.toggleIcon = 'up-arrow';
      listOfPackDetail.ViewLessMore = true;
    }
  }

  getPackTasksFromAPI() {
    this.isPackChecked = 0;
    this.loading = true;
    this.modifyTaskDurationObject.listOfPackDetails = [];
    this.taskService.PackTaskDetailsOnGammeSelectionFromAPI(this.taskData, this.packData.selectedTask, response => {
      this.loading = false;
      if (response.responseCode === 200) {
        var responseData = response.data;
        this.packResponseData = response.data;
        for (var i = 0; i < responseData.length; i++) {
          /**This is because, we do not want to set end date - we need to calculate it */
          var packObject = {};
          packObject["NOM"] = responseData[i].NOM;
          packObject["NChannel"] = responseData[i].NChannel;
          packObject["LChannel"] = responseData[i].LChannel;
          packObject["ItemNumber"] = responseData[i].ItemNumber;
          packObject["BeginDate"] = responseData[i].BeginDate;
          packObject["QuantItems"] = responseData[i].QuantItems;
          packObject["EndDate"] = responseData[i].EndDate;
          if (responseData[i].QuantItems !== null && responseData[i].QuantItemsMax === null) {
            /**For task without gamme only have min qty, max should be diplayed as 0 */
            packObject["QuantItemsMax"] = Number(responseData[i].QuantItemsMax);
          } else {
            packObject["QuantItemsMax"] = responseData[i].QuantItemsMax;
          }
          packObject["Checked"] = responseData[i].Checked;
          packObject["onViewLessMoreStatus"] = true;
          packObject["Description"] = responseData[i].Description;
          packObject["PONumber"] = responseData[i].PONumber;
          packObject["IsBulkTask"] = responseData[i].IsBulkTask;
          packObject["TaskNumber"] = responseData[i].TaskNumber;
          packObject["MachineLineId"] = responseData[i].MachineLineId
          packObject["IsDeleted"] = responseData[i].IsDeleted;
          packObject["ColdEndManning"] = responseData[i].ColdEndManning;
          packObject["Id"] = responseData[i].Id;
          var shipMinDate = new Date(responseData[i].EndDate);
          shipMinDate.setDate(shipMinDate.getDate() - 1);
          this.shipDateDefault[i] = new Date(shipMinDate);
         
          let a = new Date(responseData[i].ShipDate)
          if (a.getFullYear() === 1900) {
            packObject["ShipDate"] = null;
          } else {
            packObject["ShipDate"] = responseData[i].ShipDate;
          }
          /** DO NOT ASSIGN END DATE **/

          this.checkMinQuantity[i] = responseData[i].QuantItems;
          if (responseData[i].QuantItems !== null && responseData[i].QuantItemsMax === null) {
            this.checkMaxQuantity[i] = Number(responseData[i].QuantItemsMax);
          } else {
            this.checkMaxQuantity[i] = responseData[i].QuantItemsMax;
          }
          this.checkStartDate[i] = responseData[i].BeginDate;
          this.modifyTaskDurationObject.listOfPackDetails.push(packObject);
          if (responseData[i].Checked === false) {
            this.isPackChecked = this.isPackChecked + 1;
          }
        }

        if (this.isPackChecked === responseData.length) {
          localStorage.removeItem('productionPONumber');
          let orignalPONo = localStorage.getItem('originalProductionPONumber')
          localStorage.setItem('productionPONumber', orignalPONo)
          //if (!this.isEditMode) {
          this.getPONumber();
          // }
        } else {
          // if (!this.isEditMode) {
          this.getPONumber();
          //}
        }

        if (responseData.length > 0) {
          if (this.prodData) {
            if (this.prodData.newStartDate !== null) {
              this.isProdDataAvailable = true;
            } else {
              this.isProdDataAvailable = false;
            }
          } else {
            this.isProdDataAvailable = false;
          }
          // Is checked not equal to true in all cases, then dump prod data to bulk task.
          var noPackSelectCount = 0;
          var bulkTaskIndex = 0;
          for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
            if (this.modifyTaskDurationObject.listOfPackDetails[i].IsBulkTask) {
              bulkTaskIndex = i;
            }
            if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
              break;
            } else {
              noPackSelectCount = noPackSelectCount + 1;
            }
          }

          if (noPackSelectCount === this.modifyTaskDurationObject.listOfPackDetails.length) {
            /**Need to generate PO Number */
            this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].PONumber = this.packPONumberGeneration();
            this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].Checked = true;
            // debugger;
            /**Dump RQ and SM to pack from prod for Create task */
            if (this.productionData !== undefined) {
              if (this.productionData.newStartDate !== null && this.productionData.newQuantity !== null) {
                // this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].BeginDate = this.productionData.newStartDate;
                this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].QuantItems = this.productionData.newQuantity;
                this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].QuantItemsMax = this.productionData.maxQuantity;
                this.checkMaxQuantity[bulkTaskIndex] = this.productionData.maxQuantity;
                this.checkMinQuantity[bulkTaskIndex] = this.productionData.newQuantity;
                // this.checkStartDate[bulkTaskIndex] = this.productionData.newStartDate;
                // EndDate  Calculate
                // this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = new Date(mcreatedDate);
                // this.checkEndDate[index] = new Date(mcreatedDate);
                // this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].QuantItems, bulkTaskIndex, this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].BeginDate);
              }
            } else {
              if (this.prodData.newStartDate !== null && this.prodData.newQuantity !== null) {
                // this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].BeginDate = this.prodData.newStartDate;
                this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].QuantItems = this.prodData.newQuantity;
                this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].QuantItemsMax = this.prodData.maxQuantity;
                this.checkMaxQuantity[bulkTaskIndex] = this.prodData.maxQuantity;
                this.checkMinQuantity[bulkTaskIndex] = this.prodData.newQuantity;
                // this.checkStartDate[bulkTaskIndex] = this.prodData.newStartDate;
                // this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].QuantItems, bulkTaskIndex, this.modifyTaskDurationObject.listOfPackDetails[bulkTaskIndex].BeginDate);
              }
            }
          } else {
            /**On gamme change then start date change then come back to original gamme, assign prod start date to first pack task start date */
            var prodStartDate = '';
            if (this.productionData !== undefined) {
              if (this.productionData.newStartDate !== null) {
                prodStartDate = this.productionData.newStartDate;
              } else if (this.prodData.newStartDate !== null) {
                prodStartDate = this.prodData.newStartDate;
              }
            } else if (this.prodData.newStartDate !== null) {
              prodStartDate = this.prodData.newStartDate;
            }
            if (prodStartDate !== null && prodStartDate !== '') {
              if (new Date(prodStartDate).getTime() !== new Date(responseData[0].BeginDate).getTime()) {
                // responseData[0].BeginDate = prodStartDate;
                // this.checkStartDate[0] = responseData[0].BeginDate;
                /**On gamme change then start/end date change then come back to original gamme, then set start and end date from prod, then calculate below dates*/
                this.getNewEndDate(responseData[0].QuantItems, 0, prodStartDate);
              }
            }
            // EndDate  Calculate
            // this.getNewEndDateAndMaxQuantity(responseData[0].QuantItems, 0, responseData[0].BeginDate);
          }
        }
      } else {
        this.toastr.clearAllToasts();
        this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
      this.arrowShow();
    }, error => {
      this.loading = false;
      this.toastr.clearAllToasts();
      this.toastr.error(this.constant.serverError, this.constant.failure, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    });
  }
  arrowShow() {
    for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
      if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
        for (let j = i + 1; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked &&
            i != this.modifyTaskDurationObject.listOfPackDetails.length - 1) {
            this.modifyTaskDurationObject.listOfPackDetails[i].showDownArrow = true;
            break;
            //this.showDownArrow = true;
          } else {
            this.modifyTaskDurationObject.listOfPackDetails[i].showDownArrow = false;
          }
        }
      } else {
        this.modifyTaskDurationObject.listOfPackDetails[i].showDownArrow = false;
      }
    }
    for (let k = (this.modifyTaskDurationObject.listOfPackDetails.length - 1); k >= 0; k--) {
      if (this.modifyTaskDurationObject.listOfPackDetails[k].Checked) {
        for (let j = k - 1; j >= 0; j--) {
          if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked && k != 0) {
            this.modifyTaskDurationObject.listOfPackDetails[k].showUpArrow = true;
            break;
            //this.showUpArrow = true;
          } else {
            this.modifyTaskDurationObject.listOfPackDetails[k].showUpArrow = false;
          }
        }
      }
      else {
        this.modifyTaskDurationObject.listOfPackDetails[k].showUpArrow = false;
      }
    }
  }
  getPONumber() {
    for (let i = 0; i < this.packResponseData.length; i++) {
      const taskNo = localStorage.getItem("taskNumber");
      const productionPONo = localStorage.getItem("originalProductionPONumber");
      if (productionPONo.includes(taskNo)) {
        let newPONumberSplit: any = productionPONo.split(taskNo);
        newPONumberSplit = Number(newPONumberSplit[1]);
        this.afterSplit = newPONumberSplit;
      }
      if (this.packResponseData[i].PONumber !== null) {
        let tNo = localStorage.getItem("taskNumber");
        let pNo = this.packResponseData[i].PONumber;
        if (pNo.includes(tNo)) {
          let split = pNo.split(tNo);
          split = Number(split[1]);
          if (split > this.afterSplit) {
            let packPONumber = this.packResponseData[i].PONumber;
            localStorage.removeItem("productionPONumber");
            localStorage.setItem("productionPONumber", packPONumber);
            localStorage.removeItem('originalProductionPONumber')
            localStorage.setItem('originalProductionPONumber', packPONumber)
          }
        }
      }
    }
    localStorage.removeItem("productionPONumber");
    localStorage.setItem("productionPONumber", localStorage.getItem("originalProductionPONumber"));
  }

  packPONumberGeneration() {
    const taskNumber = localStorage.getItem("taskNumber");
    const productionPONumber = localStorage.getItem("productionPONumber");
    if (productionPONumber.includes(taskNumber)) {
      let afterPONumberSplit: any = productionPONumber.split(taskNumber);
      afterPONumberSplit = Number(afterPONumberSplit[1]);

      let newPONumber: any = afterPONumberSplit;
      newPONumber = newPONumber + 1;
      newPONumber = (newPONumber >= 10) ? (newPONumber) : '0' + (newPONumber);
      let packPONumber = localStorage.getItem("taskNumber") + newPONumber;
      localStorage.removeItem("productionPONumber");
      localStorage.setItem("productionPONumber", packPONumber);
      return packPONumber;
    }
  }
  // packtaskShipDateChange(selectedRecord, index): void {
  //   const packEndDate: any = new Date(selectedRecord.EndDate);
  //   const shipDate: any = new Date(selectedRecord.ShipDate);
  //   let a = shipDate.setSeconds(packEndDate.getSeconds());
  //   a = shipDate.setMilliseconds(packEndDate.getMilliseconds());
  //   if (a < packEndDate.getTime()) {
  //     this.toastr.error('Ship Date/Time should not be less than End Date/Time in pack task', this.constant.informationLabel, { showCloseButton: true, maxShown: 1 });
  //   }
  // }
  packtaskStartDateChange(selectedRecord, index): void {
    // if (this.prodData) {
    //   if (this.prodData.newQuantity !== null && this.prodData.newStartDate !== null && this.prodData.newEndDate !== null) {
    //     /** It will fire when we set the start date, initial time also it will fire */
    //     /**Check end date, if end date is null then, it is initial case, we do not want to calculate min quantity in initial state */
    //     if (selectedRecord.EndDate !== null) {
    //       const mstart: any = new Date(selectedRecord.BeginDate);
    //       const mend: any = new Date(selectedRecord.EndDate);
    //       if (mstart <= mend) {
    //         if (selectedRecord.Checked) {
    //           var rowCount = 0;
    //           if (Number(index) === 0) {
    //             this.isFirstStartDate = true;
    //           } else {
    //             for (var k = Number(index - 1); k >= 0; k--) {
    //               if (this.modifyTaskDurationObject.listOfPackDetails[k].Checked) {
    //                 this.isFirstStartDate = false;
    //                 rowCount = null;
    //                 break;
    //               } else {
    //                 rowCount = rowCount + 1;
    //               }
    //             }
    //             if (rowCount === Number(index)) {
    //               this.isFirstStartDate = true;
    //             }
    //           }
    //           if (this.isFirstStartDate) {
    //             if (!(selectedRecord.IsBulkTask)) {
    //               // emit event to prod for first non bulk start date change , because for bulk task we have another emit event
    //               var beginDate = selectedRecord.BeginDate;
    //               this.packFirstStartDateChange.emit({ beginDate });
    //               this.isFirstStartDate = false;
    //             }
    //           }
    //           this.getNewQuantityOfPack(mstart, mend, index);
    //         }
    //         this.checkStartDate[index] = this.modifyTaskDurationObject.listOfPackDetails[index].BeginDate;
    //       } else {
    //         if (this.checkStartDate[index] !== null && this.checkStartDate[index] !== undefined && this.checkStartDate[index] !== "") {
    //           this.modifyTaskDurationObject.listOfPackDetails[index].BeginDate = new Date(this.checkStartDate[index]);
    //         } else {
    //           this.modifyTaskDurationObject.listOfPackDetails[index].BeginDate = null;
    //         }
    //         this.toastr.error(this.constant.informationMsg, this.constant.informationLabel, { showCloseButton: true, maxShown: 1 });
    //       }
    //     } else {
    //       // do nothing, no calculation - because it is initial case
    //     }
    //   } else {
    //     this.modifyTaskDurationObject.listOfPackDetails[index].BeginDate = null;
    //     this.checkStartDate[index] = null;
    //     this.clearData(selectedRecord.BeginDate);
    //   }
    // } else {
    //   this.modifyTaskDurationObject.listOfPackDetails[index].BeginDate = null;
    //   this.checkStartDate[index] = null;
    //   this.clearData(selectedRecord.BeginDate);
    // }
  }

  packtaskEndDateChange(selectedRecord, index): void {
    // if (this.prodData) {
    //   if (this.prodData.newQuantity !== null && this.prodData.newStartDate !== null && this.prodData.newEndDate !== null) {
    //     if (selectedRecord.BeginDate !== null) {
    //       const start: any = new Date(selectedRecord.BeginDate);
    //       const end: any = new Date(selectedRecord.EndDate);
    //       if (start <= end) {
    //         if (selectedRecord.Checked) {
    //           this.getNewQuantityOfPack(start, end, index);
    //         }
    //         for (let i = index + 1; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
    //           if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
    //             const startNewEnddateVal = new Date(this.modifyTaskDurationObject.listOfPackDetails[i - 1].EndDate);
    //             const mcreatedDateVal: any = startNewEnddateVal;
    //             mcreatedDateVal.setMilliseconds(startNewEnddateVal.getMilliseconds() + Math.round(0));
    //             this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate = new Date(mcreatedDateVal);
    //             this.checkStartDate[i] = new Date(mcreatedDateVal);
    //             this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[i], i);
    //           }
    //         }
    //         this.checkEndDate[index] = this.modifyTaskDurationObject.listOfPackDetails[index].EndDate;
    //       } else {
    //         if (this.checkEndDate[index] !== null && this.checkEndDate[index] !== undefined && this.checkEndDate[index] !== "") {
    //           this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = new Date(this.checkEndDate[index]);
    //         } else {
    //           this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = null;
    //         }
    //         this.toastr.error(this.constant.informationMsg, this.constant.informationLabel, { showCloseButton: true, maxShown: 1 });
    //       }
    //     }
    //   } else {
    //     this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = null;
    //     this.checkEndDate[index] = null;
    //     this.clearData(selectedRecord.EndDate);
    //   }
    // } else {
    //   this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = null;
    //   this.checkEndDate[index] = null;
    //   this.clearData(selectedRecord.EndDate);
    // }
  }

  // packtaskMinQuantityChange(selectedRecord, index): void {
  //   if (selectedRecord.BeginDate !== null) {
  //     if (selectedRecord.Checked) {
  //       const mstart: any = new Date(selectedRecord.BeginDate);
  //       const mend: any = new Date(selectedRecord.EndDate);
  //       // debugger;
  //       this.getNewEndDateAndMaxQuantity(selectedRecord.QuantItems, index, mstart);
  //     }
  //   }
  // }

  packtaskMinQuantityBlur(selectedRecord, index): void {
    if (this.prodData) {
      if (this.prodData.newQuantity !== null && this.prodData.newStartDate !== null && this.prodData.newEndDate !== null) {
        // if (selectedRecord.BeginDate !== null) {
        if (selectedRecord.Checked) {
          if (selectedRecord.QuantItemsMax !== null && selectedRecord.QuantItemsMax !== undefined && selectedRecord.QuantItemsMax !== "") {
            // if (Number(selectedRecord.QuantItems) <= Number(selectedRecord.QuantItemsMax)) {
            // Adjust production task quantity with pack tasks checking not here because, when it is unchecked, we can't edit data
            if (selectedRecord.IsBulkTask) {
              if (Number(selectedRecord.QuantItems) <= Number(selectedRecord.QuantItemsMax)) {
                if (selectedRecord.QuantItems === "") {
                  selectedRecord.QuantItems = 0;
                }
                // this.makeEffectToPackBulkMinQuantity(selectedRecord, index);
              } else {
                selectedRecord.QuantItems = this.checkMinQuantity[index];
                this.toastr.error('Required quantity should be less than or equal to suggested max quantity', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
              }
            } else {
              this.makeEffectToPackTaskMinQuantity(selectedRecord, index);
            }
            // } else {
            // selectedRecord.QuantItems = this.checkMinQuantity[index];
            // this.toastr.error('Min quantity cannot be greater than Max quantity', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            // }
          } else {
            // Adjust production task quantity with pack tasks checking not here because, when it is unchecked, we can't edit data
            if (selectedRecord.IsBulkTask) {
              if (selectedRecord.QuantItems === "") {
                selectedRecord.QuantItems = 0;
              }
              // this.makeEffectToPackBulkMinQuantity(selectedRecord, index);
            } else {
              this.makeEffectToPackTaskMinQuantity(selectedRecord, index);
            }
          }
        }
        // }
      } else {
        selectedRecord.QuantItems = null;
        this.clearData(selectedRecord.QuantItems);
      }
    } else {
      selectedRecord.QuantItems = null;
      this.clearData(selectedRecord.QuantItems);
    }
  }

  // makeEffectToPackBulkMinQuantity(listOfPackDetail, index) {
  //   if (Number(listOfPackDetail.QuantItems) !== Number(this.checkMinQuantity[index])) {
  //     var minDeltaStatus;
  //     var minDeltaValue;
  //     if (Number(listOfPackDetail.QuantItems) > Number(this.checkMinQuantity[index])) {
  //       minDeltaStatus = 'added';
  //       minDeltaValue = Number(listOfPackDetail.QuantItems) - Number(this.checkMinQuantity[index]);
  //     } else if (Number(listOfPackDetail.QuantItems) < Number(this.checkMinQuantity[index])) {
  //       minDeltaStatus = 'removed';
  //       minDeltaValue = Number(this.checkMinQuantity[index]) - Number(listOfPackDetail.QuantItems);
  //     }

  //     if (minDeltaStatus === 'added' || minDeltaStatus === 'removed') {
  //       var beginDate = this.getFirstCheckedStartDate();
  //       let isFirstStartDateRow = this.isFirstStartDate;
  //       this.packMinQuantityChange.emit({ minDeltaValue, minDeltaStatus, isFirstStartDateRow, beginDate });
  //       this.isFirstStartDate = false;
  //       // const mstart: any = new Date(listOfPackDetail.BeginDate);
  //       // const mend: any = new Date(listOfPackDetail.EndDate);
  //       // this.getNewEndDateAndMaxQuantity(listOfPackDetail.QuantItems, index, mstart);
  //     }
  //     this.checkMinQuantity[index] = String(listOfPackDetail.QuantItems);
  //   }
  // }

  makeEffectToPackTaskMinQuantity(listOfPackDetail, index) {
    if (Number(listOfPackDetail.QuantItems) !== Number(this.checkMinQuantity[index])) {
      this.packDatesReset();
      const mstart: any = new Date(listOfPackDetail.BeginDate);
      /**Calculate the max quantity for changed min */
      this.getNewMaxQuantity(listOfPackDetail.QuantItems, index);
      var minDeltaStatus;
      var minDeltaValue;
      if (Number(listOfPackDetail.QuantItems) > Number(this.checkMinQuantity[index])) {
        minDeltaStatus = 'added';
        minDeltaValue = Number(listOfPackDetail.QuantItems) - Number(this.checkMinQuantity[index]);
      } else if (Number(listOfPackDetail.QuantItems) < Number(this.checkMinQuantity[index])) {
        minDeltaStatus = 'removed';
        minDeltaValue = Number(this.checkMinQuantity[index]) - Number(listOfPackDetail.QuantItems);
      }

      if (minDeltaStatus === 'added') {
        for (let k = 0; k < this.modifyTaskDurationObject.listOfPackDetails.length; k++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[k].Checked) {
            if (this.modifyTaskDurationObject.listOfPackDetails[k].IsBulkTask) {
              if (Number(minDeltaValue) > Number(this.modifyTaskDurationObject.listOfPackDetails[k].QuantItems)) {
                if (!this.adjustProductionTaskDuration) {
                  listOfPackDetail.QuantItems = String(this.checkMinQuantity[index]);
                  this.toastr.error('You can only add quantity less than/equal to quantity in bulk pack task', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
                  break;
                } else {
                  //Adjust production task quantity with pack tasks
                  minDeltaValue = Number(minDeltaValue) - Number(this.modifyTaskDurationObject.listOfPackDetails[k].QuantItems);
                  this.modifyTaskDurationObject.listOfPackDetails[k].QuantItems = 0;
                  // var beginDate = this.getFirstCheckedStartDate();
                  let isFirstStartDateRow = this.isFirstStartDate;
                  // this.packMinQuantityChange.emit({ minDeltaValue, minDeltaStatus, isFirstStartDateRow, beginDate });
                  this.isFirstStartDate = false;
                  this.checkMinQuantity[k] = String(this.modifyTaskDurationObject.listOfPackDetails[k].QuantItems);
                  // const mstart: any = new Date(this.modifyTaskDurationObject.listOfPackDetails[k].BeginDate);
                  // this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[k].QuantItems, k, mstart);
                  break;
                }
              } else {
                /*If increased any pack task min quantity, then remove delta from bulk task only*/
                const decreasedMinQuantity = Number(this.modifyTaskDurationObject.listOfPackDetails[k].QuantItems) - Number(minDeltaValue);
                this.modifyTaskDurationObject.listOfPackDetails[k].QuantItems = String(Math.round(decreasedMinQuantity));
                this.checkMinQuantity[k] = String(Math.round(decreasedMinQuantity));
                // const mstart: any = new Date(this.modifyTaskDurationObject.listOfPackDetails[k].BeginDate);
                // this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[k].QuantItems, k, mstart);
                break;
              }
            }
          }
        }
      } else if (minDeltaStatus === 'removed') {
        for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
            if (this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask) {
              const increasedMinQuantity = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) + Number(minDeltaValue);
              if (increasedMinQuantity >= 0) {
                this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = String(Math.round(increasedMinQuantity));
                this.checkMinQuantity[j] = String(Math.round(increasedMinQuantity));
                // const mstart: any = new Date(this.modifyTaskDurationObject.listOfPackDetails[j].BeginDate);
                // this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems, j, mstart);
                break;
              }
            }
          }
        }
        if (Number(listOfPackDetail.QuantItems) === 0) {
          listOfPackDetail.Checked = false;
          listOfPackDetail.BeginDate = null;
          listOfPackDetail.EndDate = null;
          listOfPackDetail.QuantItems = null;
          listOfPackDetail.QuantItemsMax = null;
          this.checkStartDate[index] = null;
          this.checkEndDate[index] = null;
        }
      }
      if (listOfPackDetail.QuantItems === null) {
        this.checkMinQuantity[index] = 0;
      } else {
        this.checkMinQuantity[index] = String(listOfPackDetail.QuantItems);
      }
    } else {
      if (listOfPackDetail.QuantItems === "") {
        listOfPackDetail.QuantItemsMax = "";
      } else if (listOfPackDetail.QuantItems == 0) {
        listOfPackDetail.QuantItemsMax = 0;
      }
    }
  }

  // getFirstCheckedStartDate() {
  //   var beginDate;
  //   for (var i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
  //     if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
  //       beginDate = this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate;
  //       break;
  //     }
  //   }
  //   return beginDate;
  // }

  onPackItemCheckboxChange(selectedRecord, index): void {
    if (this.prodData) {
      if (this.prodData.newQuantity !== null && this.prodData.newStartDate !== null && this.prodData.newEndDate !== null) {
        if (!selectedRecord.Checked) {
          selectedRecord.IsDeleted = true;
          if (selectedRecord.QuantItems !== null) {
            this.packDatesReset();
            var bulkTaskIndex = 0;
            for (var i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
              if (this.modifyTaskDurationObject.listOfPackDetails[i].IsBulkTask) {
                bulkTaskIndex = i;
                this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems = Number(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems) + Number(selectedRecord.QuantItems);
                this.checkMinQuantity[i] = String(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems);
                this.modifyTaskDurationObject.listOfPackDetails[i].QuantItemsMax = Number(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItemsMax) + Number(selectedRecord.QuantItemsMax);
                this.checkMaxQuantity[i] = String(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItemsMax);
                selectedRecord.BeginDate = null;
                selectedRecord.EndDate = null;
                selectedRecord.QuantItems = null;
                selectedRecord.QuantItemsMax = null;
                this.checkMinQuantity[index] = 0; //null
                this.checkMaxQuantity[index] = 0; //null
                this.checkStartDate[index] = null;
                this.checkEndDate[index] = null;
                // debugger;
                // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[i], i);
                // this.packtaskMinMaxQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[i], i);
              }
            }
            /**NEED WHEN TASK UNCHECK CONDITION*/
            /**If the unselected row is the first unchecked row then dump quantity to bulk pack and then 
             * change next pack start date to prod start date.
             * And if uncheck one row, the next checked pack start date should be the previous checked pack end date*/
            var firstCheckedRow = false;
            var rowCount = 0;
            for (var k = Number(index); k >= 0; k--) {
              if (!(this.modifyTaskDurationObject.listOfPackDetails[k].Checked)) {
                rowCount = rowCount + 1;
              }
            }
            if (rowCount === Number(index + 1)) {
              firstCheckedRow = true;
            }
            var changeIndex = 0;
            var dateIndex = 0;
            if (bulkTaskIndex > index) {
              changeIndex = Number(index) + 1;
              dateIndex = Number(index) - 1;
            } else {
              changeIndex = bulkTaskIndex + 1;
              dateIndex = bulkTaskIndex;
            }
            var mstart;
            if (firstCheckedRow) {
              mstart = this.prodData.newStartDate;
            } else {
              mstart = new Date(this.modifyTaskDurationObject.listOfPackDetails[dateIndex].EndDate);
            }
            // for (var l = changeIndex; l < this.modifyTaskDurationObject.listOfPackDetails.length; l++) {
            //   if (this.modifyTaskDurationObject.listOfPackDetails[l].Checked) {
            //     this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[l].QuantItems, l, mstart);
            //     // this.getNewEndDate(this.modifyTaskDurationObject.listOfPackDetails[l].QuantItems, l, mstart);
            //     break;
            //   }
            // }
            /** */
          } else if (selectedRecord.BeginDate !== null) {
            selectedRecord.BeginDate = null;
            this.checkStartDate[index] = null;
            selectedRecord.EndDate = null;
            this.checkEndDate[index] = null;
          }
        } else {
          selectedRecord.IsDeleted = false;
          // var beginDate = null;
          // var isFirstTask = true;
          // /**Previous end date should be the checked task start date */
          // for (var i = Number(index - 1); i >= 0; i--) {
          //   if (this.modifyTaskDurationObject.listOfPackDetails[i].EndDate !== null && this.modifyTaskDurationObject.listOfPackDetails[i].EndDate !== undefined) {
          //     beginDate = this.modifyTaskDurationObject.listOfPackDetails[i].EndDate;
          //     isFirstTask = false;
          //     break;
          //   }
          // }
          // if (isFirstTask) {
          //   /**Prod start date should be the checked task start date */
          //   selectedRecord.BeginDate = this.prodData.newStartDate;
          //   this.checkStartDate[index] = this.prodData.newStartDate;
          // } else {
          //   selectedRecord.BeginDate = beginDate;
          //   this.checkStartDate[index] = beginDate;
          // }
          selectedRecord.BeginDate = null;
          this.checkStartDate[index] = null;
          selectedRecord.EndDate = null;
          this.checkEndDate[index] = null;
          /**Generate PO Number */
          if (selectedRecord.PONumber === null) {
            selectedRecord.PONumber = this.packPONumberGeneration();
          }
        }
      } else {
        selectedRecord.Checked = !(selectedRecord.Checked);
        this.clearData(selectedRecord.Checked);
      }
    } else {
      selectedRecord.Checked = !(selectedRecord.Checked);
      this.clearData(selectedRecord.Checked);
    }
    this.arrowShow();
  }

  getNewEndDate(newQuantityVal, index, startNewDate): void {
    let DurationinMins: any;
    if (this.packData.selectedTask !== undefined) {
      if (this.packData.selectedTask.Speed !== 0 && this.packData.selectedTask.Yield !== 0 && this.packData.selectedTask.SpeedFactor !== 0) {
        DurationinMins = Number(newQuantityVal) / ((this.packData.selectedTask.Yield / 100) * this.packData.selectedTask.Speed *  this.packData.selectedTask.SpeedFactor);
      } else {
        DurationinMins = 0;
      }
    }
    if (DurationinMins === undefined) {
      DurationinMins = 0
    }
    this.startNewDateVal = new Date(startNewDate);
    this.modifyTaskDurationObject.listOfPackDetails[index].BeginDate = new Date(startNewDate); // Added a new line for the start new date for the pack
    this.checkStartDate[index] = new Date(startNewDate);
    const mcreatedDate: any = this.startNewDateVal;
    let durationInMs = DurationinMins * 60000;
    mcreatedDate.setMilliseconds(this.startNewDateVal.getMilliseconds() + durationInMs + 462);
    this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = new Date(mcreatedDate);
    this.checkEndDate[index] = new Date(mcreatedDate);
    //for Default ship date
    var shipMinDate = mcreatedDate;
    shipMinDate.setDate(shipMinDate.getDate() - 1);
    this.shipDateDefault[index] = new Date(shipMinDate);
   
    for (let i = index + 1; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
      if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
        // the next checked pack start date should be the previous checked pack end date
        var previousCheckedIndex = null;
        for (let j = i - 1; j >= 0; j--) {
          if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
            previousCheckedIndex = j;
            break;
          }
        }
        var startNewEnddateVal;
        if (previousCheckedIndex === null) {
          startNewEnddateVal = this.prodData.newStartDate;
        } else {
          startNewEnddateVal = new Date(this.modifyTaskDurationObject.listOfPackDetails[previousCheckedIndex].EndDate);
        }
        const mcreatedDateVal: any = startNewEnddateVal;
        mcreatedDateVal.setMilliseconds(startNewEnddateVal.getMilliseconds() + Math.round(0));
        this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate = new Date(mcreatedDateVal);
        this.checkStartDate[i] = new Date(mcreatedDateVal);
        this.packtaskMinMaxQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[i], i);
        break; /**for unwanted looping - check */
      }
    }
  }

  packtaskMinMaxQuantityChange(selectedRecord, index): void {
    if (selectedRecord.BeginDate !== null) {
      if (selectedRecord.Checked) {
        const mstart: any = new Date(selectedRecord.BeginDate);
        const mend: any = new Date(selectedRecord.EndDate);
        this.getNewEndDate(selectedRecord.QuantItems, index, mstart);
      }
    }
  }

  /* This function calls, when we change the min quantity value in the pack task, get the start and end dates of the new duration.*/
  // getNewEndDateAndMaxQuantity(newQuantityVal, index, startNewDate): void {
  //   let DurationinMins: any;
  //   if (this.packData.selectedTask !== undefined) {
  //     if (this.packData.selectedTask.Speed !== 0 && this.packData.selectedTask.Yield !== 0 && this.packData.selectedTask.SpeedFactor !== 0) {
  //       DurationinMins = Number(newQuantityVal) / (this.packData.selectedTask.Speed * (this.packData.selectedTask.Yield / 100) * this.packData.selectedTask.SpeedFactor);
  //     } else {
  //       DurationinMins = 0;
  //     }
  //   }
  //   if (DurationinMins === undefined) {
  //     DurationinMins = 0
  //   }
  //   this.startNewDateVal = new Date(startNewDate);
  //   this.modifyTaskDurationObject.listOfPackDetails[index].BeginDate = new Date(startNewDate); // Added a new line for the start new date for the pack
  //   this.checkStartDate[index] = new Date(startNewDate);
  //   const mcreatedDate: any = this.startNewDateVal;
  //   let durationInMs = DurationinMins * 60000;
  //   mcreatedDate.setMilliseconds(this.startNewDateVal.getMilliseconds() + durationInMs + 462);
  //   this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = new Date(mcreatedDate);
  //   this.checkEndDate[index] = new Date(mcreatedDate);
  //   // debugger;
  //   if (this.packData.selectedTask !== undefined) {
  //     /*We need to round DurationinMins, otherwise, for sometime calculated packtask quantity will be decrease by 1 */
  //     const maxQuantity = this.packData.selectedTask.Speed * DurationinMins * (100 / 100) * this.packData.selectedTask.SpeedFactor;
  //     this.modifyTaskDurationObject.listOfPackDetails[index].QuantItemsMax = String(Math.round(maxQuantity));
  //     this.checkMaxQuantity[index] = String(Math.round(maxQuantity));
  //   }
  //   /* debugger; */
  //   /**1st is non bulk, 2nd is bulk, then change 1st max qty, then change 2nd max qty, then change 2nd min qty 
  //    * : In this case prod and pack max qty will not equal - Fix below */
  //   for (let j = 0; j < index; j++) {
  //     if (this.packData.selectedTask !== undefined) {
  //       let durationinMins = 0;
  //       if (this.packData.selectedTask.Speed != 0 && this.packData.selectedTask.Yield != 0 && this.packData.selectedTask.SpeedFactor != 0) {
  //         durationinMins = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) / (this.packData.selectedTask.Speed * (this.packData.selectedTask.Yield / 100) * this.packData.selectedTask.SpeedFactor);
  //       }
  //       const maxQuantity1 = this.packData.selectedTask.Speed * durationinMins * (100 / 100) * this.packData.selectedTask.SpeedFactor;
  //       this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax = String(Math.round(maxQuantity1));
  //       this.checkMaxQuantity[j] = String(Math.round(maxQuantity1));
  //     }
  //   }
  //   for (let i = index + 1; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
  //     if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
  //       // the next checked pack start date should be the previous checked pack end date
  //       var previousCheckedIndex = null;
  //       for (let j = i - 1; j >= 0; j--) {
  //         if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
  //           previousCheckedIndex = j;
  //           break;
  //         }
  //       }
  //       var startNewEnddateVal;
  //       if (previousCheckedIndex === null) {
  //         startNewEnddateVal = this.prodData.newStartDate;
  //       } else {
  //         startNewEnddateVal = new Date(this.modifyTaskDurationObject.listOfPackDetails[previousCheckedIndex].EndDate);
  //       }
  //       const mcreatedDateVal: any = startNewEnddateVal;
  //       mcreatedDateVal.setMilliseconds(startNewEnddateVal.getMilliseconds() + Math.round(0));
  //       this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate = new Date(mcreatedDateVal);
  //       this.checkStartDate[i] = new Date(mcreatedDateVal);
  //       this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[i], i);
  //     }
  //   }
  // }

  /* This function calls, when we change the min quantity value in the pack task*/
  getNewMaxQuantity(newQuantityVal, index): void {
    if (this.packData.selectedTask !== undefined) {
      var maxQuantity = null;
      if (newQuantityVal === "") {
        this.modifyTaskDurationObject.listOfPackDetails[index].QuantItemsMax = null;
      } else {
        maxQuantity = newQuantityVal / (this.packData.selectedTask.Yield / 100);
        this.modifyTaskDurationObject.listOfPackDetails[index].QuantItemsMax = String(Math.round(maxQuantity));
      }
      // debugger;
      /**To reduce/increase bulk max quantity when other max quantity change */
      this.packtaskMaxQuantityBlur(this.modifyTaskDurationObject.listOfPackDetails[index], index);
      this.checkMaxQuantity[index] = String(Math.round(maxQuantity));
    }
  }

  /* This function calls, when we change start and end dates of the pack task table.*/
  getNewQuantityOfPack(startNewDate, startNewEnddate, index): void {
    // //Need to edit bulk task also, so remove if condition from old
    // const diffMs = (startNewEnddate - startNewDate); // milliseconds
    // if (diffMs >= 0) {
    //   const diff: any = Math.abs((startNewDate) - (startNewEnddate));
    //   const minutes: any = Math.floor((diff / 1000) / 60);
    //   // debugger;
    //   if (this.packData.selectedTask !== undefined) {
    //     if (this.packData.selectedTask.Speed !== 0 && this.packData.selectedTask.Yield !== 0 && this.packData.selectedTask.SpeedFactor !== 0) {
    //       const newQuantity = this.packData.selectedTask.Speed * minutes * (this.packData.selectedTask.Yield / 100) * this.packData.selectedTask.SpeedFactor;
    //       const maxQuantity = this.packData.selectedTask.Speed * minutes * (100 / 100) * this.packData.selectedTask.SpeedFactor;
    //       this.modifyTaskDurationObject.listOfPackDetails[index].QuantItems = String(Math.round(newQuantity));
    //       this.modifyTaskDurationObject.listOfPackDetails[index].QuantItemsMax = String(Math.round(maxQuantity));
    //     } else {
    //       const newQuantity = 0;
    //       const maxQuantity = 0;
    //       this.modifyTaskDurationObject.listOfPackDetails[index].QuantItems = String(Math.round(newQuantity));
    //       this.modifyTaskDurationObject.listOfPackDetails[index].QuantItemsMax = String(Math.round(maxQuantity));
    //     }
    //     /**Copy the quantity value to another variable is removing from here because we are calling another function from here, 
    //      * in that function we copy the quantity values */
    //     /**If Adj Prod Task checkbox is checked then only the below code needs. But we do not write that condition because, 
    //      * if it is unchecked then we can not able to edit date */
    //     if (this.modifyTaskDurationObject.listOfPackDetails[index].IsBulkTask) {
    //       this.makeEffectToPackBulkMinQuantity(this.modifyTaskDurationObject.listOfPackDetails[index], index);
    //     } else {
    //       this.makeEffectToPackTaskMinQuantity(this.modifyTaskDurationObject.listOfPackDetails[index], index);
    //     }
    //   } else {
    //     for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
    //       this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = 0;
    //       this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax = 0;
    //       this.checkMinQuantity[j] = 0;
    //       this.checkMaxQuantity[j] = 0;
    //     }
    //   }
    // }
  }

  /* This function calls, when we change the Min and Max quantity of the production, it will effect to the pack task table */
  /* This function gives delta value of Min quantity and make effect in the pack details table */
  makeProductEffectToPack(): void {
    this.deltaStatus = '';
    if (this.modifyTaskDurationObject.listOfPackDetails.length > 0) {
      if (Number(this.prodData.newQuantity) > Number(this.prodData.newQuantityValueCheckStatus)) {
        if (!this.packData.newStartDateDisableStatus) {
          this.packDatesReset();
        }
        this.deltaStatus = 'added';
        this.deltaValue = Number(this.prodData.newQuantity) - Number(this.prodData.newQuantityValueCheckStatus);
        this.prodData.newQuantityValueCheckStatus = this.prodData.newQuantity;
      } else if (Number(this.prodData.newQuantity) < Number(this.prodData.newQuantityValueCheckStatus)) {
        if (!this.packData.newStartDateDisableStatus) {
          this.packDatesReset();
        }
        this.deltaStatus = 'removed';
        this.deltaValue = Number(this.prodData.newQuantityValueCheckStatus) - Number(this.prodData.newQuantity);
        this.prodData.newQuantityValueCheckStatus = this.prodData.newQuantity;
      }
      var oldData = {
        newQuantityValueCheckStatus: this.prodData.newQuantityValueCheckStatus
      }

      /**For create task */
      // for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
      //   if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
      //     if (this.modifyTaskDurationObject.listOfPackDetails[i].IsBulkTask) {
      //       if (this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate === null) {
      //         this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate = this.prodData.newStartDate;
      //         this.checkStartDate[i] = this.prodData.newStartDate;
      //         break;
      //       }
      //     }
      //   }
      // }
      /** */

      if (this.deltaStatus === 'added') {
        var onlyFirstRow = 0;
        // var addedFlag = false;
        for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
            if (this.modifyTaskDurationObject.listOfPackDetails[i].IsBulkTask) {
              /*If increased min quantity then add delta into bulk task only*/
              const increasedMinQuantity = Number(this.deltaValue) + Number(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems);
              // if (increasedMinQuantity > this.modifyTaskDurationObject.listOfPackDetails[i].QuantItemsMax) {
              //   /**If req qty delta greater than sug max then move to next non bulk task */
              //   addedFlag = false;
              // } else {
              //   addedFlag = true;
              this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems = String(Math.round(increasedMinQuantity));
              this.checkMinQuantity[i] = String(Math.round(increasedMinQuantity));
              // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[i], i);
              // }
            }
            // else {
            //   this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[i], i);
            // }
          }
        }
        // if (!addedFlag) {
        //   /**If req qty delta greater than sug max then move to next non bulk task */
        //   for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
        //     if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
        //       if (!(this.modifyTaskDurationObject.listOfPackDetails[i].IsBulkTask)) {
        //         const increasedMinQuantity = Number(this.deltaValue) + Number(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems);
        //         this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems = String(Math.round(increasedMinQuantity));
        //         this.checkMinQuantity[i] = String(Math.round(increasedMinQuantity));
        //         this.getNewMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems, i);
        //         /**Then the bulk sug max greater than req qty, how can we handle this? */
        //         /** NEED TO WORK ON THIS */
        //         break;
        //       }
        //     }
        //   }
        // }
        this.sharedTask.sendProdOldQuantityToBeAssigned(oldData);
        if (this.packData.newStartDateDisableStatus) {
          for (var i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
            if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
              this.getNewEndDate(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems, i, this.prodData.newStartDate);
              break;
            }
          }
        }
      } else if (this.deltaStatus === 'removed') {
        var decreaseFlag = false;
        var packForDecrease = false;
        for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
            if (this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask) {
              // debugger; need to check this condition (< or <=) after getting clarification of 1803: 3rd point
              if (Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) <= 1) {
                break;
              }
              const decreasedMinQuantity = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) - Number(this.deltaValue);
              if (decreasedMinQuantity >= 0) {
                decreaseFlag = true;
                this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = String(Math.round(decreasedMinQuantity));
                this.checkMinQuantity[j] = String(Math.round(decreasedMinQuantity));
                // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[j], j);
                break;
              } else {
                const remainingDelta = Number(this.deltaValue) - Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems);
                this.deltaValue = remainingDelta;
                this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = 0;
                this.checkMinQuantity[j] = 0;
              }
            }
          }
        }
        if (!decreaseFlag) {
          for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
            if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
              if (!(this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask)) {
                const decreasedMinQuantityVal = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) - Number(this.deltaValue);
                if (decreasedMinQuantityVal >= 0) {
                  packForDecrease = true;
                  this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = String(Math.round(decreasedMinQuantityVal));
                  this.checkMinQuantity[j] = String(Math.round(decreasedMinQuantityVal));
                  // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[j], j);
                  break;
                } else {
                  const remainingDelta = Number(this.deltaValue) - Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems);
                  this.deltaValue = remainingDelta;
                  this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = 0;
                  this.checkMinQuantity[j] = 0;
                }
              }
            }
          }
          // if (!packForDecrease) {
          //   /**This is may not happen, because this is handled in the above else conditions (ie:delta will be 
          //    * reduced from bulk then next pack then next pack etc.) */
          //   var newDeltaValue = Number(this.deltaValue);
          //   if (newDeltaValue > 1) {
          //     for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
          //       if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
          //         if (this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask) {
          //           if (Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) <= 1) {
          //             break;
          //           }
          //           newDeltaValue = Number(newDeltaValue) - (Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) - 1);
          //           this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = 1;
          //           this.checkMinQuantity[j] = 1;
          //           // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[j], j);
          //           break;
          //         }
          //       }
          //     }
          //     for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
          //       if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
          //         if (!(this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask)) {
          //           if (Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) >= Number(newDeltaValue)) {
          //             var newQuantItems = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) - Number(newDeltaValue);
          //             this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = String(Math.round(newQuantItems));
          //             this.checkMinQuantity[j] = String(Math.round(newQuantItems));
          //             // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[j], j);
          //             break;
          //           } else {
          //             newDeltaValue = Number(newDeltaValue) - Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems);
          //             this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = 0;
          //             this.checkMinQuantity[j] = 0;
          //             // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[j], j);
          //             if (Number(newDeltaValue) === 0) {
          //               break;
          //             }
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
        }
        this.sharedTask.sendProdOldQuantityToBeAssigned(oldData);
        if (this.packData.newStartDateDisableStatus) {
          for (var i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
            if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
              this.getNewEndDate(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems, i, this.prodData.newStartDate);
              break;
            }
          }
        }
      } 
      // else {
      //   // date change in keep quantity constant check
      //   for (var i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
      //     if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
      //       if (this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems === null) {
      //         this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems = this.prodData.newQuantity;
      //       }
      //       // debugger; //NEED TO CHECK
      //       this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems, i, this.prodData.newStartDate);
      //       break;
      //     }
      //   }
      // }
    }
  }

  /**Start date change event from prod */
  makeProductDateEffectToPack(): void {
    this.deltaStatus = '';
    if (this.modifyTaskDurationObject.listOfPackDetails.length > 0) {
      if (Number(this.prodData.newQuantity) > Number(this.prodData.newQuantityValueCheckStatus)) {
        this.packDatesReset();
        this.deltaStatus = 'added';
        this.deltaValue = Number(this.prodData.newQuantity) - Number(this.prodData.newQuantityValueCheckStatus);
        this.prodData.newQuantityValueCheckStatus = this.prodData.newQuantity;
      } else if (Number(this.prodData.newQuantity) < Number(this.prodData.newQuantityValueCheckStatus)) {
        this.packDatesReset();
        this.deltaStatus = 'removed';
        this.deltaValue = Number(this.prodData.newQuantityValueCheckStatus) - Number(this.prodData.newQuantity);
        this.prodData.newQuantityValueCheckStatus = this.prodData.newQuantity;
      }
      var oldData = {
        newQuantityValueCheckStatus: this.prodData.newQuantityValueCheckStatus
      }

      var firstCheckedIndex = null;
      for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
        if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
          firstCheckedIndex = j;
          break;
        }
      }

      if (this.deltaStatus === 'added') {
        var onlyFirstRow = 0;
        for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
            if (this.modifyTaskDurationObject.listOfPackDetails[i].IsBulkTask) {
              /*If increased min quantity then add delta into bulk task only*/
              const increasedMinQuantity = Number(this.deltaValue) + Number(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems);
              this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems = String(Math.round(increasedMinQuantity));
              this.checkMinQuantity[i] = String(Math.round(increasedMinQuantity));
              // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[i], i);
              // If start/end date of prod task is changed, pack task start/end date should change accordingly
              //THIS IS BULK TASK, IF THIS IS IN MIDDLE, CHANGE THIS i to 0 FOR 1st DATE CHANGE
              // if (firstCheckedIndex !== null) {
              //   this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[firstCheckedIndex].QuantItems, firstCheckedIndex, this.prodData.newStartDate);
              // }
            }
          }
        }
        this.sharedTask.sendProdOldQuantityToBeAssigned(oldData);
      } else if (this.deltaStatus === 'removed') {
        var decreaseFlag = false;
        var packForDecrease = false;
        for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
            if (this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask) {
              // debugger; //need to check this condition (< or <=) after getting clarification of 1803: 3rd point
              if (Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) <= 1) {
                break;
              }
              const decreasedMinQuantity = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) - Number(this.deltaValue);
              if (decreasedMinQuantity >= 0) {
                decreaseFlag = true;
                this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = String(Math.round(decreasedMinQuantity));
                this.checkMinQuantity[j] = String(Math.round(decreasedMinQuantity));
                // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[j], j);
                // If start/end date of prod task is changed, pack task start/end date should change accordingly
                // if (firstCheckedIndex !== null) {
                //   this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[firstCheckedIndex].QuantItems, firstCheckedIndex, this.prodData.newStartDate)
                // }
                break;
              }
            }
          }
        }
        if (!decreaseFlag) {
          for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
            if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
              if (!(this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask)) {
                const decreasedMinQuantityVal = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) - Number(this.deltaValue);
                if (decreasedMinQuantityVal >= 0) {
                  packForDecrease = true;
                  this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = String(Math.round(decreasedMinQuantityVal));
                  this.checkMinQuantity[j] = String(Math.round(decreasedMinQuantityVal));
                  // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[j], j);
                  // If start/end date of prod task is changed, pack task start/end date should change accordingly
                  // if (firstCheckedIndex !== null) {
                  //   this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[firstCheckedIndex].QuantItems, firstCheckedIndex, this.prodData.newStartDate)
                  // }
                  break;
                }
              }
            }
          }
          if (!packForDecrease) {
            var newDeltaValue = Number(this.deltaValue);
            for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
              if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
                if (this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask) {
                  // debugger;//need to check this condition (< or <=) after getting clarification of 1803: 3rd point
                  if (Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) <= 1) {
                    break;
                  }
                  newDeltaValue = Number(newDeltaValue) - Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems);
                  this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = 0;
                  this.checkMinQuantity[j] = 0;
                  // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[j], j);
                  // If start/end date of prod task is changed, pack task start/end date should change accordingly
                  // if (firstCheckedIndex !== null) {
                  //   this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[firstCheckedIndex].QuantItems, firstCheckedIndex, this.prodData.newStartDate)
                  // }
                  break;
                }
              }
            }
            for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
              if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
                if (!(this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask)) {
                  if (Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) >= Number(newDeltaValue)) {
                    var newQuantItems = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems) - Number(newDeltaValue);
                    this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = String(Math.round(newQuantItems));
                    this.checkMinQuantity[j] = String(Math.round(newQuantItems));
                    // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[j], j);
                    // If start/end date of prod task is changed, pack task start/end date should change accordingly
                    // if (firstCheckedIndex !== null) {
                    //   this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[firstCheckedIndex].QuantItems, firstCheckedIndex, this.prodData.newStartDate)
                    // }
                    break;
                  } else {
                    newDeltaValue = Number(newDeltaValue) - Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems);
                    this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems = 0;
                    this.checkMinQuantity[j] = 0;
                    // this.packtaskMinQuantityChange(this.modifyTaskDurationObject.listOfPackDetails[j], j);
                    // If start/end date of prod task is changed, pack task start/end date should change accordingly
                    // if (firstCheckedIndex !== null) {
                    //   this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[firstCheckedIndex].QuantItems, firstCheckedIndex, this.prodData.newStartDate)
                    // }
                    if (Number(newDeltaValue) === 0) {
                      break;
                    }
                  }
                }
              }
            }
          }
        }
        this.sharedTask.sendProdOldQuantityToBeAssigned(oldData);
      } 
      else {
        // date change in keep quantity constant check
        for (var i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
            if (this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems === null) {
              /**For create task initial start date select */
              this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems = 0;
              this.modifyTaskDurationObject.listOfPackDetails[i].QuantItemsMax = 0;
            }
            /**If keep quantity constant is checked then do not change min & max quantity */
            // debugger; //NEED TO CHECK
            // if (this.adjustProductionTaskDuration) {
            //   this.getNewEndDateAndMaxQuantity(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems, i, this.prodData.newStartDate);
            // } else {
            if (this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate === null) {
              /**Date is not there for pack, so we do not want to calculate new dates (ie: do not call next line this.getNewEndDate())*/
              break;
            }
            this.getNewEndDate(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems, i, this.prodData.newStartDate);
            // }
            break;
          }
        }
      }
    }
  }

  makeProdMaxQtyEffectToPack(value): void {
    this.deltaStatus = '';
    if (this.modifyTaskDurationObject.listOfPackDetails.length > 0) {
      if (Number(value.currentQty) > Number(value.calculatedQty)) {
        this.deltaStatus = 'added';
        this.deltaValue = Number(value.currentQty) - Number(value.calculatedQty);
        value.calculatedQty = value.currentQty;
      } else if (Number(value.currentQty) < Number(value.calculatedQty)) {
        this.deltaStatus = 'removed';
        this.deltaValue = Number(value.calculatedQty) - Number(value.currentQty);
        value.calculatedQty = value.currentQty;
      }
      var oldData = {
        calculatedQty: value.calculatedQty
      }

      if (this.deltaStatus === 'added') {
        var onlyFirstRow = 0;
        for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
            if (this.modifyTaskDurationObject.listOfPackDetails[i].IsBulkTask) {
              /*If increased max quantity then add delta into bulk task only*/
              const increasedMaxQuantity = Number(this.deltaValue) + Number(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItemsMax);
              this.modifyTaskDurationObject.listOfPackDetails[i].QuantItemsMax = String(Math.round(increasedMaxQuantity));
              this.checkMaxQuantity[i] = String(Math.round(increasedMaxQuantity));
            }
          }
        }
        this.sharedTask.sendProdOldMaxQuantityToBeAssigned(oldData);
      } else if (this.deltaStatus === 'removed') {
        var decreaseFlag = false;
        var packForDecrease = false;
        for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
            if (this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask) {
              // debugger;//need to check this condition (< or <=) after getting clarification of 1803: 3rd point
              if (Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax) <= 1) {
                break;
              }
              const decreasedMaxQuantity = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax) - Number(this.deltaValue);
              if (decreasedMaxQuantity >= 0) {
                decreaseFlag = true;
                this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax = String(Math.round(decreasedMaxQuantity));
                this.checkMaxQuantity[j] = String(Math.round(decreasedMaxQuantity));
                break;
              }
            }
          }
        }
        if (!decreaseFlag) {
          for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
            if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
              if (!(this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask)) {
                const decreasedMaxQuantityVal = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax) - Number(this.deltaValue);
                if (decreasedMaxQuantityVal >= 0) {
                  packForDecrease = true;
                  this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax = String(Math.round(decreasedMaxQuantityVal));
                  this.checkMaxQuantity[j] = String(Math.round(decreasedMaxQuantityVal));
                  break;
                }
              }
            }
          }
          if (!packForDecrease) {
            var newDeltaValue = Number(this.deltaValue);
            for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
              if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
                if (this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask) {
                  // debugger;//need to check this condition (< or <=) after getting clarification of 1803: 3rd point
                  if (Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax) <= 1) {
                    break;
                  }
                  newDeltaValue = Number(newDeltaValue) - Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax);
                  this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax = 0;
                  this.checkMaxQuantity[j] = 0;
                  break;
                }
              }
            }
            for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
              if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
                if (!(this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask)) {
                  if (Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax) >= Number(newDeltaValue)) {
                    var newQuantItemsMax = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax) - Number(newDeltaValue);
                    this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax = String(Math.round(newQuantItemsMax));
                    this.checkMaxQuantity[j] = String(Math.round(newQuantItemsMax));
                    break;
                  } else {
                    newDeltaValue = Number(newDeltaValue) - Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax);
                    this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax = 0;
                    this.checkMaxQuantity[j] = 0;
                    if (Number(newDeltaValue) === 0) {
                      break;
                    }
                  }
                }
              }
            }
          }
        }
        this.sharedTask.sendProdOldMaxQuantityToBeAssigned(oldData);
      }
    }
  }

  adjustProductionTaskDurationChange(): void {
    let adjProd = {
      adjustProductionTaskQuantity: this.adjustProductionTaskDuration
    }
    this.sharedTask.sendAdjustProdToBeAssigned(adjProd);
    this.keepQuantity = !(this.adjustProductionTaskDuration);
  }

  packtaskMaxQuantityBlur(listOfPackDetail, index) {
    if (this.prodData) {
      if (this.prodData.newQuantity !== null && this.prodData.newStartDate !== null && this.prodData.newEndDate !== null) {
        if (listOfPackDetail.QuantItemsMax === "") {
          listOfPackDetail.QuantItemsMax = 0;
        }
        if (listOfPackDetail.QuantItems !== null) {
          var quantItemsMax = this.getCalculatedMaxQuantity(listOfPackDetail);
          if (Number(listOfPackDetail.QuantItemsMax) > Number(quantItemsMax)) {
            if (!(listOfPackDetail.IsBulkTask)) {
              listOfPackDetail.QuantItemsMax = String(quantItemsMax);
              this.toastr.error('Suggested max quantity cannot be more than ' + quantItemsMax + ' (Calculated using formula: Suggested max = Required quantity/yield)', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            }
          } else if (Number(listOfPackDetail.QuantItems) > Number(listOfPackDetail.QuantItemsMax)) {
            listOfPackDetail.QuantItemsMax = String(listOfPackDetail.QuantItems);
            this.toastr.error('Suggested max quantity should be greater than or equal to required quantity', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
          }
        }
        // increase/decrese bulk then:- this.checkMaxQuantity[index]= String(listOfPackDetail.QuantItemsMax); Otherwise blur event will 
        // fire it there is no edit also, so if we do not do this line then our checkMaxQuantity will be the old one and we will get old delta 
        if (Number(listOfPackDetail.QuantItemsMax) !== Number(this.checkMaxQuantity[index])) {
          this.packDatesReset();
          var maxDeltaStatus;
          var maxDeltaValue;
          if (Number(listOfPackDetail.QuantItemsMax) > Number(this.checkMaxQuantity[index])) {
            maxDeltaStatus = 'added';
            maxDeltaValue = Number(listOfPackDetail.QuantItemsMax) - Number(this.checkMaxQuantity[index]);
          } else if (Number(listOfPackDetail.QuantItemsMax) < Number(this.checkMaxQuantity[index])) {
            maxDeltaStatus = 'removed';
            maxDeltaValue = Number(this.checkMaxQuantity[index]) - Number(listOfPackDetail.QuantItemsMax);
          }

          if (!(listOfPackDetail.IsBulkTask)) {
            if (maxDeltaStatus === 'added') {
              for (let k = 0; k < this.modifyTaskDurationObject.listOfPackDetails.length; k++) {
                if (this.modifyTaskDurationObject.listOfPackDetails[k].Checked) {
                  if (this.modifyTaskDurationObject.listOfPackDetails[k].IsBulkTask) {
                    /*If increased any pack task max quantity, then remove delta from bulk task only*/
                    /**If delta greater than bulk then reduce from bulk, remaining delta will be added to prod */
                    const decreasedMaxQuantity = Number(this.modifyTaskDurationObject.listOfPackDetails[k].QuantItemsMax) - Number(maxDeltaValue);
                    if (decreasedMaxQuantity >= 0) {
                      this.modifyTaskDurationObject.listOfPackDetails[k].QuantItemsMax = String(Math.round(decreasedMaxQuantity));
                      this.checkMaxQuantity[k] = String(Math.round(decreasedMaxQuantity));
                      break;
                    } else {
                      const remainingDelta = Number(maxDeltaValue) - Number(this.modifyTaskDurationObject.listOfPackDetails[k].QuantItemsMax);
                      maxDeltaValue = remainingDelta;
                      this.modifyTaskDurationObject.listOfPackDetails[k].QuantItemsMax = 0;
                      this.checkMaxQuantity[k] = 0;
                    }
                  }
                }
              }
            } else if (maxDeltaStatus === 'removed') {
              for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
                if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
                  if (this.modifyTaskDurationObject.listOfPackDetails[j].IsBulkTask) {
                    const increasedMaxQuantity = Number(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax) + Number(maxDeltaValue);
                    if (increasedMaxQuantity >= 0) {
                      this.modifyTaskDurationObject.listOfPackDetails[j].QuantItemsMax = String(Math.round(increasedMaxQuantity));
                      this.checkMaxQuantity[j] = String(Math.round(increasedMaxQuantity));
                      break;
                    }
                  }
                }
              }
            }
          }
          // else {
          //   if (maxDeltaStatus === 'added' || maxDeltaStatus === 'removed') {
          //     this.packMaxQuantityChange.emit({ maxDeltaValue, maxDeltaStatus });
          //   }
          // }
        }
        this.checkMaxQuantity[index] = String(listOfPackDetail.QuantItemsMax);
      } else {
        listOfPackDetail.QuantItemsMax = null;
        this.clearData(listOfPackDetail.QuantItemsMax);
      }
    } else {
      listOfPackDetail.QuantItemsMax = null;
      this.clearData(listOfPackDetail.QuantItemsMax);
    }
  }

  clearData(selectedData) {
    this.toastr.clearAllToasts();
    this.toastr.error(this.warningMsg, this.warningLabel, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
  }

  getCalculatedMaxQuantity(listOfPackDetail) {
    // let durationinMins = Number(listOfPackDetail.QuantItems) / (this.packData.selectedTask.Speed * (this.packData.selectedTask.Yield / 100) * this.packData.selectedTask.SpeedFactor);
    let maxQuantity = 0;
    if (this.packData.selectedTask.Yield != 0) {
      maxQuantity = Number(listOfPackDetail.QuantItems) / (this.packData.selectedTask.Yield / 100);
    }
    let quantItemsMax = String(Math.round(maxQuantity));
    return quantItemsMax;
  }
  onUpArrowClick(selectedIndex) {
    for (let i = this.modifyTaskDurationObject.listOfPackDetails.length; i >= 0; i--) {
      // To check if tasks below it are checked
      if (i < selectedIndex && this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {


        let temp = this.modifyTaskDurationObject.listOfPackDetails[selectedIndex];
        this.modifyTaskDurationObject.listOfPackDetails[selectedIndex] = this.modifyTaskDurationObject.listOfPackDetails[i];
        this.modifyTaskDurationObject.listOfPackDetails[i] = temp;
        if (!this.isEditMode) {
          this.arrowShow();
          return;
        }
        // To check if pack tasks dates are calculated
        if (this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].BeginDate !== null &&
          this.modifyTaskDurationObject.listOfPackDetails[i].EndDate !== null) {
          let startDate = this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].BeginDate;
          let endDate = this.modifyTaskDurationObject.listOfPackDetails[i].EndDate;


          this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate = startDate;
          this.modifyTaskDurationObject.listOfPackDetails[i].EndDate = this.getPackEndDate(this.modifyTaskDurationObject.listOfPackDetails[i], startDate);
          //for Default ship date
          var shipMinDate = this.getPackEndDate(this.modifyTaskDurationObject.listOfPackDetails[i], startDate);
          shipMinDate.setDate(shipMinDate.getDate() - 1);
          this.shipDateDefault[i] = new Date(shipMinDate);
          this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].BeginDate = this.modifyTaskDurationObject.listOfPackDetails[i].EndDate;
          this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].EndDate = this.getPackEndDate(this.modifyTaskDurationObject.listOfPackDetails[selectedIndex], this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].BeginDate);
          //for Default ship date
          var shipMinDateSecond = this.getPackEndDate(this.modifyTaskDurationObject.listOfPackDetails[selectedIndex], this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].BeginDate);
          shipMinDateSecond.setDate(shipMinDateSecond.getDate() - 1);
          this.shipDateDefault[selectedIndex] = new Date(shipMinDateSecond);
          this.arrowShow();
          return;
        } else {
          this.arrowShow();
          return;
        }
      }
    }

  }
  onDownArrowClick(selectedIndex) {
    for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
      // To check if tasks below it are checked
      if (i > selectedIndex && this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {


        let temp = this.modifyTaskDurationObject.listOfPackDetails[selectedIndex];
        this.modifyTaskDurationObject.listOfPackDetails[selectedIndex] = this.modifyTaskDurationObject.listOfPackDetails[i];
        this.modifyTaskDurationObject.listOfPackDetails[i] = temp;
        if (!this.isEditMode) {
          this.arrowShow();
          return;
        }
        // To check if pack tasks dates are calculated
        if (this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].BeginDate !== null &&
          this.modifyTaskDurationObject.listOfPackDetails[i].EndDate !== null) {
          let startDate = this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate;
          let endDate = this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].EndDate;

          this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].BeginDate = startDate;
          this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].EndDate = this.getPackEndDate(this.modifyTaskDurationObject.listOfPackDetails[selectedIndex], startDate);
          //for Default ship date
          var shipMinDate = this.getPackEndDate(this.modifyTaskDurationObject.listOfPackDetails[selectedIndex], startDate);
          shipMinDate.setDate(shipMinDate.getDate() - 1);
          this.shipDateDefault[selectedIndex] = new Date(shipMinDate);
          this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate = this.modifyTaskDurationObject.listOfPackDetails[selectedIndex].EndDate;
          this.modifyTaskDurationObject.listOfPackDetails[i].EndDate = this.getPackEndDate(this.modifyTaskDurationObject.listOfPackDetails[i], this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate);
           //for Default ship date
           var shipMinDateSecond =  this.getPackEndDate(this.modifyTaskDurationObject.listOfPackDetails[i], this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate);
           shipMinDateSecond.setDate(shipMinDateSecond.getDate() - 1);
           this.shipDateDefault[i] = new Date(shipMinDateSecond);
          this.arrowShow();
          return;
        } else {
          this.arrowShow();
          return;
        }
      }
    }

  }

  getPackEndDate(selectedTask, startDate) {
    let DurationinMins: any;
    if (selectedTask.QuantItems !== null && this.packData.selectedTask.Yield !== null) {
      // Duration in mins = Req qty/( (yield/100) * (speed*speed factor) )
      if (this.packData.selectedTask.Speed !== 0 && this.packData.selectedTask.Yield !== 0 && this.packData.selectedTask.SpeedFactor !== 0) {
        DurationinMins = Number(selectedTask.QuantItems) / ((this.packData.selectedTask.Yield / 100) * (this.packData.selectedTask.Speed * this.packData.selectedTask.SpeedFactor));
      } else {
        DurationinMins = 0;
      }
    }
    if (DurationinMins === undefined) {
      DurationinMins = 0
    }
    const startNewDateVal = new Date(startDate);
    const mcreatedDate: any = startNewDateVal;
    let durationInMs = DurationinMins * 60000;
    mcreatedDate.setMilliseconds(startNewDateVal.getMilliseconds() + durationInMs + 462);
    return new Date(mcreatedDate);
    // this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = new Date(mcreatedDate);
    // this.checkEndDate[index] = new Date(mcreatedDate);

  }

  calculatePackTaskDates() {
    if (this.isProdDataAvailable) {
      var emptyFlag = false;
      for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
        if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
          if (this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems === null || this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems === "") {
            emptyFlag = true;
            break;
          }
        }
      }
      if (!emptyFlag) {
        let requiredQuantitySum = 0;
        let suggestedMaxSum = 0;
        for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
          if (this.modifyTaskDurationObject.listOfPackDetails[i].IsBulkTask &&
            this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
            if (Number(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems) === 0) {
              this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems = 1;
            }
            if (Number(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItemsMax) === 0) {
              this.modifyTaskDurationObject.listOfPackDetails[i].QuantItemsMax = 1;
            }
          }
          if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
            requiredQuantitySum = Number(requiredQuantitySum) + Number(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItems);
            suggestedMaxSum = Number(suggestedMaxSum) + Number(this.modifyTaskDurationObject.listOfPackDetails[i].QuantItemsMax);
          }
        }
        this.calculatePackTaskDate.emit({ requiredQuantitySum, suggestedMaxSum });
        this.setPackDates();
      } else {
        this.toastr.error('Please fill Required Quantity and Suggested Max.', this.constant.informationLabel, {
          showCloseButton: true, maxShown: 1
        });
      }
    }
  }

  setPackDates() {
    // let bulkIndex = null;
    // for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
    //   if (this.modifyTaskDurationObject.listOfPackDetails[i].IsBulkTask) {
    //     bulkIndex = i;
    //     break;
    //   }
    // }
    // if (bulkIndex !== null) {
    //   this.modifyTaskDurationObject.listOfPackDetails.push(this.modifyTaskDurationObject.listOfPackDetails.splice(bulkIndex, 1)[0]);
    //   this.arrowShow(); /** to show the sequencing arrow */
    // }
    for (let j = 0; j < this.modifyTaskDurationObject.listOfPackDetails.length; j++) {
      if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
        this.calculatePackTaskStartEndDates(this.modifyTaskDurationObject.listOfPackDetails[j].QuantItems, j, this.prodData.newStartDate);
        break;
      }
    }
  }

  calculatePackTaskStartEndDates(newQuantityVal, index, startNewDate): void {
    // if (this.modifyTaskDurationObject.listOfPackDetails[index].IsBulkTask &&
    //   this.modifyTaskDurationObject.listOfPackDetails[index].Checked) {
    //     /** 1) If only one pack task that is bulk :- We need to set both start & end date.
    //      * 2) If more than one pack task :- Assign bulk end date as prod end date, (not needed: then calculate quantities of bulk task based on this duration).
    //     */
    //   if (this.modifyTaskDurationObject.listOfPackDetails.length === 1 && this.modifyTaskDurationObject.listOfPackDetails[0].IsBulkTask && this.modifyTaskDurationObject.listOfPackDetails[0].Checked) {
    //     /** 1) Only one pack task which is bulk.*/
    //     this.modifyTaskDurationObject.listOfPackDetails[index].BeginDate = this.prodData.newStartDate;
    //     this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = this.prodData.newEndDate;
    //   } else {
    //     /** 2 */
    //     this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = this.prodData.newEndDate;
    //     // const startNewDate: any = new Date(this.modifyTaskDurationObject.listOfPackDetails[index].BeginDate);
    //     // const startNewEnddate: any = new Date(this.modifyTaskDurationObject.listOfPackDetails[index].EndDate);
    //     // const diff: any = Math.abs((startNewDate) - (startNewEnddate));
    //     // // const minutes: any = Math.floor((diff / 1000) / 60);
    //     // const minutes: any = (diff / 1000) / 60;
    //     // let bulkRequiredQuantity = minutes * this.packData.selectedTask.Speed * this.packData.selectedTask.SpeedFactor * (this.packData.selectedTask.Yield / 100);
    //     // let suggestedMaxQuantity = minutes * this.packData.selectedTask.Speed * this.packData.selectedTask.SpeedFactor;
    //     // this.modifyTaskDurationObject.listOfPackDetails[index].QuantItems = String(Math.round(bulkRequiredQuantity));
    //     // this.modifyTaskDurationObject.listOfPackDetails[index].QuantItemsMax = String(Math.round(suggestedMaxQuantity));
    //   }
    // } else {
      let DurationinMins: any;
      if (this.packData.selectedTask !== undefined) {
        if (this.packData.selectedTask.Speed !== 0 && this.packData.selectedTask.Yield !== 0 && this.packData.selectedTask.SpeedFactor !== 0) {
          DurationinMins = Number(newQuantityVal) / ((this.packData.selectedTask.Yield / 100) * this.packData.selectedTask.Speed * this.packData.selectedTask.SpeedFactor);
        } else {
          DurationinMins = 0;
        }
      }
      if (DurationinMins === undefined) {
        DurationinMins = 0
      }
      this.startNewDateVal = new Date(startNewDate);
      this.modifyTaskDurationObject.listOfPackDetails[index].BeginDate = new Date(startNewDate); // Added a new line for the start new date for the pack
      this.checkStartDate[index] = new Date(startNewDate);
      const mcreatedDate: any = this.startNewDateVal;
      let durationInMs = DurationinMins * 60000;
      mcreatedDate.setMilliseconds(this.startNewDateVal.getMilliseconds() + durationInMs + 462);
      this.modifyTaskDurationObject.listOfPackDetails[index].EndDate = new Date(mcreatedDate);
      this.checkEndDate[index] = new Date(mcreatedDate);
      //for Default ship date
      var shipMinDate = mcreatedDate;
      shipMinDate.setDate(shipMinDate.getDate() - 1);
      this.shipDateDefault[index] = new Date(shipMinDate);

      for (let i = index + 1; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
        if (this.modifyTaskDurationObject.listOfPackDetails[i].Checked) {
          // the next checked pack start date should be the previous checked pack end date
          var previousCheckedIndex = null;
          for (let j = i - 1; j >= 0; j--) {
            if (this.modifyTaskDurationObject.listOfPackDetails[j].Checked) {
              previousCheckedIndex = j;
              break;
            }
          }
          var startNewEnddateVal;
          if (previousCheckedIndex === null) {
            startNewEnddateVal = this.prodData.newStartDate;
          } else {
            startNewEnddateVal = new Date(this.modifyTaskDurationObject.listOfPackDetails[previousCheckedIndex].EndDate);
          }
          const mcreatedDateVal: any = startNewEnddateVal;
          mcreatedDateVal.setMilliseconds(startNewEnddateVal.getMilliseconds() + Math.round(0));
          this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate = new Date(mcreatedDateVal);
          this.checkStartDate[i] = new Date(mcreatedDateVal);
          this.calculateNextPackTaskStartEndDates(this.modifyTaskDurationObject.listOfPackDetails[i], i);
          break; /**for unwanted looping - check */
        }
      }
    // }
  }

  calculateNextPackTaskStartEndDates(selectedRecord, index): void {
    if (selectedRecord.BeginDate !== null) {
      if (selectedRecord.Checked) {
        const mstart: any = new Date(selectedRecord.BeginDate);
        const mend: any = new Date(selectedRecord.EndDate);
        this.calculatePackTaskStartEndDates(selectedRecord.QuantItems, index, mstart);
      }
    }
  }

  packDatesReset() {
    for (let i = 0; i < this.modifyTaskDurationObject.listOfPackDetails.length; i++) {
      if (this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate !== null) {
        this.modifyTaskDurationObject.listOfPackDetails[i].BeginDate = null;
      }
      if (this.modifyTaskDurationObject.listOfPackDetails[i].EndDate !== null) {
        this.modifyTaskDurationObject.listOfPackDetails[i].EndDate = null;
      }
      // if (this.modifyTaskDurationObject.listOfPackDetails[i].ShipDate !== null) {
      //   this.modifyTaskDurationObject.listOfPackDetails[i].ShipDate = null;
      // }
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
