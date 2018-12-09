import { Injectable } from '@angular/core';
import { Constant } from '../constants/constant';
import { ApicallService } from '../apicall/apicall.service';
import { AsyncLocalStorage } from 'angular-async-local-storage';


@Injectable()
export class UrlgeneratorService {

    private apiURL = this.constant.baseURL; //QA Dev Staging

    public userEmail;

    constructor(
        private constant: Constant,
        public apicallService: ApicallService,
        protected storage: AsyncLocalStorage,
    ) { }

    /**
* @desc Get URL for login authenticate data API
**/
    getAuthURL() {
        return this.apiURL + 'api/UserModuleTransactions';
    }

    /**
     * @desc Get URL for Create new claim dropdown data API
     **/
    getPrimaryProductionURL() {
        return this.apiURL + 'api/PrimaryProduction';
    }

    /**
     * @desc Get URL for Create new claim dropdown data API
     **/
    getSimulationDetailsURL(type) {
        // return this.apiURL + 'api/SimulatedTask/Tasks/' + type;
        let urlString: string
        switch (type) {
            case 1:
                urlString = 'api/PrimaryProduction/Simulation'
                break;
            case 2:
                urlString = 'api/DecorProduction/Simulation'
                break;
            case 4:
                urlString = 'api/VapProduction/Simulation'
                break;
            case 5:
                urlString = 'api/MiscProduction/Simulation'
                break;
            default:
                break;
        }
        return this.apiURL + urlString;
    }
    /**
    * @desc Get URL for Pack simulate API
    **/
    getPackSimulationDetailsURL(type) {
        // return this.apiURL + 'api/SimulatedTask/PackTasks/' + type;
        let urlString: string
        switch (type) {
            case 1:
                urlString = 'api/PrimaryPack/Simulation'
                break;
            case 2:
                urlString = 'api/DecorPack/Simulation'
                break;
            case 4:
                urlString = 'api/VapPack/Simulation'
                break;
            case 5:
                urlString = 'api/MiscPack/Simulation'
                break;
            default:
                break;
        }
        return this.apiURL + urlString;
    }

    /**
     * @desc Get URL for Create new claim dropdown data API
     **/
    getDecorProductionURL() {
        return this.apiURL + 'api/DecorProduction';
    }

    /**
     * @desc Get URL for Create new claim dropdown data API
     **/
    getVAPProductionURL() {
        return this.apiURL + 'api/VAPProduction';
    }

    /**
     * @desc Get URL for Create new claim dropdown data API
     **/
    getMiscellaneousProductionURL() {
        return this.apiURL + 'api/MiscProduction/GetMiscProduction';
    }

    /**
     * @desc Get URL for Create new claim dropdown data API
     **/
    getListCreateNewDropDowndataURL() {
        return this.apiURL + 'api/lookup';
    }

    /**
     * @desc Get URL for Creane new claim API
     **/
    getCreateNewClaimURL() {
        return this.apiURL + 'api/SubmitClaim';
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getSearchClaimURL() {
        return this.apiURL + 'api/searchClaim';
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getClaimDetailsURL(val) {
        return this.apiURL + 'api/ClaimDetails?CompliantNumber=' + val;
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getCreateRespondDetailsURL() {
        return this.apiURL + 'api/submitClaimResponse';
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getRespondDetailsURL(val) {
        return this.apiURL + 'api/getClaimResponse?CompliantNumber=' + val;
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getDeleteAttachmentURL() {
        return this.apiURL + 'api/DeleteFile';
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getUnscheduledTasksDetailsURL(type) {
        return this.apiURL + 'api/SimulatedTask/GetUnscheduledTasks/' + type;
    }

    /**
 * @desc Get URL for Search claim API
 **/
    getRescheduledTasksDetailsURL(selectedTask) {
        return this.apiURL + 'api/SimulatedTask/GetRescheduledData/' + selectedTask.TaskNumber + '/' + selectedTask.ItemNumber;
    }

    getUpdateRescheduledRescheduledTasksURL() {
        return this.apiURL + 'api/SimulatedTask/UpdateRescheduledData';
    }


    /**
     * @desc Get URL for Search claim API
     **/
    geDeleteScheduleTaskURL(selectedTask) {
        return this.apiURL + 'api/SimulatedTask/UpdateUnscheduledTasks/' + selectedTask.TaskNumber + '/' + selectedTask.ItemNumber;
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getReasonForChangeFromAPIDetailsURL(selectedTask) {
        return this.apiURL + 'api/SimulatedTask/GetReasonsList';
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getupdateModifyScheduleTaskURL(selectedTask) {
        return this.apiURL + 'api/SimulatedTask/UpdateTaskDurationDetails';
    }

    // Below URL not using in the application, added for just reffernce

    /**
     * @desc Get URL for login API
     **/
    getLoginUserAuthURL() {
        //return this.baseURL + 'oauth/token?grant_type=password&username=' + creds.username + '&password=' + creds.password;
        return this.apiURL + 'api/login';
    }

    getLoginUserURL(creds) {
        return this.apiURL + 'api/login';
    }

    /**
     * @desc Get URL for forgot password
     **/
    getForgotPasswordURL() {
        return this.apiURL + 'api/forgotPassword';
    }

    /**
     * @desc Get URL for reset password
     **/
    getResetPasswordURL() {
        return this.apiURL + 'api/resetPassword';
    }

    /**
     * @desc Get URL for dashboard details
     **/
    getDashboardDetailsURL(userEmail) {
        return this.apiURL + 'api/getDashBoardDetails/' + userEmail;
    }


    /**
     * @desc Get URL for Create Admin User
     **/
    getListAdminUserURL() {
        return this.apiURL + 'api/getListAdminUser';
    }

    /**
     * @desc Get URL for Create Admin User
     **/
    getCreateAdminUserURL() {
        return this.apiURL + 'api/createAdminUser';
    }

    /**
     * @desc Get URL for Create Admin User
     **/
    getUpdateAdminUserURL() {
        return this.apiURL + 'api/updateAdminUser';
    }

    /**
     * @desc Get URL for Delete Admin User
     **/
    getDeleteAdminUserURL() {
        return this.apiURL + 'api/deleteAdminUser';
    }
    /**
     * @desc Get URL for Refresh Token
     **/
    getProdTaskRefreshURL() {
        return this.apiURL + 'api/prodTask/refresh';
    }
    getPrimaryPackURL() {
        return this.apiURL + 'api/PrimaryPack';
    }

    getDecorPackURL() {
        return this.apiURL + 'api/DecorPack/GetDecorPackService';
    }
    getVapPackURL() {
        return this.apiURL + 'api/VapPack/GetVapPackService';
    }
    getMiscellaneousPackURL() {
        return this.apiURL + 'api/MiscPack/GetMiscPackService';
    }
    getSetAndPackURL() {
        return this.apiURL + 'api/RePack/GetRePackService';
    }

    /**
     * @desc Get URL for Refresh Token
     **/

    getLegendDetailsURL() {
        return this.apiURL + 'api/Common/GetTaskStatusWithColor';
    }

    /**
     * @desc Get URL for Forming Lines
     **/

    getFormingLinesDetailsURL(type) {
        return this.apiURL + 'api/SimulatedTask/GetFormingLines/' + type;
    }

    /**
    * @desc Get URL for Refresh Token
    **/

    geAddNewTaskTaskURL() {
        return this.apiURL + 'api/SimulatedTask/AddTask';
    }

    /**
    * @desc Get URL for GammeOption
    **/
    getchangeOperatingModeURL(selectedTask) {
        return this.apiURL + 'api/Common/GetGammeOption/' + selectedTask.NOM + '/' + selectedTask.NChannel;
    }

    getChangeOperatingModePostURL(selectedTask) {
        return this.apiURL + 'api/Common/SaveGammeOptions/' + selectedTask.TaskNumber + '/' + selectedTask.ItemNumber;
    }

    /* Manning */
    getManningURL() {
        return this.apiURL + 'api/Manning/GetManningPackService';
    }

    getpopupDetailsJobChanges(Task, selectionchange) {
        return this.apiURL + 'api/Common/GetJobChangeDetails/' + selectionchange + '/' + Task.CoGroupType;
    }

    getManningRoleURL() {
        return this.apiURL + 'api/ManningMaster/GetRoles';
    }

    getManningCrewDetailURL(crewId) {
        return this.apiURL + 'api/ManningMaster/GetCrewDetails';
    }

    getManningCrewURL() {
        return this.apiURL + 'api/ManningMaster/GetList';
    }
    saveManningRoleDetailsURL() {
        return this.apiURL + 'api/ManningMaster/SaveManningRoleDetails';
    }
    saveCrewDetailsURL() {
        return this.apiURL + 'api/ManningMaster/SaveCrewDetails';
    }

    getCreateTaskDetailsURL() {
        return this.apiURL + 'api/SimulatedTask/GetCreateTaskDetails';
    }

    getItemNumbersURL() {
        return this.apiURL + 'api/SimulatedTask/GetItemNumbers/';
    }

    getItemDescriptionURL() {
        return this.apiURL + 'api/SimulatedTask/GetItemDescription/';
    }

    getTaskStatusListURL() {
        return this.apiURL + 'api/SimulatedTask/GetTaskStatusList';
    }

    /**
    * @desc Get URL for Edit task details
    **/
    getEditTaskDetailsURL() {
        // return this.apiURL + 'api/SimulatedTask/ModifyTask/'+ taskNumber + '/' + itemNumber;
        return this.apiURL + 'api/SimulatedTask/EditTask';
    }

    /**
    * @desc Get URL for Refresh Token
    **/

    EditTaskSaveURL() {
        return this.apiURL + 'api/SimulatedTask/UpdateTask';
    }

    /**
  * @desc Get URL for Manning simulation
  **/

    GetManningSimulationURL() {
        return this.apiURL + 'api/SimulatedManning/GetSimulatedManningPackService';
    }
    getDomainListUrl() {
        return this.apiURL + 'api/UserLogin/GetAllDomains';
    }
    getAppInfoUrl() {
        return this.apiURL + 'api/GetVesrion';
    }
    getExportSchedulesURL() {
        return this.apiURL + 'api/Export/ExportSchedules';
    }
    getExportDetails() {
        return this.apiURL + '/api/Export/GetExportDetails';
    }
    // getPrintModel() {
    //     return this.apiURL 
    // }

    /**
    * @desc Get URL for Change summay consolidated
    **/
    getChangeSummaryURL(type) {
        return this.apiURL + 'api/Summary/GetSummary/' + type;
    }

    /**
    * @desc Get URL for Change summary details
    **/
    getChangeSummaryDetailURL() {
        return this.apiURL + 'api/Summary/GetSummaryDetails';
    }
    /**
   * @desc Get URL for Default Furnace List
   **/
    getDefaultFurnaceListURL() {
        return this.apiURL + 'api/FurnaceCapacity/GetFurnaceLists';

    }
    /**
 * @desc Save URL for Default Furnace capacity save
 **/
    saveDefaultCapacityURL() {
        return this.apiURL + 'api/FurnaceCapacity/SaveDefaultFurnaceCapacity';

    }
    /**
* @desc Get URL for Default Furnace List
**/
    retrieveButtonAPIURL() {
        return this.apiURL + 'api/FurnaceCapacity/GetSelectedFurnaceDetails';

    }
    /**
* @desc Save URL for Edit Furnace Capacity
**/
    saveFurnacetCapacityURL() {
        return this.apiURL + 'api/FurnaceCapacity/SaveNewFurnaceCapacity';

    }
    /**
* @desc getURL for  Furnace History details
**/
    getFurnaceHistoryFromAPIDetailsURL() {
        return this.apiURL + 'api/FurnaceCapacity/GetLatestFurnaceDetails';

    }
    /**
* @desc Save URL for  Furnace History details
**/
    saveFurnaceHistoryCapacityAPIURL() {
        return this.apiURL + 'api/FurnaceCapacity/UpdateNewFurnaceCapacity';

    }
    /**
* @desc getURL for Delete Furnace History details
**/
    getDeleteFurnaceHistoryFromAPIDetailsURL() {
        return this.apiURL + 'api/FurnaceCapacity/DeleteFurnaceDetail';
    }


    /**
    * @desc getURL for task summary details
    **/
    getTaskSummaryDetailsFromAPIURL() {
        return this.apiURL + 'api/edittask/tasksummarydetails';
    }

    /**
    * @desc postURL for gamme details
    **/
    getProdTaskGammeFromAPIURL() {
        return this.apiURL + 'api/edittask/prodtaskgamme';
    }

    /**
    * @desc postURL for pack task details
    **/
    getPackTaskDetailsOnGammeSelectionFromAPIURL() {
        return this.apiURL + 'api/edittask/packtaskgamme';

    }
    /**
* @desc postURL for special gamme details
**/
    getSpecialGammeDetailsOnGammeSelectionFromAPIURL() {
        return this.apiURL + 'api/edittask/specialgamme';

    }
    /**
* @desc get URL for reason for change
**/
    getTaskReasonForChangeFromAPIURL() {
        return this.apiURL + 'api/edittask/taskreasonforchange';

    }
    /**
* @desc get URL for reason for change
**/
    getCommentDetailsFromAPIURL() {
        return this.apiURL + 'api/edittask/taskeditcomments';

    }

    /**
* @desc post URL for machinelist
**/
    getMachineListFromAPIURL() {
        return this.apiURL + 'api/edittask/machinelistonschedulegroup';

    }
    /**
* @desc post URL for edit task save
**/
    getEditTaskDetailsFromAPIURL() {
        return this.apiURL + 'api/edittask/saveedittask';

    }
    /**
* @desc post URL for edit task saend acknowledgement
**/
    getSendAcknowledgementFromAPIURL() {
        return this.apiURL + 'api/edittask/sendacknowledgement';

    }
    /**
* @desc post URL for manning print
**/
    getExportManningPackstFromAPIURL() {
        return this.apiURL + 'api/export/exportmanningschedule';
    }
    /**
  * @desc post URL for ApproveJobChanges
  **/
    approveJobChangesURL() {
        return this.apiURL + 'api/Common/ApproveJobChanges';
    }
    /**
* @desc post URL for go to edit task
**/
    goToEditTasksURL(TaskNumber) {
        return this.apiURL + 'api/SimulatedTask/GetTaskIDFromTaskNumber/' + TaskNumber;
    }

    getUserNamesURL() {
        return this.apiURL + 'api/UserLogin/GetUserName/';
    }

    getConflictedTasks() {
        return this.apiURL + 'api/SimulatedTask/GetConflictsAsList/';
    }

}
