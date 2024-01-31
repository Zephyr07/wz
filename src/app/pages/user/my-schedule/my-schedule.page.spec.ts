import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MySchedulePage } from './my-schedule.page';

describe('MySchedulePage', () => {
  let component: MySchedulePage;
  let fixture: ComponentFixture<MySchedulePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MySchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
