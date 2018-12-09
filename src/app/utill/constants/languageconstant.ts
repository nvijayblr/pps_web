import { Injectable } from '@angular/core';

Injectable()

export class Languageconstant {
    Language = 'English';
    Login = {
        English: {
            companyName: 'SearchInk',
            signInMessage: 'Sign into your account',
            emailValidationMessage: 'Email is required and cannot be empty',
            emailLabel: 'Email',
            passwordValidationMessage: 'Password is required and cannot be empty',
            passwordLabel: 'Password',
            rememberMe: 'Remember me',
            forgotPasswordLabel: 'Forgot password?',
            signInButtonLabel: 'Sign in'
        }
    };
    forgotPassword = {
        English: {
            forgotPasswordLabel: 'Forgot Your Password ?',
            forgotPasswordMessage: 'Input your registered email to reset your password',
            emailValidationMessage: 'Email is required and cannot be empty',
            emailLabel: 'Your Email',
            buttonLabel: 'Reset Your Password'
        }
    };
    resetPassword = {
        English: {
            resetPasswordLabel: 'Reset Your Password',
            resetPasswordMessage: 'Input your email and new password to reset',
            emailValidationMessage: 'Email is required and cannot be empty',
            emailLabel: 'Your Email',
            passwordValidationMessage: 'New Password is required and cannot be empty',
            passwordLabel: 'New password',
            confirmPasswordValidationMessage: 'Confirm Password should match new password',
            confirmPasswordLabel: 'Confirm Password',
            buttonLabel: 'Reset Your Password'
        }
    };
    dashboard = {
        English: {
            customersLabel: 'Customers',
            cusersLabel: 'Users',
            accountingLabel: 'Accounting',
            newProjectLabel: 'New Project',
            clientLabel: 'Clients',
            custUserLabel: 'Customer Users',
            DatasourcesLabel: 'Data Sources',
            WorkflowsLabel: 'Workflows',
            DestinationsLabel: 'Destinations'
        }
    };
    appButtons = {
        English: {
            deleteBtnLabel: 'Delete',
            saveBtnLabel: 'Save',
            cancelBtnLabel: 'Cancel',
            newUserBtnLabel: 'New User',
            createBtnLabel: 'Create'
        }
    };
    adminUsers = {
        English: {
            adminUsersLabel: 'Admin Users',
            userLabel: 'User',
            newuserLabel: 'New User',
            roleLabel: 'Role',
            administratorLabel: 'Administrator',
            emailLabel: 'Email',
            activeLabel: 'Active',
            passwordLabel: 'Password',
            sendPwdEmailBtnLabel: 'Send Password Reset Email',
            newUserLabel: 'Name',
            userNameValidationMessage: 'User name is required and cannot be empty',
            emailValidationMessage: 'Email is required and cannot be empty',
            passwordValidationMessage: 'Password is required and cannot be empty',
            createUserLabel: 'Create New User',
            newUserValidationMessage: 'User name is required and cannot be empty',
            addAdminuserContent: 'There is no data for admin user, for to add click on Add Admin User button',
            addAdminBtnLbl: 'Add Admin User'
        }
    };
    customers = {
        English: {
            newUserLabel: 'New Customer',
            newCustomerBtnLabel: 'New Customer',
            settingsTabLabel: 'Settings',
            usersTabLabel: 'Users',
            nameFieldLabel: 'Name',
            nameFieldError: 'Name is required and cannot be empty',
            tableLabelEmail: 'Email',
            tableLabelActive: 'Active',
            tableLabelRole: 'Role',
            tableLabelDelete: 'Delete',
            emailFieldLabel: 'Email',
            passwordFieldLabel: 'Password',
            activeFieldLabel: 'Active',
            emptyCustomerMessage: 'There is no data for customers, to add a new customer click on Add Customer button',
            addCustomerButton: 'Add Customer'
        }
    };
    clients = {
        English: {
            newUserLabel: 'New Client',
            newCustomerBtnLabel: 'New Client',
            settingsTabLabel: 'Settings',
            usersTabLabel: 'Users',
            nameFieldLabel: 'Name',
            nameFieldError: 'Name is required and cannot be empty',
            tableLabelEmail: 'Email',
            tableLabelActive: 'Active',
            tableLabelRole: 'Role',
            tableLabelDelete: 'Delete',
            emailFieldLabel: 'Email',
            passwordFieldLabel: 'Password',
            activeFieldLabel: 'Active',
            emptyCustomerMessage: 'There is no data for clients, to add a new client click on Add Client button',
            addCustomerButton: 'Add Client'
        }
    };
    customerUsers = {
        English: {
            customerUsersLabel: 'Customer Users',
            userLabel: 'User',
            roleLabel: 'Role',
            administratorLabel: 'Administrator',
            emailLabel: 'Email',
            activeLabel: 'Active',
            passwordLabel: 'Password',
            sendPwdEmailBtnLabel: 'Send Password Reset Email',
            newUserLabel: 'Name',
            userNameValidationMessage: 'User name is required and cannot be empty',
            emailValidationMessage: 'Email is required and cannot be empty',
            passwordValidationMessage: 'Password is required and cannot be empty',
            createUserLabel: 'Create New User',
            newUserValidationMessage: 'User name is required and cannot be empty',
            newuserLbl: 'New User',
            addCustomerContent: 'There is no data for customer users, to add a new user click on Add Customer User button',
            addCustomerBtnLabel: 'Add CustomerUser',
        }
    };
    workflow = {
        English: {
            newWorkflowBtnLabel: 'New Workflow',
            settingsLabel: 'Settings',
            stepsLabel: 'Steps',
            nameFieldLabel: 'Name',
            AddWorkflowcontntLbl: 'There is no data for workflows, to add a new workflow click on Add Workflow button',
            AddWorkflowBtnLbl: 'Add Workflow',
            TabcontentLbl: 'Coming Soon !!',
            
        }
    };
    datasource = {
        English: {
            dynamicBtnContent: 'Add Data Source',
            noDataLblContent: 'There is no Data Sources for the user, for to add click on Add Data Source button',
            settingsName: 'Name',
            settingsPollInterval: 'Polling Interval',
            setiingsDataSourceType: 'Type',
            watchedUser: 'User',
            watchedBaseDirectory: 'Base Directory',
            watchedPort: 'Port',
            watchedPassword: 'Password',
            watchedKey: 'Key',
            tabdemoContent: 'Coming Soon !!',
            dataSourceCancelBtn: 'Cancel',
            dataSourceSaveBtn: 'Save',
            dataSourceNewBtn: 'New'

        }
    };
    destination = {
        English: {
            dynamicBtnContent: 'Add Destination',
            noDataLblContent: 'There is no Destinations for the user, for to add click on Add Destination button'
        }
    }
    projects = {
        English: {
            newProjectLbl: 'New Project',
            SettingsLbl: 'Settings',
            DatasourcesLbl: 'Datasources',
            WorkflowsLbl: 'Workflows',
            NameLbl : 'Name',
            ClientLbl: 'Client',
            WildcardFilterLbl: 'Wildcard Filter',
            ActionLbl: 'Action',
            DestinationsLbl: 'Destinations',
            deleteBtnLbl: 'Delete',
            AddMappingBtnLbl: 'Add Mapping',
            SaveMappingBtnLbl: 'Save Mapping',
            CancelBtnLbl: 'Cancel',
            SaveBtnLbl: 'Save',
            CreateBtnLbl: 'Create',
            AddProjectBtnLbl: 'Add Project',
            AddProjectcontntLbl:'There is no data for projects, to add a new project click on Add Project button',
        }
    }
    watchedfolder = {
        English: {
            dataSourceWatchFolderType: 'Type',
            dataSourceWatchFolderUser: 'User',
            dataSourceWatchFolderPort: 'Port',
            dataSourceWatchFolderPassword: 'Password',
            dataSourceWatchFolderKey: 'Key',
            dataSourceWatchFolderBaseDirectory: 'Base Directory'
        }
    }
    datasourcesettings = {
        English: {
            dataSourceSettingsName: 'Name',
            dataSourceSettingsPollingInterval: 'Polling Interval',
            dataSourceSettingsType: 'Type',
            nameFieldError: 'User name is required and cannot be empty'
        }
    }
    dialog = {
        English: {
            noBtnLabel: 'No',
            yesBtnLabel: 'Yes'
        }
    }
    home = {
        English: {
            footerLabel: '© 2017 SearchInk',
            logoutLabel: 'Logout',
            profileLabel: 'Profile',
            projectNameLabel: 'SearchInk',
            toggleNavigationLabel: 'Toggle navigation',
            toggleSearch: 'Toggle Search'
        }
    }
    
}
