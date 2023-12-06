import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { GuestListComponent } from './guest-list/guest-list.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { HolidayService } from 'reservation/service/holiday/holiday.service';
import { ManagerService } from './manager.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'reservation/environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        GuestListComponent,
        FooterComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        MaterialModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
    ],
    providers: [HolidayService, ManagerService],
    bootstrap: [AppComponent],
})
export class AppModule {}
