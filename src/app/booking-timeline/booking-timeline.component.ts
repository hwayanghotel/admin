import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import * as moment from 'moment';
import { CustomerInfo } from 'reservation/booking/booking.component.interface';
import { Subscription, debounceTime } from 'rxjs';
import { ManagerService } from '../manager.service';
import { MAX_BOOKING } from 'reservation/service/booking/booking.service.interface';

@Component({
    selector: 'booking-timeline',
    templateUrl: './booking-timeline.component.html',
    styleUrls: ['./booking-timeline.component.scss'],
})
export class BookingTimelineComponent implements OnInit, OnChanges, OnDestroy {
    @Input() selectedDate: moment.Moment;

    timeline = this._getTimeline();
    data: any = {};
    MAX_BOOKING = MAX_BOOKING;
    private _originalDB: CustomerInfo[] = [];
    private _subscription: Subscription[] = [];
    constructor(private managerService: ManagerService) {}
    ngOnChanges(changes: SimpleChanges): void {
        this._setData();
    }
    ngOnInit(): void {
        this._subscription.push(
            this.managerService.customerDB$
                .pipe(debounceTime(1000))
                .subscribe((db) => {
                    this._originalDB = db;
                    this._setData();
                })
        );
    }

    private _setData() {
        const db = this._originalDB.filter(
            (v) =>
                v.date.format('YYMMDD') === this.selectedDate.format('YYMMDD')
        );

        this.data = {};
        this.data['total'] = {
            neungyi: db.reduce((sum, v) => sum + v.neungiBaeksuk, 0),
            chicken: db.reduce((sum, v) => sum + v.baeksuk, 0),
            mushroom: db.reduce((sum, v) => sum + v.mushroomStew, 0),
            mushroom2: db.reduce(
                (sum, v) => sum + v.mushroomStewForTwoPeople,
                0
            ),
        };
        //Pension update 필요
        this.data['flatTable'] = {
            neungyi: db
                .filter((v) => v.flatTable || v.dechTable)
                .reduce((sum, v) => sum + v.neungiBaeksuk, 0),
            chicken: db
                .filter((v) => v.flatTable || v.dechTable)
                .reduce((sum, v) => sum + v.baeksuk, 0),
            mushroom: db
                .filter((v) => v.flatTable || v.dechTable)
                .reduce((sum, v) => sum + v.mushroomStew, 0),
            mushroom2: db
                .filter((v) => v.flatTable || v.dechTable)
                .reduce((sum, v) => sum + v.mushroomStewForTwoPeople, 0),
        };
        for (let time of this.timeline) {
            this.data[time.format('HH:mm')] = {
                neungyi: db
                    .filter(
                        (v) =>
                            !v.flatTable &&
                            !v.dechTable &&
                            v.date.format('HH:mm') === time.format('HH:mm')
                    )
                    .reduce((sum, v) => sum + v.neungiBaeksuk, 0),
                chicken: db
                    .filter(
                        (v) =>
                            !v.flatTable &&
                            !v.dechTable &&
                            v.date.format('HH:mm') === time.format('HH:mm')
                    )
                    .reduce((sum, v) => sum + v.baeksuk, 0),
                mushroom: db
                    .filter(
                        (v) =>
                            !v.flatTable &&
                            !v.dechTable &&
                            v.date.format('HH:mm') === time.format('HH:mm')
                    )
                    .reduce((sum, v) => sum + v.mushroomStew, 0),
                mushroom2: db
                    .filter(
                        (v) =>
                            !v.flatTable &&
                            !v.dechTable &&
                            v.date.format('HH:mm') === time.format('HH:mm')
                    )
                    .reduce((sum, v) => sum + v.mushroomStewForTwoPeople, 0),
            };
        }

        //이용좌석 로직
        for (let time of this.timeline) {
            const tables = db
                .filter(
                    (v) =>
                        !v.flatTable &&
                        !v.dechTable &&
                        v.date.format('HH:mm') === time.format('HH:mm')
                )
                .map((v) => Math.ceil((v.person + v.kids) / 4))
                .reduce((sum, v) => sum + v, 0);
            for (let i = 0; i < 4; i++) {
                const customTime = time.clone().add(i * 30, 'minute');
                if (customTime.hour() === 17) break;
                if (
                    this.data[customTime.format('HH:mm')]?.table === undefined
                ) {
                    this.data[customTime.format('HH:mm')].table = 0;
                }
                this.data[customTime.format('HH:mm')].table += tables;
            }
        }
    }

    private _getTimeline(): moment.Moment[] {
        const timeline: moment.Moment[] = [];
        for (let hour of [10, 11, 12, 13, 14, 15, 16]) {
            for (let min of [0, 30]) {
                const time = moment();
                timeline.push(time.hour(hour).minute(min));
            }
        }
        return timeline;
    }

    ngOnDestroy(): void {
        for (let sub of this._subscription) {
            sub.unsubscribe();
        }
    }
}
