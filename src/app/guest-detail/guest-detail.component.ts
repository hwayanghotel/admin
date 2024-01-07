import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerInfo } from 'reservation/booking/booking.component.interface';
import * as Moment from 'moment';
import 'moment/locale/ko';
import {
    Price,
    STANDARD_BOOKING,
} from 'reservation/service/booking/booking.service.interface';
import { MediatorService } from 'reservation/service/mediator/mediator.service';
import { SMSService } from '../sms.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BookingService } from 'reservation/service/booking/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'guest-detail',
    templateUrl: './guest-detail.component.html',
    styleUrls: ['./guest-detail.component.scss'],
})
export class GuestDetailComponent {
    @ViewChild('SelectMsg') SelectMsg: TemplateRef<any>;
    customerInfo: CustomerInfo = {
        id: Moment().format('YYMMDDHHmmss'),
        name: '',
        status: 'ready',
        tel: '',
        cars: [],
        customerMemo: '',
        baeksuk: 0,
        neungiBaeksuk: 0,
        mushroomStew: 0,
        mushroomStewForTwoPeople: 0,
        flatTable: 0,
        dechTable: 0,
        person: 0,
        kids: 0,
        date: Moment().add('days', 1).hour(12).minutes(0),
    };
    memo: string = '';
    editMode: boolean;
    flatTableEditMode: boolean;
    foodEditMode: boolean;

    constructor(
        private dialog: MatBottomSheet,
        private router: Router,
        private mediatorService: MediatorService,
        private bookingService: BookingService,
        private SMSService: SMSService,
        private snackBar: MatSnackBar
    ) {
        this.customerInfo = this.mediatorService.customerInfo;
        this.memo = this.customerInfo.customerMemo;
        if (!this.customerInfo.deposit) {
            this.customerInfo.deposit = this.recommendDeposit;
        }
    }

    getStatus(status: string): '대기' | '입금전' | '확인중' | '예약' | '취소' {
        if (status === 'paymentReady') return '입금전';
        if (status === 'confirming') return '확인중';
        if (status === 'bookingComplete') return '예약';
        if (status === 'cancel') return '취소';
        return '대기';
    }

    setStatus(status: string) {
        this.customerInfo.status = status as any;
    }

    get tel(): string {
        return this.customerInfo.tel;
    }

    set tel(v: string) {
        if (v.length > 14) v = v.substring(0, 13);
        let input: string = v;
        if (this.customerInfo.tel.length < input.length && input.length === 8) {
            input += '-';
        }
        this.customerInfo.tel = input;
    }

    get date(): string {
        return this.customerInfo.date.format('YYYY-MM-DD');
    }

    set date(value: string) {
        if (value) {
            const [year, month, date] = value.split('-');
            this.customerInfo.date.year(Number(year));
            this.customerInfo.date.month(Number(month));
            this.customerInfo.date.date(Number(date));
        }
    }

    get time(): string {
        return this.customerInfo.date.format('HH:mm');
    }
    set time(value: string) {
        if (value) {
            const [hour, minute] = value.split(':');
            this.customerInfo.date.hour(Number(hour));
            this.customerInfo.date.minute(Number(minute));
        }
    }

    get bookingFlatTable(): string {
        const flat = this.customerInfo.flatTable;
        const dech = this.customerInfo.dechTable;
        if (flat && dech) {
            return `평상 ${flat}대, 데크 ${dech}대`;
        }
        if (flat) {
            return `평상 ${flat}대`;
        }
        if (dech) {
            return `데크 ${dech}대`;
        }
        return '';
    }

    get bookingFoods(): string {
        const 능이 = this.customerInfo.neungiBaeksuk;
        const 한방 = this.customerInfo.baeksuk;
        const 버섯 = this.customerInfo.mushroomStew;
        const 버섯2 = this.customerInfo.mushroomStewForTwoPeople;
        let foods: string = '';
        if (능이) {
            foods = `능이백숙 ${능이}상`;
        }
        if (한방) {
            foods += `${foods ? '<br>' : ''}한방백숙 ${한방}상`;
        }
        if (버섯) {
            foods += `${foods ? '<br>' : ''}버섯찌개 ${버섯}상`;
        }
        if (버섯2) {
            foods += `${foods ? '<br>' : ''}버섯찌개(2인) ${버섯2}상`;
        }
        return foods;
    }

    get carList(): string {
        let description = '';
        this.customerInfo.cars
            .filter((v) => v.length)
            .forEach((car) => {
                if (description !== '') {
                    description += ', ';
                }
                description += car;
            });

        const noInputs = this.customerInfo.cars.filter((v) => !v.length).length;
        if (noInputs) {
            if (description !== '') {
                description += ', ';
            }
            description += `미입력 ${noInputs}대`;
        }

        return description;
    }

    get recommendDeposit(): number {
        const flat = this.customerInfo.flatTable;
        const dech = this.customerInfo.dechTable;
        const guests = this.customerInfo.person + this.customerInfo.kids;
        const additionalGuests =
            guests - STANDARD_BOOKING.flatTableGuests.std * (flat + dech);
        return (
            flat * Price['평상'] +
            dech * Price['데크'] +
            (additionalGuests > 0
                ? additionalGuests * Price['평상추가인원']
                : 0)
        );
    }

    moveBookingParkingPage() {
        this.mediatorService.customerInfo = this.customerInfo;
        this.router.navigate(['/booking-parking']);
    }

    openBottomBarDialog() {
        this.dialog.open(this.SelectMsg);
    }

    getSMSText(
        type?: 'BeforeVisit' | 'Account' | 'Confirm' | 'BookingInfo'
    ): string {
        return this.SMSService.getSMSText(this.customerInfo, type);
    }

    onBookingCancelButton() {
        this.bookingService
            .cancel(this.customerInfo)
            .then((user) => {
                this.customerInfo = user;
            })
            .catch((e) =>
                this.snackBar.open(
                    '예약이 취소되지 않았습니다. 다시 시도해주세요.',
                    null,
                    { duration: 2000 }
                )
            );
    }

    onBackButton() {
        window.history.back();
    }
}
