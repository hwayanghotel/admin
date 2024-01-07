import { Injectable } from '@angular/core';
import { CustomerInfo } from 'reservation/booking/booking.component.interface';

@Injectable({
    providedIn: 'root',
})
export class SMSService {
    constructor() {}

    sendGroupSMS(
        guests: CustomerInfo[],
        type?: 'BeforeVisit' | 'Account' | 'Confirm' | 'BookingInfo'
    ) {
        let tels: string[] = guests.map((v) => v.tel);
        let url = `sms:${tels}`;

        if (type === 'BeforeVisit') {
            url += `?body=${encodeURIComponent(
                SMSTextParking.replace('NAME님 ', '').replace(
                    'URIRESOURCE',
                    'type=search'
                )
            )}`;
        } else if (type === 'Confirm') {
            url += `?body=${encodeURIComponent(
                SMStextForConfirm.replace('NAME님 ', '')
                    .replace('TYPE ', '')
                    .replace('URIRESOURCE', 'type=search')
            )}`;
        } else if (type === 'Account') {
            url += `?body=${encodeURIComponent(
                SMStextForAccount.replace('NAME님 ', '').replace(
                    '- 예약금: MONEY원',
                    ''
                )
            )}`;
        } else if (type === 'BookingInfo') {
            url += `?body=${encodeURIComponent(SMStextForBookingInfo)}`;
        }

        location.href = url;
    }

    getSMSText(
        guest: CustomerInfo,
        type?: 'BeforeVisit' | 'Account' | 'Confirm' | 'BookingInfo'
    ): string {
        if (type === 'BeforeVisit') {
            return encodeURIComponent(
                SMSTextParking.replace('NAME', guest.name).replace(
                    'URIRESOURCE',
                    `id=${guest.id}`
                )
            );
        } else if (type === 'Account') {
            return encodeURIComponent(
                SMStextForAccount.replace('NAME', guest.name).replace(
                    'MONEY',
                    String(guest.deposit)
                )
            );
        } else if (type === 'Confirm') {
            return encodeURIComponent(
                SMStextForConfirm.replace('NAME', guest.name).replace(
                    'URIRESOURCE',
                    `id=${guest.id}`
                )
            );
        } else if (type === 'BookingInfo') {
            return encodeURIComponent(SMStextForBookingInfo);
        }
        return '';
    }
}

const SMSTextParking = `NAME님 안녕하세요? 능운대펜션입니다. 방문일이 다가와 연락드립니다.
필요한 경우, 아래 링크에 접속하시어 <차량등록>, <식사예약> 등 사전 정보를 입력해주시기 바랍니다.
https://hwayanghotel.github.io/#/reservation?URIRESOURCE
감사합니다.`;

const SMStextForAccount = `NAME님 안녕하세요. 능운대펜션입니다. 입금 계좌 정보를 안내드립니다.
입금 순서대로 예약이 완료되며, 확인 후 연락드리겠습니다. 감사합니다.
- 입금계좌: 농협 352-0370-5919-43 (예금주: 정경미)
- 예약금: MONEY원`;

const SMStextForConfirm = `NAME님 안녕하세요. 능운대펜션입니다. 예약 확정되어 안내드립니다.
필요한 경우, 아래 링크에 접속하시어 <차량등록>, <식사예약> 등 사전 정보를 입력해주시기 바랍니다.
https://hwayanghotel.github.io/#/reservation?URIRESOURCE
감사합니다.`;

const SMStextForBookingInfo = `안녕하세요. 능운대펜션입니다.
아래 링크를 통해 <객실>, <평상>, <식사> 예약이 가능합니다.
공원 내 입차를 희망하시면, <차량정보>도 함께 적어주세요!
https://hwayanghotel.github.io/#/reservation
감사합니다.`;
