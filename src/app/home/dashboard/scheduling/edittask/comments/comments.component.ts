import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { TaskService } from '../../../../../services/home/task.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Constant } from '../../../../../utill/constants/constant';
import { SharedtaskService } from '../../../../../services/home/sharedtask.service';
import { SharedService } from '../../../../../services/home/shared.service';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() commentsData;

  public comments;
  public isComments = false;
  public ingressComments = false;
  public reasonforChange = '0';
  public reasonforChangedata = [];
  public reasonforChangeList = [];
  public commentslist:any =[];
  public taskId;
  public loading = false;
  public isEditMode = false;
  constructor(private taskService: TaskService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private constant: Constant,
    private sharedService: SharedService,
    private sharedTask: SharedtaskService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.sharedTask.prodAndPackDetailsToBeAssigned$.subscribe(
      data => {
        if (data != null && data != undefined) {
          this.isEditMode = data.isEditMode;
          data.reasonforChange = this.reasonforChange;
          data.comments = this.comments;
        }
      });
  }

  ngOnInit() {
    if(this.isEditMode) {
    this.getReasonForChangeFromAPI();
    }
    if(this.isEditMode) {
      this.getCommentDetailsFromAPI();
    }
  }

  getReasonForChangeFromAPI() {
    this.loading = true;
    this.taskService.ReasonForChangeFromAPI( response => {
      this.loading = false;
      if (response.responseCode === 200) {
       this.reasonforChangeList = response.data;
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
  
  getCommentDetailsFromAPI() {
    this.loading = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.taskId = params['taskId'];
    });
    this.taskService.CommentDetailsFromAPI(this.taskId, response => {
      if (response.responseCode === 200) {
        this.loading = false;
        this.commentslist = response.data;
        if (response.data.IngressComment !== '') {
          this.ingressComments =  true;
        } else {
          this.ingressComments = false;
        }
        if (response.data.TaskEditComments !== null) {
          this.isComments = true;
          for (var j = 0; j < response.data.TaskEditComments.length; j++) {
            this.commentslist.TaskEditComments[j].ModifiedDate = this.sharedService.getDateAMPMFormat(response.data.TaskEditComments[j].ModifiedDate);
          }
        } else {
          this.isComments = false;
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
