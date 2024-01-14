import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    QueryDocumentSnapshot,
} from '@angular/fire/compat/firestore';
import { CustomerInfo } from 'reservation/booking/booking.component.interface';
import { BookingService } from 'reservation/service/booking/booking.service';
import { BOOKING_COLLECTION } from 'reservation/service/booking/booking.service.interface';
import { CalendarService } from 'reservation/service/calendar/calendar.service';
import { BehaviorSubject, debounceTime } from 'rxjs';
import * as Moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DB } from './db';

export interface IManagerService {
    add(bookingInfo: CustomerInfo): Promise<CustomerInfo>;
    update(bookingInfo: CustomerInfo): Promise<CustomerInfo>;
    delete(id: string): Promise<string>;
    customerDB$: BehaviorSubject<CustomerInfo[]>;
    checkPermission(password: string): Promise<boolean>;
}

@Injectable({
    providedIn: 'root',
})
export class ManagerService implements IManagerService {
    customerDB$: BehaviorSubject<CustomerInfo[]> = new BehaviorSubject<
        CustomerInfo[]
    >([]);

    constructor(
        private store: AngularFirestore,
        private calendarService: CalendarService,
        private bookingService: BookingService,
        private snackBar: MatSnackBar
    ) {
        this.customerDB$.pipe(debounceTime(1000)).subscribe((v) => {
            console.warn('DB', v);
        });
    }

    checkPermission(password: string): Promise<boolean> {
        if (this._permission) {
            return Promise.resolve(true);
        }
        return this.store
            .collection('PERMISSION')
            .ref.where('PASSWORD', '==', password)
            .get()
            .then((snapshot) => {
                if (snapshot.size === 1) {
                    this._permission = true;
                    this._subscribeUserDB();
                }
                return snapshot.size === 1;
            })
            .catch((e) => false);
    }
    private _permission: boolean = false;
    get permission(): boolean {
        return this._permission;
    }

    private _subscribeUserDB() {
        if (this.customerDB$.getValue().length > 0) return;

        //확정된 예약에 대해 sub을 걸고, 개별 변경 대응
        // this.store
        //     .collection(BOOKING_COLLECTION)
        //     .ref.where('status', '!=', 'ready')
        //     .get()
        //     .then((snapshot) => {
        //         snapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
        //             doc.ref.onSnapshot((v) => {
        //                 let db = this.customerDB$.getValue();
        //                 let user = v.data() as CustomerInfo;
        //                 user.date = Moment(user.date.toDate());
        //                 user.person = Number(user.person) | 0;
        //                 user.kids = Number(user.kids) | 0;
        //                 user.flatTable = Number(user.flatTable) | 0;
        //                 user.dechTable = Number(user.dechTable) | 0;

        //                 if (
        //                     db.filter((oldUser) => oldUser['id'] === user.id)[0]
        //                 ) {
        //                     const index = db.findIndex(
        //                         (oldUser) => oldUser.id === user.id
        //                     );
        //                     db[index] = user;
        //                     db = db.filter((item) => item);
        //                     this.customerDB$.next(
        //                         db.sort((a, b) => this._sortList(a, b))
        //                     );
        //                 } else {
        //                     this.customerDB$.next(
        //                         [...db, user].sort((a, b) =>
        //                             this._sortList(a, b)
        //                         )
        //                     );
        //                 }
        //             });
        //         });
        //     });

        // // 신규 DB(ready)는 새로 sub을 걸어야 해.
        // this.store
        //     .collection(BOOKING_COLLECTION, (ref) =>
        //         ref.where('status', '==', 'ready')
        //     )
        //     .snapshotChanges()
        //     .subscribe((actions) => {
        //         actions.forEach((action) => {
        //             const id = action.payload.doc.id;
        //             //신규인 경우만 새로 Sub
        //             if (
        //                 this.customerDB$
        //                     .getValue()
        //                     .filter((u) => u['id'] === id).length === 0
        //             ) {
        //                 this.store
        //                     .collection(BOOKING_COLLECTION)
        //                     .doc(id)
        //                     .ref.onSnapshot((v) => {
        //                         let db = this.customerDB$.getValue();
        //                         let user = v.data() as CustomerInfo;
        //                         user.date = Moment(user.date.toDate());
        //                         user.person = Number(user.person) | 0;
        //                         user.kids = Number(user.kids) | 0;
        //                         user.flatTable = Number(user.flatTable) | 0;
        //                         user.dechTable = Number(user.dechTable) | 0;

        //                         if (
        //                             db.filter(
        //                                 (oldUser) => oldUser['id'] === user.id
        //                             )[0]
        //                         ) {
        //                             const index = db.findIndex(
        //                                 (oldUser) => oldUser.id === user.id
        //                             );
        //                             db[index] = user;
        //                             db = db.filter((item) => item);
        //                             this.customerDB$.next(
        //                                 db.sort((a, b) => this._sortList(a, b))
        //                             );
        //                         } else {
        //                             this.customerDB$.next(
        //                                 [...db, user].sort((a, b) =>
        //                                     this._sortList(a, b)
        //                                 )
        //                             );
        //                         }
        //                     });
        //             }
        //         });
        //     });

        //TEST MODE
        const customerDB: CustomerInfo[] = [];
        DB.forEach((db) => {
            customerDB.push({
                ...(db as any),
                date: Moment(db.date),
            });
        });
        this.customerDB$.next(customerDB);
    }

    private _sortList(a: CustomerInfo, b: CustomerInfo) {
        // 1) "날짜"가 빠를수록 정렬
        const dateA = new Date(a['date'].toDate());
        const dateB = new Date(b['date'].toDate());
        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }

        // 2) "상태"가 "대기" > "수정" > "예약" > "방문" > "완료" > "취소" 순서로 정렬
        const statusOrder = {
            ready: 0,
            paymentReady: 1,
            confirming: 2,
            bookingComplete: 3,
            cancel: 4,
        };
        const statusA = statusOrder[a['status']];
        const statusB = statusOrder[b['status']];
        if (statusA < statusB) {
            return -1;
        }
        if (statusA > statusB) {
            return 1;
        }

        return 0; // 동일한 경우 유지
    }

    add(bookingInfo: CustomerInfo): Promise<CustomerInfo> {
        return this.bookingService.add(bookingInfo).then((v) => {
            this.snackBar.open(`${v.name}님 추가 성공`, null, {
                duration: 2000,
            });
            return v;
        });
    }
    update(bookingInfo: CustomerInfo): Promise<CustomerInfo> {
        return this.bookingService
            .update(
                bookingInfo,
                this.customerDB$.getValue().find((v) => v.id === bookingInfo.id)
            )
            .then((v) => {
                this.snackBar.open(`${v.name}님 업데이트 성공`, null, {
                    duration: 2000,
                });
                return v;
            });
    }
    delete(id: string): Promise<string> {
        return this.store
            .collection(BOOKING_COLLECTION)
            .doc(id)
            .delete()
            .then(() => {
                //Update Calender (기존에 이미 Cancel 상태면 안해도 된다.)
                const user = this.customerDB$
                    .getValue()
                    .find((v) => v.id === id);

                this.snackBar.open(`${user.name}님 삭제 성공`, null, {
                    duration: 2000,
                });
                if (user.status !== 'cancel') {
                    return this.calendarService
                        .update({ ...user, status: 'cancel' }, user)
                        .then(() => user.id);
                }
                return id;
            })
            .catch((e) => {
                throw new Error(
                    '삭제 과정에서 서버 오류 발생 :' + id + ', ' + e
                );
            });
    }
}
