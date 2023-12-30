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
        this.selectedDate = this.today;
        if (this.selectedMonth.format('YYMM') !== this.today.format('YYMM')) {
            this.selectedMonth = this.today;
            this._setCalendar();
        }
    }
    changeType() {
        if (this._type === 'flat-table') this._type = 'food';
        else if (this._type === 'food') this._type = 'pension';
        else if (this._type === 'pension') this._type = 'all';
        else if (this._type === 'all') this._type = 'flat-table';
    }

    get type(): string {
        if (this._type === 'flat-table') return '평상';
        if (this._type === 'food') return '식사';
        if (this._type === 'pension') return '펜션';
        return '전체';
    }
    private _type: 'flat-table' | 'food' | 'pension' | 'all' = 'all';
}
