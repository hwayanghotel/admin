import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestListComponent } from './guest-list/guest-list.component';
import { GuestDetailComponent } from './guest-detail/guest-detail.component';
import { CalendarComponent } from './calendar/calendar.component';
import { BookingParkingComponent } from 'reservation/booking/booking-parking/booking-parking.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
    { path: '', redirectTo: 'admin', pathMatch: 'full' },
    { path: 'admin', component: AdminComponent },
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
