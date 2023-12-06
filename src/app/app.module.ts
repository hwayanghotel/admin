import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [AppComponent, HomeComponent],
    imports: [BrowserModule, AppRoutingModule, MatIconModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
