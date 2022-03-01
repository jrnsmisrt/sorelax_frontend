import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingOverviewComponent } from './admin-booking-overview.component';

describe('AdminBookingOverviewComponent', () => {
  let component: AdminBookingOverviewComponent;
  let fixture: ComponentFixture<AdminBookingOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBookingOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBookingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
