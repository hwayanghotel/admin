import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { GuestDetailComponent } from './guest-detail/guest-detail.component';
import { CalendarComponent } from './calendar/calendar.component';
import { BookingParkingComponent } from 'reservation/booking/booking-parking/booking-parking.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'guest-list', component: GuestListComponent },
    { path: 'guest-detail', component: GuestDetailComponent },
    { path: 'calendar', component: CalendarComponent },
    { path: 'booking-parking', component: BookingParkingComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
