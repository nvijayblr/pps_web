import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { Languageconstant } from '../utill/constants/languageconstant';
import { Constant } from '../utill/constants/constant';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AsyncLocalStorage } from 'angular-async-local-storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  public creds = {
    grant_type: '',
    username: '',
    password: '',
    client_id: '',
    domainID: ''
  };

  public loading = false;
  public showValidationErrors = false;
  public hideEmailError = false;
  public hidePasswordError = false;
  public rememberme:boolean = false;
  public invalidLoginMessage = '';
  public domainObject = [];
  public localization = {
    companyName: '',
    signInMessage: '',
    emailValidationMessage: '',
    emailLabel: '',
    passwordValidationMessage: '',
    passwordLabel: '',
    rememberMe: '',
    forgotPasswordLabel: '',
    signInButtonLabel: ''
  }
  public failureHead = "Failure!";
  public failureMsg = "Login Failed"

  constructor(private router: Router,
    private loginService: LoginService,
    private languageconstant: Languageconstant,
    private constant: Constant,
    protected storage: AsyncLocalStorage,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    localStorage.removeItem("userData");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("transactions");
    // TODO functionalities to be done on init of application
    this.setLanguageConstants();
    this.loadDomainList();
  }

  /**
   * @desc localization config
   **/
  setLanguageConstants(): void {
    const lang = this.languageconstant.Language;
    this.localization = {
      companyName: this.languageconstant.Login[lang].companyName,
      signInMessage: this.languageconstant.Login[lang].signInMessage,
      emailValidationMessage: this.languageconstant.Login[lang].emailValidationMessage,
      emailLabel: this.languageconstant.Login[lang].emailLabel,
      passwordValidationMessage: this.languageconstant.Login[lang].passwordValidationMessage,
      passwordLabel: this.languageconstant.Login[lang].passwordLabel,
      rememberMe: this.languageconstant.Login[lang].rememberMe,
      forgotPasswordLabel: this.languageconstant.Login[lang].forgotPasswordLabel,
      signInButtonLabel: this.languageconstant.Login[lang].signInButtonLabel
    }
  }

  gotoDashboard(): void {
    let isValid = false;
    if (this.creds.username.length === 0) {
      this.toastr.error('Please enter valid username', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
    if (this.creds.username.length > 0) {
      if (this.creds.password.length === 0) {
        this.toastr.error('Please enter valid password', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
      }
    }
    if (this.creds.username.length > 0) {
      if (this.creds.password.length > 0) {
        if (this.creds.domainID.length === 0) {
          this.toastr.error('Please Choose domain name', 'Warning!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        }
      }
    }

    if (this.creds.username.length > 0 && this.creds.password.length > 0 && this.creds.domainID) {
      isValid = true;
    }
    if (isValid) {
      this.loading = true;
      var domainID = this.creds.domainID.toString();
      var newCreds1 = "Username=" + encodeURIComponent(this.creds.username)
        + "&Password=" + encodeURIComponent(this.creds.password)
        + "&DomainID=" + encodeURIComponent(domainID)
        ;
      this.loginService.loginUserAuth(newCreds1, response => {
        if (response.responseCode === 200) {
          var jsonData = JSON.parse(response.data);
          var accessToken = jsonData.access_token;
          localStorage.setItem('access_token', jsonData.access_token);
          localStorage.setItem('refresh_token', jsonData.refresh_token);
          localStorage.setItem('expires_in', jsonData.expires_in);
          localStorage.setItem("userData", btoa(accessToken));
          let reqBody = {
            "Username": this.creds.username,
            "Password": this.creds.password,
            "DomainID": domainID
          }
          this.loginService.getAuthorization(reqBody, response => {
            if (response.responseCode === 200) {
              let responseData = response.data;
              localStorage.setItem("userId", btoa(response.data[0].UserId));
              localStorage.setItem("userName", btoa(response.data[0].UserName));
              localStorage.setItem("transactions", btoa(JSON.stringify(responseData)));
              /**Scheduling and Manning module access checking (Negative flow checking) */
              if (responseData[0].RoleModuleTransactions.length !== 0) {
                if (responseData[0].RoleModuleTransactions.length === 1 && responseData[0].RoleModuleTransactions[0].Module.ModuleCode === this.constant.moduleArray[5]) {
                  const link = ['dashboard/manning'];
                  this.router.navigate(link);
                } else {
                  const link = ['dashboard'];
                  this.router.navigate(link);
                }
              } else {
                this.toastr.error('You do not have access to PPS modules', this.failureHead, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
              }
            } else {
              this.toastr.error(this.failureMsg, this.failureHead, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            }
            this.loading = false;
          }, error => {
            this.toastr.error(this.failureMsg, this.failureHead, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
            this.loading = false;
          })
        }
        else if (response.responseCode === 404) {
          this.toastr.error('Invalid Username or Password.', this.failureHead, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
          this.loading = false;
        } else {
          this.toastr.error(this.failureMsg, this.failureHead, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
          this.loading = false;
        }
        if(jsonData && response.responseCode == 200) {
          if(this.rememberme) {
            let formData = {
              username: this.creds.username,
              DomainID: this.creds.domainID,
              rememberme: this.rememberme
            }
            localStorage.setItem("arcloginuser", JSON.stringify(formData));
          } else {
            localStorage.removeItem("arcloginuser");
          }
        }
      }, error => {
        this.toastr.error(this.failureMsg, this.failureHead, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
        this.loading = false;
      });
    } else {
      //this.toastr.error('Please fill all the fields', 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastLife });
    }
  }

  //List domain names
  loadDomainList() {
    this.loginService.getDomainList(response => {
      let domainTemp = response.data;
      this.domainObject = (domainTemp) ? domainTemp : [];
      let storedUser:any = JSON.parse(localStorage.getItem('arcloginuser'));
      if(storedUser && storedUser.username && storedUser.DomainID) {
        this.creds.domainID = storedUser.DomainID;
        this.creds.username = storedUser.username;
        this. rememberme = storedUser.rememberme;
      }
    }, error => {
      this.onErrorToastMessage('Failed to load domains');
    });
  }

  /**
   * @desc track the model change for hiding the validation messages
   **/
  valueChange(): void {
    if (this.creds.username.length > 0) {
      this.hideEmailError = true;
    } else { this.hideEmailError = false }

    if (this.creds.password.length > 0) {
      this.hidePasswordError = true;
    } else { this.hidePasswordError = false }
  }

  /**
   * @desc Redirect to homepage
   **/
  gotoHomePage(): void {
    const link = ['dashboard/'];
    this.router.navigate(link);
  }

  /**
   * @desc Redirect to forgot password screen
   **/
  gotoForgotPassword(): void {
    const link = ['forgotPassword'];
    this.router.navigate(link);
  }

  /**
   * @desc Redirect to reset password screen
   **/
  gotoResetPassword(): void {
    const link = ['resetPassword', 123];
    this.router.navigate(link);
  }

  /**
   * @desc Generic function for showing success toast message
   **/
  onSuccessToastMessage(message): void {
    this.loading = false;
    this.toastr.success(message, 'Success!', { showCloseButton: true, maxShown: 1 });
  }

  /**
   * @desc Generic function for showing error toast message
   **/
  onErrorToastMessage(message): void {
    this.loading = false;
    this.toastr.error(message, 'Failure!', { showCloseButton: true, maxShown: 1 });
  }
}
