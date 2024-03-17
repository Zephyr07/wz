import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyOrderPage } from './my-order.page';

describe('MyOrderPage', () => {
  let component: MyOrderPage;
  let fixture: ComponentFixture<MyOrderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
