import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Constant } from '../utill/constants/constant';
import { UrlgeneratorService } from '../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../utill/apicall/apicall.service';
// import { SharedService } from '../services/home/shared.service';
// import { BreadcrumbService } from '../services/common/breadcrumb.service';
import { MenuItem } from 'primeng/primeng';
import { Languageconstant } from '../utill/constants/languageconstant';
import { LocationStrategy } from '@angular/common';
import { LoginService } from '../services/login/login.service';

@Component({
    selector: 'app-home',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    // test Ramesh
    public breadCrumb;
    public objBreadcrumbs: MenuItem[];
    public isSchedule = true;
    public logOut = false;
    public username = '';
    public manningTabAccess = null;
    public schedulingTabAccess = null;
    public homeLocalization = {
        footerLabel: '',
        profileLabel: '',
        logoutLabel: '',
        projectNameLabel: '',
        toggleNavigationLabel: '',
        toggleSearch: ''
    }
    public environment = {
        EnvironmentName: 'test',
        Version: ''
    };
    public idleTimedOut: Boolean = false;

    constructor(
        private router: Router,
        private constant: Constant,
        public urlgeneratorService: UrlgeneratorService,
        public apicallService: ApicallService,
        // public sharedService: SharedService,
        private languageconstant: Languageconstant,
        // private breadcrumbService: BreadcrumbService
        private location: LocationStrategy,
        private loginService: LoginService,
        private idle: Idle
    ) {
        this.objBreadcrumbs = [];

        /*Idle / Session timeout*/
        let expires_in = +localStorage.getItem('expires_in');
        this.idle.setIdle(expires_in);
        this.idle.setTimeout(2);
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        
        idle.onIdleEnd.subscribe(() => {
            //console.log('Idle end.')
        });
        
        idle.onTimeout.subscribe(() => {
          //alert('Timed out!');
          this.idleTimedOut = true;
        });
        
        idle.onIdleStart.subscribe(() => {
            //console.log('onIdleStart');
        });
        
        idle.onTimeoutWarning.subscribe((countdown) => {
            //console.log(countdown);
        });
        
        this.reset();
    }
    
    reset() {
        this.idle.watch();
        this.idleTimedOut = false;
    }

    ngOnDestroy() {
        this.idle.stop();
    }

    ngOnInit() {
        this.manningTabAccess = this.loginService.getUserTransaction(this.constant.moduleArray[5]);
        var apiData = JSON.parse(atob(localStorage.getItem("transactions")));
        if (apiData[0].RoleModuleTransactions.length === 1 && apiData[0].RoleModuleTransactions[0].Module.ModuleCode === this.constant.moduleArray[5]) {
            this.schedulingTabAccess = null;
        } else {
            this.schedulingTabAccess = true;
        }
        localStorage.removeItem('weekStartday');
        this.setLanguageConstants();
        let locationDetails = (<any>this.location)._platformLocation.location;
        let manningIndex = locationDetails.href.indexOf('manning');
        let masterInputsIndex = locationDetails.href.indexOf('masterInputs');
        if (manningIndex != -1 || masterInputsIndex != -1) {
            this.isSchedule = false;
        }
        if (localStorage.getItem("userName") !== null) {
            this.username = atob(localStorage.getItem("userName"));
        }

        this.getAppInfo();
        
        // this.breadcrumbService.breadcrumbItem.subscribe((val: MenuItem[]) => {
        //     if (val) {
        //         this.objBreadcrumbs = val;
        //         // test
        //     }
        // });
    }

    getAppInfo(): void {
        const apiUrl = this.urlgeneratorService.getAppInfoUrl();
        this.apicallService.doGetAPIAction(apiUrl, response => {
          let _data = JSON.parse(response._body);
           if(_data && _data.data) {
               this.environment.EnvironmentName = _data.data.EnvironmentName;
               this.environment.Version = _data.data.Version;
           }
        }, error => {
          console.log(error);
        });
    }

    setLanguageConstants(): void {
        const lang = this.languageconstant.Language;
        this.homeLocalization = {
            footerLabel: this.languageconstant.home[lang].footerLabel,
            profileLabel: this.languageconstant.home[lang].profileLabel,
            logoutLabel: this.languageconstant.home[lang].logoutLabel,
            projectNameLabel: this.languageconstant.home[lang].projectNameLabel,
            toggleNavigationLabel: this.languageconstant.home[lang].toggleNavigationLabel,
            toggleSearch: this.languageconstant.home[lang].toggleSearch,
        }
    }

    onLogoutBtnClick(): void {
        this.logOut = true;
    }

    onLogoutOkClick(): void {
        localStorage.removeItem("userData");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("transactions");
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_in");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("printModelData");
        localStorage.removeItem("printManningData");
        localStorage.removeItem('savedNChannel');
        localStorage.removeItem('savedNom');
        localStorage.removeItem('prodMinQuantity');
        localStorage.removeItem('prodMaxQuantity');
        const link = ['login'];
        this.router.navigate(link);
    }
    onLogoutCancelClick(): void {
        this.logOut = false;
    }

    gotoPage(_link): void {
        this.router.navigate(_link);
    }

    manningClick(): void {
        this.isSchedule = false;
        const link = ['dashboard/manning'];
        this.router.navigate(link);
    }

    schedulingClick(): void {
        if (!this.isSchedule) {
            this.isSchedule = true;
            const link = ['dashboard'];
            this.router.navigate(link);
        }
    }

    /*gotoDashboard(): void {
      let link = ['home/dashboard'];
      this.router.navigate(link);
    }

    gotoAdminUsers(): void {
        let link = ['home/adminUsesrs'];
        this.router.navigate(link);
    }

    gotoCustomers(): void {
        let link = ['home/customers'];
        this.router.navigate(link);
    }

    gotoCustomerUsers(): void {
        let link = ['home/customers/customerUsers'];
        this.router.navigate(link);
    }

    onSuccessDoAction(): void {
        //alert("onSuccessDoActionuewyeuweywe");
    }*/

}
