import { Component } from '@angular/core';
import * as moment from 'moment';
import { HolidayService } from 'reservation/service/holiday/holiday.service';
import { ManagerService } from '../manager.service';
import { Subscription, debounceTime } from 'rxjs';
import { CustomerInfo } from 'reservation/booking/booking.component.interface';

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
    private _db: CustomerInfo[] = [];
    private _subscription: Subscription[] = [];
    constructor(
        private holidayService: HolidayService,
        private managerService: ManagerService
    ) {
        this._setCalendar();

        this._subscription.push(
            this.managerService.customerDB$
                .pipe(debounceTime(1000))
                .subscribe((db) => {
                    this._db = db;
                })
        );
    }

    private async _setCalendar() {
        const firstDayOfMonth = this.selectedMonth.clone().startOf('month');
        const lastDayOfMonth = this.selectedMonth.clone().endOf('month');
        const startDay = firstDayOfMonth
            .clone()
            .add(-firstDayOfMonth.day(), 'days');
        const endDay = lastDayOfMonth
            .clone()
            .add(6 - lastDayOfMonth.day(), 'days');
        const calendar: ICalendar[][] = [];
        for (let i = 0; ; i++) {
            const date = startDay.clone().add(i, 'days');

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

    moveMonth(direction: number) {
        this.selectedMonth.add(direction, 'month');
        this._setCalendar();
    }
    isToday(date: ICalendar): boolean {
        return date.date.format('YYMMDD') === this.today.format('YYMMDD');
    }
    isSelected(date: ICalendar): boolean {
        return (
            date.date.format('YYMMDD') === this.selectedDate.format('YYMMDD')
        );
    }
    needToDimming(date: ICalendar): boolean {
        return date.date.format('YYMMDD') < this.today.format('YYMMDD');
    }
    moveToday() {
        this.selectedDate = this.today.clone();
        if (this.selectedMonth.format('YYMM') !== this.today.format('YYMM')) {
            this.selectedMonth = this.today.clone();
            this._setCalendar();
        }
    }
    changeType() {
        if (this._type === 'flat-table') this._type = 'food';
        else if (this._type === 'food') this._type = 'pension';
        else if (this._type === 'pension') this._type = 'all';
        else if (this._type === 'all') this._type = 'flat-table';
    }

    shortFlatTable(date: ICalendar): string {
        try {
            const number = this._db
                .filter(
                    (v) =>
                        date.date.format('YYMMDD') === v.date.format('YYMMDD')
                )
                .map((v) => Number(v.flatTable))
                .reduce((a, b) => a + b);
            if (number) {
                return `평상${number}`;
            } else {
                return undefined;
            }
        } catch {
            return undefined;
        }
    }
    shortDechTable(date: ICalendar): string {
        try {
            const number = this._db
                .filter(
                    (v) =>
                        date.date.format('YYMMDD') === v.date.format('YYMMDD')
                )
                .map((v) => Number(v.dechTable))
                .reduce((a, b) => a + b);
            if (number) {
                return `데크${number}`;
            } else {
                return undefined;
            }
        } catch {
            return undefined;
        }
    }
    shortChicken(date: ICalendar): string {
        try {
            const number = this._db
                .filter(
                    (v) =>
                        date.date.format('YYMMDD') === v.date.format('YYMMDD')
                )
                .map((v) => Number(v.neungiBaeksuk) + Number(v.baeksuk))
                .reduce((a, b) => Number(a + b));
            if (number) {
                return `백숙${number}`;
            } else {
                return undefined;
            }
        } catch {
            return undefined;
        }
    }
    shortMushroom(date: ICalendar): string {
        try {
            const number = this._db
                .filter(
                    (v) =>
                        date.date.format('YYMMDD') === v.date.format('YYMMDD')
                )
                .map(
                    (v) =>
                        Number(v.mushroomStew) +
                        Number(v.mushroomStewForTwoPeople)
                )
                .reduce((a, b) => a + b);
            if (number) {
                return `버섯${number}`;
            } else {
                return undefined;
            }
        } catch {
            return undefined;
        }
    }

    get type(): string {
        if (this._type === 'flat-table') return '평상';
        if (this._type === 'food') return '식사';
        if (this._type === 'pension') return '펜션';
        return '전체';
    }
    private _type: 'flat-table' | 'food' | 'pension' | 'all' = 'flat-table';
}
