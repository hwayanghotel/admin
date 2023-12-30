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
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { GuestDetailComponent } from './guest-detail/guest-detail.component';
import { CalendarV1Component } from './calendar-v1/calendar-v1.component';
import { HttpClientModule } from '@angular/common/http';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        GuestListComponent,
        FooterComponent,
        GuestDetailComponent,
        CalendarV1Component,
        CalendarComponent,
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
    providers: [HolidayService, ManagerService],
    bootstrap: [AppComponent],
})
export class AppModule {}
