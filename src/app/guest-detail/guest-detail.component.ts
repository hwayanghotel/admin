import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerInfo } from 'reservation/booking/booking.component.interface';
import * as Moment from 'moment';
import {
    Price,
    STANDARD_BOOKING,
} from 'reservation/service/booking/booking.service.interface';

@Component({
    selector: 'app-guest-detail',
    templateUrl: './guest-detail.component.html',
    styleUrls: ['./guest-detail.component.scss'],
})
export class GuestDetailComponent implements OnInit {
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

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams.subscribe((customerInfo) => {
            if (customerInfo['id']) {
                this.customerInfo = {
                    ...(customerInfo as CustomerInfo),
                    baeksuk: Number(customerInfo['baeksuk']),
                    neungiBaeksuk: Number(customerInfo['neungiBaeksuk']),
                    mushroomStew: Number(customerInfo['mushroomStew']),
                    mushroomStewForTwoPeople: Number(
                        customerInfo['mushroomStewForTwoPeople']
                    ),
                    flatTable: Number(customerInfo['flatTable']),
                    dechTable: Number(customerInfo['dechTable']),
                    person: Number(customerInfo['person']),
                    kids: Number(customerInfo['kids']),
                    date: Moment(new Date(customerInfo['date'])),
                };
                this.memo = this.customerInfo.customerMemo;
            }
        });
        this.memo = this.customerInfo.customerMemo;
    }

    get status(): '대기' | '입금전' | '예약' | '취소' {
        if (this.customerInfo.status === 'paymentReady') return '입금전';
        if (this.customerInfo.status === 'bookingComplete') return '예약';
        if (this.customerInfo.status === 'cancel') return '취소';
        return '대기';
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

    get cost(): number {
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

    onBackButton() {
        window.history.back();
    }
}
