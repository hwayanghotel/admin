import { Component } from '@angular/core';
import * as moment from 'moment';
import { HolidayService } from 'reservation/service/holiday/holiday.service';

interface ICalendar {
    date: moment.Moment;
    isHoliday?: boolean;
}

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
    calendar: ICalendar[][] = [];
    today = moment();
    selectedDate: moment.Moment = moment();
    selectedMonth: moment.Moment = moment();

    constructor(protected holidayService: HolidayService) {
        this._setCalendar();
    }

    private async _setCalendar() {
        const firstDayOfMonth = this.selectedMonth.clone().startOf('month');
        const lastDayOfMonth = this.selectedMonth.clone().endOf('month');
        const startDay = moment(firstDayOfMonth).add(
            -firstDayOfMonth.day(),
            'days'
        );
        const endDay = moment(lastDayOfMonth).add(
            6 - lastDayOfMonth.day(),
            'days'
        );
        const calendar: ICalendar[][] = [];
        for (let i = 0; ; i++) {
            const date = moment(startDay).add(i, 'days');

            if (!calendar[Math.floor(i / 7)]) {
                calendar[Math.floor(i / 7)] = [];
            }
            const holidays = await this.holidayService.getHolidays(date);
            calendar[Math.floor(i / 7)].push({
                date: date,
                isHoliday: holidays.includes(date.date()),
            });
            if (date.format('YYMMDD') === endDay.format('YYMMDD')) {
                break;
            }
        }
        this.calendar = calendar;
    }

    isToday(date: ICalendar): boolean {
        return date.date.format('YYMMDD') === this.today.format('YYMMDD');
    }
    isSelected(date: ICalendar): boolean {
        return (
            date.date.format('YYMMDD') === this.selectedDate.format('YYMMDD')
        );
    }
    isOtherMonth(date: ICalendar): boolean {
        return date.date.format('YYMM') !== this.selectedMonth.format('YYMM');
    }
    moveToday() {
        if (this.selectedMonth.format('YYMM') !== this.today.format('YYMM')) {
            this.selectedMonth = this.today;
            this.selectedDate = this.today;
            this._setCalendar();
        }
    }
}
