import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { BreadcrumbComponent } from './breadcrumb.component';
import 'mdn-polyfills/Object.assign';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import { LoginService } from './services/login/login.service';
import { UrlgeneratorService } from './utill/urlgenerator/urlgenerator.service';
import { ApicallService } from './utill/apicall/apicall.service';
import { DashboardService } from './services/home/dashboard.service';
import { ProductionService } from './services/home/production.service';
import { ManningService } from './services/home/manning.service';
import { SharedService } from './services/home/shared.service';
import { TaskService } from './services/home/task.service';
import { SharedtaskService } from './services/home/sharedtask.service';

import { DashboardComponent } from './home/dashboard/dashboard.component';
import { Constant } from './utill/constants/constant';
import { Languageconstant } from './utill/constants/languageconstant';
import { LoaderComponent } from './common/loader/loader.component';
import { DialogComponent } from './common/dialog/dialog.component';
import { RouterModule, Routes } from '@angular/router';

import { SqueezeBoxModule } from 'squeezebox';
import { MyDatePickerModule } from 'mydatepicker';
import { DataTableModule } from "angular2-datatable";
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';


import { DataFilterPipe } from './common/filters/data-filter.pipe';
// import { RespondComponent } from './home/dashboard/respond/respond.component';
import { ProductionComponent } from './home/dashboard/scheduling/productions/production.component';

// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';



// Popover
import { PopoverModule } from "ngx-popover";
import { NgxPopperModule } from 'ngx-popper';
import { PrimaryComponent } from './home/dashboard/scheduling/packs/primary.component';
import { DatePipe } from '@angular/common';
import { ManningComponent } from './home/dashboard/manning/manning/manning.component';
import { MasterInputsComponent } from './home/dashboard/manning/master-inputs/master-inputs.component';

// import {A2Edatetimepicker} from 'ng2-eonasdan-datetimepicker';
// import 'eonasdan-bootstrap-datetimepicker';
// import { DateTimePickerDirective } from 'ng2-eonasdan-datetimepicker/dist/datetimepicker.directive';

import tableDragger from 'table-dragger';

//Sticky
import { StickyModule } from 'ng2-sticky-kit';
// import { ExportComponent } from './home/dashboard/scheduling/productions/export/export.component';
import { ExportpageComponent } from './exportpage/exportpage.component';

import {NgSelectModule} from '@ng-select/ng-select';
import { ConfigurefurnacecapacityComponent } from './home/dashboard/scheduling/configurefurnacecapacity/configurefurnacecapacity.component';
import { AddtaskComponent } from './home/dashboard/scheduling/addtask/addtask.component';
import { EdittaskComponent } from './home/dashboard/scheduling/edittask/edittask.component';
import { GammeoptionComponent } from './home/dashboard/scheduling/edittask/gammeoption/gammeoption.component';
import { ProductiontaskComponent } from './home/dashboard/scheduling/edittask/productiontask/productiontask.component';
import { PacktaskComponent } from './home/dashboard/scheduling/edittask/packtask/packtask.component';
import { TasksummaryComponent } from './home/dashboard/scheduling/edittask/tasksummary/tasksummary.component';
import { CommentsComponent } from './home/dashboard/scheduling/edittask/comments/comments.component';

import { NgIdleModule } from '@ng-idle/core';
import { ManningprintComponent } from './manningprint/manningprint.component';

const routes: Routes = [
   { path: '', redirectTo: '/login', pathMatch: 'full' },
   { path: 'login', component: LoginComponent, },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard/productions/:view/exportpage', component: ExportpageComponent, pathMatch: 'full'},
  { path: 'dashboard/manning/manningprint', component: ManningprintComponent, pathMatch: 'full'},
 
  {
    path: 'dashboard', component: HomeComponent,
    children: [
      { path: '', component: ProductionComponent, pathMatch: 'full'  },
      { path: 'productions/:view', component: ProductionComponent, pathMatch: 'full'  },
      { path: 'packs/:view', component: PrimaryComponent, pathMatch: 'full'  },
      { path: 'manning', component: ManningComponent, pathMatch: 'full'},
      { path: 'masterInputs', component: MasterInputsComponent, pathMatch: 'full'  },
      // { path: 'productions/:view/task/:task/:item', component: AddtaskComponent, pathMatch: 'full'  }
      { path: 'productions/:view/create/task', component: AddtaskComponent, pathMatch: 'full'  },
      { path: 'productions/:view/configurefurnacecapacity', component: ConfigurefurnacecapacityComponent, pathMatch: 'full'},
      { path: 'productions/:view/editTask/:taskId', component: EdittaskComponent, pathMatch: 'full'  },
    ]
  },
];
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
enableProdMode();

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    LoaderComponent,
    BreadcrumbComponent,
    DialogComponent,
    DataFilterPipe,
    // FileSelectDirective,
    ProductionComponent,
    PrimaryComponent,
    ManningComponent,
    MasterInputsComponent,
    ExportpageComponent,
    ConfigurefurnacecapacityComponent,
    AddtaskComponent,
    EdittaskComponent,
    GammeoptionComponent,
    ProductiontaskComponent,
    PacktaskComponent,
    TasksummaryComponent,
    CommentsComponent,
    ManningprintComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ToastModule.forRoot(),
    RouterModule.forRoot(routes, { useHash: true }),
    // MdDialogModule,
    // MaterialModule,
    AsyncLocalStorageModule,
    AngularMultiSelectModule,
    SqueezeBoxModule,
    MyDatePickerModule,
    DataTableModule,
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    PopoverModule,
    NguiDatetimePickerModule,
    NgxPopperModule,
    StickyModule,
    NgSelectModule,
    NgIdleModule.forRoot()
  ],
  providers: [DatePipe, LoginService, Constant, UrlgeneratorService, ApicallService, Languageconstant,
    DashboardService, ProductionService, ManningService, SharedService, TaskService, SharedtaskService
  ],

  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule { }
