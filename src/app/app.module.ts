import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'reservation/environments/environment';
import { HolidayService } from 'reservation/service/holiday/holiday.service';
import { ManagerService } from './manager.service';
import { AppComponent } from './app.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { GuestDetailComponent } from './guest-detail/guest-detail.component';
import { CalendarV1Component } from './calendar-v1/calendar-v1.component';
import { HttpClientModule } from '@angular/common/http';
import { CalendarComponent } from './calendar/calendar.component';
import { SMSService } from './sms.service';
import { BookingParkingComponent } from 'reservation/booking/booking-parking/booking-parking.component';
import { MediatorService } from 'reservation/service/mediator/mediator.service';
import { AdminComponent } from './admin/admin.component';
import { BookingTimeListComponent } from './booking-time-list/booking-time-list.component';

@NgModule({
    declarations: [
        AppComponent,
        GuestListComponent,
        GuestDetailComponent,
        CalendarV1Component,
        CalendarComponent,
        BookingParkingComponent,
        AdminComponent,
        BookingTimeListComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        MaterialModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        HttpClientModule,
    ],
    providers: [HolidayService, ManagerService, SMSService, MediatorService],
    bootstrap: [AppComponent],
})
export class AppModule {}
