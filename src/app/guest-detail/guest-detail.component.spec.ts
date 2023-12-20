import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDetailComponent } from './guest-detail.component';

describe('GuestDetailComponent', () => {
  let component: GuestDetailComponent;
  let fixture: ComponentFixture<GuestDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestDetailComponent]
    });
    fixture = TestBed.createComponent(GuestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
