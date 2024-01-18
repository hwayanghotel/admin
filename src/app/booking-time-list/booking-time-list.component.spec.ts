import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTimeListComponent } from './booking-time-list.component';

describe('BookingTimeListComponent', () => {
  let component: BookingTimeListComponent;
  let fixture: ComponentFixture<BookingTimeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingTimeListComponent]
    });
    fixture = TestBed.createComponent(BookingTimeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
