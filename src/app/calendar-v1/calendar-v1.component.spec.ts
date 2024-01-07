/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CalendarV1Component } from './calendar-v1.component';

describe('CalendarV1Component', () => {
    let component: CalendarV1Component;
    let fixture: ComponentFixture<CalendarV1Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CalendarV1Component],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CalendarV1Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
