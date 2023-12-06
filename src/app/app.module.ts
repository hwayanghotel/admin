import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { GuestListComponent } from './guest-list/guest-list.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from './material.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        GuestListComponent,
        FooterComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, MaterialModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
