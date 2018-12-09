import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { TaskService } from '../../../../../services/home/task.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Constant } from '../../../../../utill/constants/constant';
import { SharedtaskService } from '../../../../../services/home/sharedtask.service';
import { SharedService } from '../../../../../services/home/shared.service';

@Component({
  selector: 'app-tasksummary',
  templateUrl: './tasksummary.component.html',
  styleUrls: ['./tasksummary.component.css']
})
export class TasksummaryComponent implements OnInit {
  @Input() taskSummaryData;
  @Output() itemNumberCleared = new EventEmitter();
  public loading = false;
  public taskSummaryObject = {
    'startDate':'',
    'endDate':''
  }
  public modifyTaskDurationObject:any = [];
  public taskId;
  public isEditMode = false;
  public taskStatusList = [];
  public itemNumberTypeahead = new EventEmitter<string>();
  public itemNumberList = [];
  public disableSpeedFactor = false;

  constructor(
    private taskService: TaskService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private constant: Constant,
    private sharedService: SharedService,
    private sharedTask: SharedtaskService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.sharedTask.prodSummaryToBeAssigned$.subscribe(data => {
      if (data != null && data != undefined) {
        this.modifyTaskDurationObject = data;
        this.isEditMode = data.isEditMode;
        if(!this.isEditMode) {
          this.getTaskStatusList();
        }
        this.taskSummaryObject.startDate = this.sharedService.getDateAMPMFormat(data.BeginDate);
        this.taskSummaryObject.endDate = this.sharedService.getDateAMPMFormat(data.EndDate);
        //this.getPackTasksFromAPI();
      }
    });

    /*ItemNumber Typeahead*/
    this.itemNumberTypeahead.subscribe(data => {
      if(data && data.length > 2) {
        this.taskService.getItemNumbers(data, response => {
          this.itemNumberList = response.data;
        }, error => {
          console.log(error);
        });
      } else {
        this.itemNumberList = [];
        this.modifyTaskDurationObject.ItemDescription = '';
        this.modifyTaskDurationObject.GrossWeight = '';
      }
    });
  }

  ngOnInit() {
  }
  
  selectedLine (LineID) {
    this.modifyTaskDurationObject.MachineDescription = LineID;
    if(LineID.indexOf('//') !== -1) {
      this.disableSpeedFactor = true;
    }else {
      this.disableSpeedFactor = false;
    }
  }

  getTaskStatusList() {
    this.taskService.getTaskStatusList(response => {
      this.taskStatusList = response.data;
    }, error => {
      console.log(error);
    });
  }

  getItemDescription(_itemNumber) {
    if(_itemNumber) {
      this.toastr.clearAllToasts();
      this.sharedTask.sendItemNumberToGetGamme(_itemNumber);
      this.taskService.getItemDescription(_itemNumber, response => {
        this.modifyTaskDurationObject.ItemDescription = response.data.length ? response.data[0].Description : '';
        this.modifyTaskDurationObject.GrossWeight = response.data.length ? response.data[0].GrossWeight : '';
      }, error => {
        console.log(error);
      });
    }
  }

  clearedItemNumber(e) {
    this.modifyTaskDurationObject.ItemDescription = '';
    this.modifyTaskDurationObject.GrossWeight = '';
    this.modifyTaskDurationObject.MachineDescription = '';
    /*TODO: Need to do empty gamme options and pack tasks*/
    this.itemNumberCleared.emit('testA');
  }

  speedFactorSetting() {
    if(this.modifyTaskDurationObject.SpeedFactor && 
      (this.modifyTaskDurationObject.SpeedFactor < 0 || 
            this.modifyTaskDurationObject.SpeedFactor > 1)) {
      this.toastr.clearAllToasts();
      this.toastr.error('Speed Factor should be between 0 and 1', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      return;
    }
    if (this.modifyTaskDurationObject.SpeedFactor === "" || this.modifyTaskDurationObject.SpeedFactor === null) {
      this.modifyTaskDurationObject.SpeedFactor = 1;
    }
    localStorage.setItem('speedFactor', btoa(this.modifyTaskDurationObject.SpeedFactor));
  }

}
