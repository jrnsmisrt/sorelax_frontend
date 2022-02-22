import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTimeslotComponent } from './create-timeslot.component';

describe('CreateTimeslotComponent', () => {
  let component: CreateTimeslotComponent;
  let fixture: ComponentFixture<CreateTimeslotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTimeslotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTimeslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
