import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class CalendarComponent implements AfterViewInit {
    @ViewChild('Calendar') Calendar!: ElementRef<HTMLElement>;
    @ViewChild('ListContainer') ListContainer!: ElementRef<HTMLElement>;
    calendarExpandLevel: number = 3; //1,2,3
    today = moment();
    selectedDate: moment.Moment = moment();
    listType: 'list' | 'timeline' = 'list';
    private _selectedWeek: ICalendar[] = [];
    private _calendar: ICalendar[][] = [];
    private _db: CustomerInfo[] = [];
    private _subscription: Subscription[] = [];
    constructor(
        private holidayService: HolidayService,
        private managerService: ManagerService
    ) {
        this._setCalendar();
        this._setSelectedWeek();
        this._checkTouch();

        this._subscription.push(
            this.managerService.customerDB$
                .pipe(debounceTime(1000))
                .subscribe((db) => {
                    this._db = db.filter((v) => v.status !== 'cancel');
                })
        );
    }

    ngAfterViewInit() {
        this._updateListConatinerHeight();
    }

    private async _setCalendar() {
        const firstDayOfMonth = this.selectedDate.clone().startOf('month');
        const lastDayOfMonth = this.selectedDate.clone().endOf('month');
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
        this._calendar = calendar;
    }

    private async _setSelectedWeek() {
        if (
            this._selectedWeek.length === 7 &&
            this._selectedWeek[0].date.format('YYMMDD') <=
                this.selectedDate.format('YYMMDD') &&
            this.selectedDate.format('YYMMDD') <=
                this._selectedWeek[6].date.format('YYMMDD')
        ) {
            //굳이 set을 변경할 필요 없는 경우엔 return
            return;
        }

        //변경 필요 케이스
        this._selectedWeek = [];
        const firstDate = this.selectedDate
            .clone()
            .add(-this.selectedDate.day(), 'days');
        for (let i = 0; i < 7; i++) {
            const date = firstDate.clone().add(i, 'days');
            const isHoliday = (
                await this.holidayService.getHolidays(date)
            ).includes(date.date());
            this._selectedWeek.push({
                date: date,
                isHoliday: isHoliday,
            });
        }
    }

    private _checkTouch() {
        let startY: any;
        let startX: any;

        document.addEventListener('touchstart', (e) => {
            // 터치 시작 지점 저장
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            // 터치 종료 지점 저장
            let endY = e.changedTouches[0].clientY;
            let endX = e.changedTouches[0].clientX;

            // 상단에서 하단으로 스크롤 감지
            if (startY - endY > 40) {
                // console.log('캘린더 축소', startY, endY, window.scrollY);
                if (window.scrollY > 0) {
                    if (this.calendarExpandLevel !== 1) {
                        this.calendarExpandLevel--;
                        this._updateListConatinerHeight();
                    }
                }
                // 여기에 실행하고자 하는 동작을 추가하세요.
            } else if (startY - endY < -40) {
                // console.log('캘린더 확장', startY, endY, window.scrollY);
                if (window.scrollY === 0) {
                    if (this.calendarExpandLevel < 3) {
                        this.calendarExpandLevel++;
                        if (this.ListContainer) {
                            setTimeout(() => {
                                this.ListContainer.nativeElement.style.paddingTop = `${this.Calendar.nativeElement.offsetHeight}px`;
                                this.ListContainer.nativeElement.style.minHeight = `calc(100% - ${this.Calendar.nativeElement.offsetHeight}px + 1px)`;
                            }, 100);
                        }
                    }
                }
            } else if (startX - endX > 20) {
                if (this.calendarExpandLevel === 3) {
                    this.moveMonthOrWeek(1);
                } else {
                    this.changeDate({
                        date: this.selectedDate.clone().add(1, 'days'),
                    });
                }
            } else if (startX - endX < -20) {
                if (this.calendarExpandLevel === 3) {
                    this.moveMonthOrWeek(1);
                } else {
                    this.changeDate({
                        date: this.selectedDate.clone().add(-1, 'days'),
                    });
                }
            }
        });
    }

    private _updateListConatinerHeight() {
        if (this.ListContainer) {
            setTimeout(() => {
                this.ListContainer.nativeElement.style.paddingTop = `${this.Calendar.nativeElement.offsetHeight}px`;
                this.ListContainer.nativeElement.style.minHeight = `calc(100% - ${this.Calendar.nativeElement.offsetHeight}px + 1px)`;
            }, 100);
        }
    }

    get calendar(): ICalendar[][] {
        if (this.calendarExpandLevel > 1) {
            return this._calendar;
        }
        return [this._selectedWeek];
    }

    changeDate(date?: ICalendar) {
        const previous = this.selectedDate.clone();

        if (date) {
            this.selectedDate = date.date;
        } else {
            this.selectedDate = moment();
        }
        if (previous.month() !== this.selectedDate.month()) {
            this._setCalendar();
            this._updateListConatinerHeight();
        }
        this._setSelectedWeek();
    }

    async moveMonthOrWeek(direction: number) {
        const previous = this.selectedDate.clone();
        this.selectedDate.add(
            direction,
            this.calendarExpandLevel > 1 ? 'month' : 'week'
        );

        if (previous.month() !== this.selectedDate.month()) {
            this._setCalendar();
            this._updateListConatinerHeight();
        }
        this._setSelectedWeek();
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
        const previous = this.selectedDate.clone();
        this.selectedDate = this.today.clone();

        if (previous.month() !== this.selectedDate.month()) {
            this._setCalendar();
            this._updateListConatinerHeight();
        }
        this._setSelectedWeek();
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

    isReadyStatus(date: ICalendar): boolean {
        return (
            this._db.filter(
                (v) =>
                    v.date.format('YYMMDD') === date.date.format('YYMMDD') &&
                    ['ready', 'paymentReady'].includes(v.status)
            ).length > 0
        );
    }

    get type(): string {
        if (this._type === 'flat-table') return '평상';
        if (this._type === 'food') return '식사';
        if (this._type === 'pension') return '펜션';
        return '전체';
    }
    private _type: 'flat-table' | 'food' | 'pension' | 'all' = 'flat-table';
}
