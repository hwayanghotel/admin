// import { Injectable } from '@angular/core';
// import {
//     AngularFirestore,
//     QueryDocumentSnapshot,
// } from '@angular/fire/compat/firestore';
// import { CustomerInfo } from 'reservation/booking/booking.component.interface';
// import { BehaviorSubject, debounceTime } from 'rxjs';
// import * as Moment from 'moment';
// import { BookingService } from 'reservation/service/booking/booking.service';

// const TEST_DB = 'USER_DB';

// @Injectable({
//     providedIn: 'root',
// })
// export class TestDbService {
//     downloadDBs$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

//     private id = 231207144600;
//     private status: any = [
//         'ready',
//         'paymentReady',
//         'confirming',
//         'bookingComplete',
//         'cancel',
//     ];

//     constructor(
//         private store: AngularFirestore,
//         private bookingService: BookingService
//     ) {
//         this.downloadDBs$.pipe(debounceTime(2000)).subscribe((v) => {
//             console.warn('downloadDBs', v);
//             let db: CustomerInfo[] = [];

//             v.forEach((item) => {
//                 let user: CustomerInfo = {
//                     id: this.id.toString(),
//                     customerMemo: item['관리자메모'] ? item['관리자메모'] : '',
//                     neungiBaeksuk: Math.floor(Math.random() * 17),
//                     baeksuk: Math.floor(Math.random() * 17),
//                     mushroomStew: Math.floor(Math.random() * 17),
//                     mushroomStewForTwoPeople: Math.floor(Math.random() * 17),
//                     flatTable: Math.floor(Math.random() * 7),
//                     dechTable: Math.floor(Math.random() * 7),
//                     person: Math.floor(Math.random() * 30),
//                     kids: Math.floor(Math.random() * 5),
//                     date: Moment(item['예약일'])
//                         .add('month', 4)
//                         .add('hour', Math.floor(Math.random() * 8) + 10)
//                         .add('minutes', Math.floor(Math.random() * 2) * 30),
//                     name: item['성함'],
//                     tel: item['전화번호'],
//                     status: this.status[Math.floor(Math.random() * 4)],
//                     cars: this._getCars(),
//                 };
//                 this.id++;

//                 db.push(user);
//             });

//             console.warn('db complete', db);

//             db.forEach((v) => {
//                 this.bookingService.add(v);
//             });
//         });
//     }

//     private _getCars(): string[] {
//         let cars: string[] = [];
//         let num = Math.floor(Math.random() * 10);
//         for (let i = 0; i < num; i++) {
//             cars.push(String(Math.floor(Math.random() * 8000) + 1000));
//         }
//         return cars;
//     }

//     test() {
//         this.store
//             .collection(TEST_DB)
//             .get()
//             .subscribe((snapshot) => {
//                 snapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
//                     doc.ref.onSnapshot((v) => {
//                         this.downloadDBs$.next([
//                             ...this.downloadDBs$.getValue(),
//                             v.data(),
//                         ]);
//                     });
//                 });
//             });
//     }
// }
