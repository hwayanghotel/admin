import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTimelineComponent } from './booking-timeline.component';

describe('BookingTimelineComponent', () => {
    let component: BookingTimelineComponent;
    let fixture: ComponentFixture<BookingTimelineComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BookingTimelineComponent],
        });
        fixture = TestBed.createComponent(BookingTimelineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
