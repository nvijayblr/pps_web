import { VOID_VALUE } from '@angular/animations/browser/src/render/transition_animation_engine';
import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DashboardService } from '../../services/home/dashboard.service';
import { Languageconstant } from '../../utill/constants/languageconstant';
import { Constant } from '../../utill/constants/constant';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { IMyDpOptions } from 'mydatepicker';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import * as $ from 'jquery'
import { DataTableModule } from 'angular2-datatable';
import { DatePipe } from '@angular/common';

import jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
const doc = new jsPDF('p', 'pt', 'a4');

@Component({
    selector: 'app-dashboard',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [DatePipe]
})
export class DashboardComponent implements OnInit {

    constructor(
        private router: Router,
        private languageconstant: Languageconstant,
        private toastr: ToastsManager,
        private datePipe: DatePipe,
        private activatedRoute: ActivatedRoute,
        public constant: Constant,
        private vcr: ViewContainerRef
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {

    }

}
