import { Injectable } from '@angular/core';
import { Observable, Observer  } from 'rxjs/Rx';

@Injectable()
export class SharedService {

    //name = "micronyks";

    public _bar: any = "HomeGet";

    get breadCrumb(): any {
        return this._bar;
    }
    set breadCrumb(theBar: any) {
        this._bar = theBar;
    }

    /*data: any;
    dataChange: Observable<any>;

    constructor() {
        this.dataChange = new Observable((observer: Observer) {
            this.dataChangeObserver = observer;
        });
    }  

    setData(data: any) {
        this.data = data;
        this.dataChangeObserver.next(this.data);
    }*/

    /**Get AM PM date string format */
    getDateAMPMFormat(beginDate): any {
        const startDate = beginDate.replace('T', ' ');
        const startTimeObj1 = startDate.split(' ');
        const startTimeObj2 = startTimeObj1[1];
        const startTimeFormat = startTimeObj2.split(':');
        const startTime = startTimeFormat[0];
        var startTimeType = 'AM';
        var startHour = startTime;
        var startTimeFinal;
        if (startHour >= 13) {
            startHour = startTime - 12;
            startTimeType = 'PM';
            startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
        }
        else if (startHour === 0) {
            startHour = 12;
            startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
        }
        else if (startHour === 12) {
            startTimeType = 'PM';
            startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
        }
        else {
            startTimeFinal = startHour + ':' + startTimeFormat[1] + ' ' + startTimeType;
        }

        if (startTimeFinal === "00:00 AM") {
            startTimeFinal = '12:00 AM';
        }
        else if (startTimeFinal === "12:00 AM") {
            startTimeFinal = '12:00 PM';
        }

        var newDate = this.dateTimeFormatForTimeZone(beginDate);
        var newYear = newDate.getFullYear(),
            newMonth = ((newDate.getMonth() + 1) >= 10) ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1),
            newDay = ((newDate.getDate()) >= 10) ? (newDate.getDate()) : '0' + (newDate.getDate());
        var newDateString = newMonth + '/' + newDay + '/' + newYear + ' ' + startTimeFinal;
        return newDateString;
    }

    /**To fix New Date() / Timezone issue 
     * Return correct date with time in new Date() format
    */
    dateTimeFormatForTimeZone(value) {
        var date = new Date();
        var newDate = value.split('T')[0].split('-');
        date.setFullYear(parseInt(newDate[0]));
        date.setMonth(parseInt(newDate[1]) - 1);
        date.setDate(parseInt(newDate[2]));
        try {
            date.setHours(value.split('T')[1].split(':')[0]);
            date.setMinutes(value.split('T')[1].split(':')[1]);
            date.setSeconds(value.split('T')[1].split(':')[2].split('.')[0]);
        } catch (e) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
        }
        return date;
    }

}
