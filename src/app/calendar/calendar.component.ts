import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as Moment from 'moment';
import { CalendarService } from 'reservation/service/calendar/calendar.service';
import { HolidayService } from 'reservation/service/holiday/holiday.service';

export interface ICalendar {
    date: Moment.Moment;
    isHoliday?: boolean;
}

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
    @Input() date = Moment();
    @Input() isDateRange: boolean = false;

    @Output() dateChange = new EventEmitter<Moment.Moment>();

    @Input() startDate: Moment.Moment;
    @Output() startDateChange = new EventEmitter<Moment.Moment>();

    @Input() endDate: Moment.Moment;
    @Output() endDateChange = new EventEmitter<Moment.Moment>();

    calendarExpand: boolean = true;
    selectedMonth: string = this.date.format('YYYY년 MM월');
    week: string[] = ['일', '월', '화', '수', '목', '금', '토'];

    active: 'start' | 'end' = 'start';

    private _calendar: ICalendar[][] = [];
    private _weeklyCalendar: ICalendar[] = [];

    constructor(
        protected holidayService: HolidayService,
        protected calendarService: CalendarService
    ) {
        this._setCalendar();
    }

    get calendar(): ICalendar[][] {
        if (this.calendarExpand) {
            return this._calendar;
        }
        return [this._weeklyCalendar];
    }

    showDate(date: ICalendar): number {
        return date.date.date();
    }

    isToday(date: ICalendar): boolean {
        return date.date.format('YYMMDD') === Moment().format('YYMMDD');
    }

    isDim(date: ICalendar): boolean {
        return date.date.format('YYMMDD') < Moment().format('YYMMDD');
    }

    isSelected(date: ICalendar): boolean {
        if (this.isDateRange) {
            if (this.startDate && this.endDate) {
                return (
                    date.date.format('YYMMDD') >=
                        this.startDate.format('YYMMDD') &&
                    date.date.format('YYMMDD') <= this.endDate.format('YYMMDD')
                );
            }
            if (!this.startDate && !this.endDate) {
                return false;
            }
        }
        return date.date.format('YYMMDD') === this.date.format('YYMMDD');
    }

    setSelectedDate(date: ICalendar) {
        if (this.isDateRange) {
            if (this.active === 'start') {
                this.date = date.date;
                this.startDate = date.date;
                this.dateChange.emit(this.date);
                this.startDateChange.emit(this.date);
                this.active = 'end';
                if (
                    this.endDate &&
                    this.startDate.format('YYMMDD') >
                        this.endDate.format('YYMMDD')
                ) {
                    this.endDate = undefined;
                    this.endDateChange.emit(undefined);
                }
            } else if (this.active === 'end') {
                if (
                    !this.startDate ||
                    this.startDate.format('YYMMDD') <=
                        date.date.format('YYMMDD')
                ) {
                    this.date = date.date;
                    this.endDate = date.date;
                    this.dateChange.emit(this.date);
                    this.endDateChange.emit(this.date);
                }
                this.active = 'start';
            }
        } else {
            this.date = date.date;
            this.dateChange.emit(this.date);
        }
    }

    moveCalendar(direction: -1 | 1) {
        if (this.calendarExpand) {
            const date = Moment(this.date).add(direction, 'month');
            if (date.format('YYMM') === Moment().format('YYMM')) {
                this.date = Moment();
            } else {
                this.date = date;
                this.dateChange.emit(this.date);
            }
        }
        if (!this.calendarExpand) {
            const date = Moment(this.date).add(direction, 'week');
            if (date.format('Y-w') === Moment().format('Y-w')) {
                this.date = Moment();
            } else {
                this.date = date;
                this.dateChange.emit(this.date);
            }
        }
        this._setCalendar();
    }

    clearDate(type: 'start' | 'end') {
        if (type === 'start') {
            this.startDate = undefined;
            this.startDateChange.emit(undefined);
        } else {
            this.endDate = undefined;
            this.endDateChange.emit(undefined);
        }
    }

    private async _setCalendar() {
        let calendar: ICalendar[][] = this._initCalendar();
        for (let i = 0; i < calendar.length; i++) {
            let isThisWeek = false;
            for (let j = 0; j < calendar[i].length; j++) {
                const holidays = await this.holidayService.getHolidays(
                    calendar[i][j].date
                );
                calendar[i][j].isHoliday = holidays.includes(
                    calendar[i][j].date.date()
                );

                if (
                    calendar[i][j].date.format('YYMMDD') ===
                    this.date.format('YYMMDD')
                ) {
                    isThisWeek = true;
                }
            }
            if (isThisWeek) {
                this._weeklyCalendar = calendar[i];
            }
        }
        this._calendar = calendar;
        this.selectedMonth = this.date.format('YYYY년 MM월');
    }

    private _initCalendar(): ICalendar[][] {
        const calendar: ICalendar[][] = [];

        const firstDateOfMonth = Moment(this.date).set('date', 1);
        const startDate = Moment(firstDateOfMonth).add(
            'd',
            -firstDateOfMonth.day()
        );

        const lastDateOfMonth = Moment(this.date).set(
            'date',
            this.date.daysInMonth()
        );
        const endDate = Moment(lastDateOfMonth).add(
            'd',
            6 - lastDateOfMonth.day()
        );

        let week: ICalendar[] = [];
        for (
            let date = startDate;
            date.format('YYMMDD') <= endDate.format('YYMMDD');
            date = Moment(date).add('d', 1)
        ) {
            week.push({
                date: date,
            });
            if (date.day() === 6) {
                calendar.push(week);
                week = [];
            }
        }
        return calendar;
    }
}
