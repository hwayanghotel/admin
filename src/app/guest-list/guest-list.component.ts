import { Component, OnDestroy } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { ManagerService } from '../manager.service';
import { CustomerInfo } from 'reservation/booking/booking.component.interface';

interface Guest extends CustomerInfo {
    checked: boolean;
}

@Component({
    selector: 'guest-list',
    templateUrl: './guest-list.component.html',
    styleUrls: ['./guest-list.component.scss'],
})
export class GuestListComponent implements OnDestroy {
    searchInput: string;
    private _isSearch: boolean;
    private _db: Guest[] = [];

    private _subscription: Subscription[] = [];
    constructor(private managerService: ManagerService) {
        this._subscription.push(
            this.managerService.customerDB$
                .pipe(debounceTime(1000))
                .subscribe((db) => {
                    this._db = db
                        .map((item) => ({ ...item, checked: false }))
                        .sort((a, b) => this._sortList(a, b));
                })
        );
    }

    get showCheckbox(): boolean {
        return this._showCheckbox;
    }
    set showCheckbox(v: boolean) {
        if (v) {
            this.searchInput = undefined;
        } else {
            this.totalChecked = false;
        }
        this._showCheckbox = v;
    }
    private _showCheckbox: boolean;

    get totalChecked(): boolean {
        return this.db.filter((user) => !user.checked).length === 0;
    }
    set totalChecked(v: boolean) {
        this._db = this._db.map((user) => ({ ...user, checked: v }));
    }

    get totalCheckedNumber(): number {
        return this.db.filter((user) => user.checked).length;
    }

    get isSearch(): boolean {
        return this._isSearch;
    }
    set isSearch(v: boolean) {
        this._isSearch = v;
        if (!v) {
            this.searchInput = undefined;
        }
    }

    get db(): Guest[] {
        if (this.searchInput) {
            return this._db.filter(
                (user) =>
                    user.tel.includes(this.searchInput) ||
                    (user.customerMemo &&
                        user.customerMemo.includes(this.searchInput)) ||
                    user.date.format('MMDD').includes(this.searchInput) ||
                    user.date.format('MM/DD').includes(this.searchInput) ||
                    user.name.includes(this.searchInput) ||
                    (user.cars &&
                        user.cars.filter((car) =>
                            car.includes(this.searchInput)
                        ).length > 0)
            );
        }
        return this._db;
    }

    addGuest() {
        console.warn('addGuest');
    }

    deleteGuests() {
        console.warn('deleteGuests');
    }

    showDetailUser(user: Guest) {
        console.warn('showDetailUser', user.name);
    }

    type(user: Guest): '평상' | '식사' {
        return user.flatTable > 0 || user.dechTable > 0 ? '평상' : '식사';
    }

    status(user: Guest): '대기' | '입금전' | '예약' | '취소' {
        if (user.status === 'paymentReady') return '입금전';
        if (user.status === 'bookingComplete') return '예약';
        if (user.status === 'cancel') return '취소';
        return '대기';
    }

    setStatus(
        user: Guest,
        status: 'ready' | 'paymentReady' | 'bookingComplete' | 'cancel'
    ) {
        console.warn('setStatus 작업 필요');
        user.status = status;
    }

    touchStart(user: Guest) {
        if (!this._timeout) {
            if (!this.showCheckbox) {
                this._timeout = setTimeout(() => {
                    this.showCheckbox = true;
                    user.checked = true;
                }, 300);
            } else {
                this._timeout = setTimeout(() => {
                    this.showCheckbox = false;
                }, 300);
            }
        }
    }
    touchEnd() {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = undefined;
        }
    }
    private _timeout: any;

    onBackButton() {
        window.history.back();
    }

    ngOnDestroy(): void {
        for (let sub of this._subscription) {
            sub.unsubscribe();
        }
    }

    private _sortList(a: Guest, b: Guest) {
        // 1) "상태" 순서로 정렬
        const statusOrder = {
            ready: 0,
            paymentReady: 1,
            bookingComplete: 2,
            cancel: 2, //3에서 바꿈
        };
        const statusA = statusOrder[a['status']];
        const statusB = statusOrder[b['status']];
        if (statusA < statusB) {
            return -1;
        }
        if (statusA > statusB) {
            return 1;
        }

        // 2) "날짜"가 빠를수록 정렬
        const dateA = new Date(a['date'].toDate());
        const dateB = new Date(b['date'].toDate());
        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }

        return 0; // 동일한 경우 유지
    }
}
