import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyTombolaPage } from './my-tombola.page';

describe('MyTombolaPage', () => {
  let component: MyTombolaPage;
  let fixture: ComponentFixture<MyTombolaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyTombolaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
